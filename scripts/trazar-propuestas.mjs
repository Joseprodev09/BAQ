/**
 * Traza las rutas propuestas sobre calles reales y coloca las paradas de hotel.
 *
 * Uso:  npm run rutas        (necesita Node 18 o superior; NO necesita internet)
 *
 * Qué hace, para cada ruta de data/rutas.json que tenga el campo "pasaPor":
 *   1. Calcula el camino por avenidas reales (scripts/red-vial.mjs, con data/mapa-base.json,
 *      R1, B1 y data/calles-locales.json como red vial) pasando, en orden,
 *      por los puntos de "pasaPor" (identificadores de estaciones o [lat, lon]).
 *      Quita los bucles y corta lo que sobra después de la última parada, para que
 *      el bus nunca repita la misma calle ni haga desvíos que no llevan a ninguna parada.
 *   2. Si la ruta tiene "paradasHotel": true, pone una parada en cada grupo de hoteles
 *      que queda a menos de 300 m del recorrido (hotel de data/hoteles.json). Las paradas
 *      de hotel se guardan en data/estaciones.json con "generada": true.
 *   3. Muestra un resumen de calidad (longitud, calles repetidas, desvío).
 *
 * Las paradas propuestas ("propuesta": true) se mueven al cruce de avenida más cercano
 * para que queden sobre el recorrido. R1 y B1 (rutas reales de Transmetro) no se tocan.
 *
 * Es seguro ejecutarlo varias veces: da el mismo resultado.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { RedVial, quitarBucles, aXY, aLatLon, dist, aSegmento } from './red-vial.mjs';

const archivo = (n) => new URL(`../data/${n}`, import.meta.url);
const leer = (n) => JSON.parse(readFileSync(archivo(n), 'utf8'));
const guardar = (n, datos) => writeFileSync(archivo(n), JSON.stringify(datos, null, 1) + '\n');

/** Un hotel cuenta como "en la ruta" si queda a menos de esta distancia (m) del recorrido. */
const HOTEL_MAX_M = 300;
/** Hoteles que quedan a menos de esto (m) de una parada existente usan esa parada. */
const HOTEL_CERCA_DE_PARADA_M = 220;
/** Largo máximo (m) de recorrido que abarca una sola parada de hoteles. */
const GRUPO_MAX_M = 350;
/** Una parada propuesta se puede mover como máximo esto (m) para quedar sobre una avenida. */
const AJUSTE_MAX_M = 300;

// ---------------------------------------------------------------- utilidades
/** Reduce puntos (Douglas-Peucker) sin separarse más de `tol` metros del camino original. */
function simplificar(pts, tol) {
  if (pts.length < 3) return pts;
  const mantener = new Uint8Array(pts.length);
  mantener[0] = mantener[pts.length - 1] = 1;
  const pila = [[0, pts.length - 1]];
  while (pila.length) {
    const [a, b] = pila.pop();
    let peor = 0;
    let donde = -1;
    for (let i = a + 1; i < b; i++) {
      const { d } = aSegmento(pts[i], pts[a], pts[b]);
      if (d > peor) {
        peor = d;
        donde = i;
      }
    }
    if (peor > tol) {
      mantener[donde] = 1;
      pila.push([a, donde], [donde, b]);
    }
  }
  return pts.filter((_, i) => mantener[i]);
}

/** Distancia acumulada a lo largo de una línea de puntos [x, y]. */
function acumulada(pts) {
  const s = [0];
  for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + dist(pts[i - 1], pts[i]));
  return s;
}

/** Proyecta un punto sobre la línea: { d: metros a la línea, s: metros desde el inicio }. Solo busca desde `desde`. */
function proyectar(linea, acum, p, desde = 0) {
  let mejor = { d: Infinity, s: desde };
  for (let i = 1; i < linea.length; i++) {
    if (acum[i] < desde) continue;
    const { d, t } = aSegmento(p, linea[i - 1], linea[i]);
    const s = acum[i - 1] + t * (acum[i] - acum[i - 1]);
    if (s >= desde && d < mejor.d) mejor = { d, s };
  }
  return mejor;
}

/** Punto [x, y] de la línea a `s` metros del inicio. */
function puntoEn(linea, acum, s) {
  let i = 1;
  while (i < linea.length - 1 && acum[i] < s) i++;
  const t = (s - acum[i - 1]) / (acum[i] - acum[i - 1] || 1);
  return [linea[i - 1][0] + (linea[i][0] - linea[i - 1][0]) * t, linea[i - 1][1] + (linea[i][1] - linea[i - 1][1]) * t];
}

// ---------------------------------------------------------------- nombres de calles
/** Índice de los puntos con nombre de calle (de R1, B1 y calles-locales.json; vienen de OpenStreetMap). */
function indiceDeNombres(listasDePuntos) {
  const celdas = new Map();
  for (const puntos of listasDePuntos)
    for (const [lat, lon, via, cruce] of puntos) {
      if (!via) continue;
      const xy = aXY(lat, lon);
      const k = Math.floor(xy[0] / 60) + ',' + Math.floor(xy[1] / 60);
      if (!celdas.has(k)) celdas.set(k, []);
      celdas.get(k).push({ xy, via, cruce });
    }
  return (xy) => {
    const cx = Math.floor(xy[0] / 60);
    const cy = Math.floor(xy[1] / 60);
    let mejor = null;
    let menor = 60;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (const c of celdas.get(cx + dx + ',' + (cy + dy)) || []) {
          const d = dist(c.xy, xy);
          if (d < menor) {
            menor = d;
            mejor = c;
          }
        }
    return mejor;
  };
}

// ---------------------------------------------------------------- principal
function main() {
  const rutas = leer('rutas.json');
  const datosEstaciones = leer('estaciones.json');
  const hoteles = leer('hoteles.json').hoteles;
  const base = leer('mapa-base.json');

  // Se quitan las paradas de hotel de una ejecución anterior: se vuelven a generar.
  datosEstaciones.estaciones = datosEstaciones.estaciones.filter((e) => !e.generada);
  for (const r of rutas.rutas) r.estaciones = r.estaciones.filter((id) => !id.startsWith('hp-'));
  const estacion = Object.fromEntries(datosEstaciones.estaciones.map((e) => [e.id, e]));

  // 1. Red vial: vías de OpenStreetMap + R1 y B1 + calles locales por donde ya pasaban las rutas propuestas.
  //    Las rutas propuestas NO se usan como entrada: así el resultado no depende de la ejecución anterior.
  const reales = rutas.rutas.filter((r) => r.tipo !== 'propuesta');
  const locales = leer('calles-locales.json').calles;
  const nombres = indiceDeNombres([
    ...reales.map((r) => r.trazado.map((p) => [p.lat, p.lon, p.via, p.cruce])),
    ...locales.map((c) => c.puntos),
  ]);
  const red = new RedVial();
  const tipoVia = { troncal: 'troncal', primaria: 'primaria', secundaria: 'secundaria' };
  for (const v of base.vias) if (tipoVia[v.tipo]) red.agregarVia(v.puntos, tipoVia[v.tipo]);
  for (const r of reales)
    red.agregarVia(
      r.trazado.map((p) => [p.lat, p.lon]),
      'troncal',
    );
  for (const c of locales)
    red.agregarVia(
      c.puntos.map(([lat, lon]) => [lat, lon]),
      'local',
    );

  // 2. Las paradas propuestas se mueven a la avenida más cercana (si no están ya sobre una).
  const usadas = new Set(rutas.rutas.filter((r) => r.pasaPor).flatMap((r) => r.pasaPor.filter((p) => typeof p === 'string')));
  for (const e of datosEstaciones.estaciones) {
    if (!e.propuesta || e.fija || !usadas.has(e.id)) continue;
    // Primero una avenida; si no hay ninguna cerca (por ejemplo, en la vía de acceso al aeropuerto), la calle más cercana.
    let { nodo, metros } = red.masCercano(e.lat, e.lon, true);
    if (metros > AJUSTE_MAX_M) ({ nodo, metros } = red.masCercano(e.lat, e.lon));
    if (metros > AJUSTE_MAX_M) throw new Error(`La parada "${e.id}" está a ${Math.round(metros)} m de la calle más cercana`);
    const p = aLatLon(red.nodos[nodo]);
    e.lat = +p.lat.toFixed(5);
    e.lon = +p.lon.toFixed(5);
  }

  // 3. Trazar cada ruta que pida "pasaPor".
  const resumen = [];
  for (const ruta of rutas.rutas.filter((r) => r.pasaPor)) {
    const puntosClave = ruta.pasaPor.map((p) => {
      if (typeof p === 'string') {
        const e = estacion[p];
        if (!e) throw new Error(`${ruta.id}: la parada "${p}" de pasaPor no existe`);
        return [e.lat, e.lon];
      }
      return p;
    });
    const nodosClave = puntosClave.map(([lat, lon]) => red.masCercano(lat, lon).nodo);
    const circuito = nodosClave[0] === nodosClave[nodosClave.length - 1];

    let camino = [nodosClave[0]];
    for (let i = 1; i < nodosClave.length; i++) {
      const tramo = red.camino(nodosClave[i - 1], nodosClave[i]);
      if (!tramo) throw new Error(`${ruta.id}: no hay camino entre los puntos ${i} y ${i + 1} de pasaPor`);
      camino.push(...tramo.slice(1));
    }
    // En un circuito el último punto es el primero: los bucles se quitan sin ese cierre.
    const paradasNodo = new Set(nodosClave);
    camino = circuito ? [...quitarBucles(camino.slice(0, -1), paradasNodo), camino[0]] : quitarBucles(camino, paradasNodo);
    let linea = simplificar(
      camino.map((i) => red.nodos[i]),
      4,
    );

    // Cada parada tiene que quedar sobre el recorrido.
    let acum = acumulada(linea);
    let desde = 0;
    const sParadas = ruta.estaciones.map((id) => {
      const e = estacion[id];
      const { d, s } = proyectar(linea, acum, aXY(e.lat, e.lon), desde);
      if (d > 60) throw new Error(`${ruta.id}: la parada "${e.nombre}" queda a ${Math.round(d)} m del recorrido; agrégala a pasaPor`);
      desde = s;
      return s;
    });
    // Se recorta lo que sobra antes de la primera y después de la última parada.
    if (!circuito) {
      const ini = sParadas[0];
      const fin = sParadas[sParadas.length - 1];
      const dentro = linea
        .map((p, i) => ({ p, s: acum[i] }))
        .filter(({ s }) => s > ini + 1 && s < fin - 1)
        .map(({ p }) => p);
      linea = [puntoEn(linea, acum, ini), ...dentro, puntoEn(linea, acum, fin)];
      acum = acumulada(linea);
    }

    // 4. Paradas de hotel.
    const generadas = [];
    if (ruta.paradasHotel) {
      let desdeP = 0;
      const posiciones = ruta.estaciones.map((id) => {
        const { s } = proyectar(linea, acum, aXY(estacion[id].lat, estacion[id].lon), desdeP);
        desdeP = s;
        return { id, s, xy: puntoEn(linea, acum, s) };
      });
      const candidatos = hoteles
        .map((h) => {
          const xy = aXY(h.lat, h.lon);
          const { d, s } = proyectar(linea, acum, xy);
          return { h, xy, d, s };
        })
        .filter((c) => c.d <= HOTEL_MAX_M)
        .sort((a, b) => a.s - b.s);

      const grupos = [];
      for (const c of candidatos) {
        const g = grupos[grupos.length - 1];
        if (g && c.s - g[0].s <= GRUPO_MAX_M) g.push(c);
        else grupos.push([c]);
      }
      for (const g of grupos) {
        const s = g.reduce((suma, c) => suma + c.s, 0) / g.length;
        const xy = puntoEn(linea, acum, s);
        // Si ya hay una parada muy cerca, esos hoteles bajan ahí.
        if (posiciones.some((p) => dist(p.xy, xy) < HOTEL_CERCA_DE_PARADA_M)) continue;
        g.sort((a, b) => dist(a.xy, xy) - dist(b.xy, xy));
        const { lat, lon } = aLatLon(xy);
        generadas.push({
          id: `hp-${ruta.id.toLowerCase()}-${generadas.length + 1}`,
          nombre: g.length === 1 ? g[0].h.nombre : `${g[0].h.nombre} + ${g.length - 1}`,
          lat: +lat.toFixed(5),
          lon: +lon.toFixed(5),
          tipo: 'hotel',
          propuesta: true,
          generada: true,
          hoteles: g.map((c) => c.h.nombre),
          s,
        });
      }
      // Se insertan en el orden del recorrido (en un circuito, la última parada vuelve a ser la primera).
      const todas = [...posiciones.map((p) => ({ id: p.id, s: p.s })), ...generadas.map((e) => ({ id: e.id, s: e.s }))];
      todas.sort((a, b) => a.s - b.s);
      ruta.estaciones = todas.map((x) => x.id);
      for (const e of generadas) {
        delete e.s;
        datosEstaciones.estaciones.push(e);
        estacion[e.id] = e;
      }
    }

    // 5. Guardar el trazado con el nombre de la calle de cada punto.
    let ultimo = { via: '', cruce: '' };
    let desdeUltimo = 0;
    ruta.trazado = linea.map((xy, i) => {
      if (i) desdeUltimo += dist(linea[i - 1], xy);
      const n = nombres(xy);
      if (n) {
        ultimo = { via: n.via, cruce: n.cruce };
        desdeUltimo = 0;
      } else if (desdeUltimo > 300) ultimo = { via: '', cruce: '' };
      const { lat, lon } = aLatLon(xy);
      return { lat: +lat.toFixed(5), lon: +lon.toFixed(5), via: ultimo.via, cruce: ultimo.cruce };
    });

    // 6. Calidad.
    const largo = acum[acum.length - 1];
    const ordenadas = ruta.estaciones.map((id) => aXY(estacion[id].lat, estacion[id].lon));
    let recta = 0;
    for (let i = 1; i < ordenadas.length; i++) recta += dist(ordenadas[i - 1], ordenadas[i]);
    resumen.push({
      ruta: ruta.id,
      km: +(largo / 1000).toFixed(1),
      paradas: ruta.estaciones.length,
      hoteles: generadas.length,
      desvio: +(largo / recta).toFixed(2),
    });
  }

  guardar('rutas.json', rutas);
  guardar('estaciones.json', datosEstaciones);
  console.table(resumen);
  console.log('Listo. Ejecuta "npm test" para comprobar que los datos siguen siendo coherentes.');
}

main();
