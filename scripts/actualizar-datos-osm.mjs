/**
 * Actualiza los datos del simulador desde OpenStreetMap.
 *
 * Uso:  npm run datos        (necesita Node 18 o superior e internet)
 *
 * Qué hace:
 *   1. Descarga el trazado de cada ruta de data/rutas.json (campo relacionOSM)
 *      y recalcula, para cada punto, la avenida y la calle o carrera que cruza.
 *   2. Descarga los hoteles a menos de 600 m del corredor y los guarda en
 *      data/hoteles-osm.json para revisarlos (NO reemplaza data/hoteles.json:
 *      copia a mano los que quieras usar).
 *   3. Descarga las vías principales y el río para el fondo del mapa
 *      (data/mapa-base.json).
 *
 * Las estaciones (data/estaciones.json) se mantienen a mano porque usan
 * identificadores propios (ps, pg, pr...).
 *
 * Usa la API pública Overpass. Si un servidor no responde, prueba el siguiente.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SERVIDORES = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const CAJA = '10.895,-74.835,11.015,-74.755'; // sur, oeste, norte, este
const hoy = new Date().toISOString().slice(0, 10);
const archivo = (n) => new URL(`../data/${n}`, import.meta.url);
const leer = (n) => JSON.parse(readFileSync(archivo(n), 'utf8'));
const guardar = (n, datos) => writeFileSync(archivo(n), JSON.stringify(datos, null, 1) + '\n');

async function overpass(consulta) {
  for (const url of SERVIDORES) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(consulta),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const texto = await r.text();
      if (r.ok && texto.startsWith('{')) return JSON.parse(texto).elements;
      console.warn(`  ${url} respondió ${r.status}; probando otro servidor...`);
    } catch (e) {
      console.warn(`  ${url} falló (${e.message}); probando otro servidor...`);
    }
  }
  throw new Error('Ningún servidor Overpass respondió. Intenta más tarde.');
}

// --- Geometría simple en metros ---
const KX = 111320 * Math.cos((10.95 * Math.PI) / 180);
const KY = 110574;
const d = (a, b) => Math.hypot((a.lat - b.lat) * KY, (a.lon - b.lon) * KX);
function distanciaASegmento(p, a, b) {
  const ax = (a.lon - p.lon) * KX,
    ay = (a.lat - p.lat) * KY,
    bx = (b.lon - p.lon) * KX,
    by = (b.lat - p.lat) * KY;
  const dx = bx - ax,
    dy = by - ay;
  const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(ax + t * dx, ay + t * dy);
}
const distanciaAVia = (p, via) =>
  Math.min(...via.geometry.slice(1).map((q, i) => distanciaASegmento(p, via.geometry[i], q)));

/** Une las vías de una relación en una sola línea, empezando en el punto de inicio. */
function unirVias(relacion, inicio) {
  const vias = relacion.members
    .filter((m) => m.type === 'way' && !/stop|platform/.test(m.role) && m.geometry)
    .map((m) => m.geometry);
  const linea = [inicio];
  let actual = inicio;
  while (vias.length) {
    let mejor = { i: -1, dist: Infinity, invertir: false };
    vias.forEach((v, i) => {
      const a = d(actual, v[0]),
        b = d(actual, v[v.length - 1]);
      if (a < mejor.dist) mejor = { i, dist: a, invertir: false };
      if (b < mejor.dist) mejor = { i, dist: b, invertir: true };
    });
    if (mejor.dist > 400) break; // salto grande: el resto no continúa la ruta
    let v = vias.splice(mejor.i, 1)[0];
    if (mejor.invertir) v = [...v].reverse();
    linea.push(...v);
    actual = v[v.length - 1];
  }
  // Simplifica: un punto cada 30 m como mínimo.
  const simple = [linea[0]];
  for (const p of linea) if (d(p, simple[simple.length - 1]) > 30) simple.push(p);
  simple.push(linea[linea.length - 1]);
  return simple;
}

async function main() {
  const rutas = leer('rutas.json');
  const estaciones = Object.fromEntries(leer('estaciones.json').estaciones.map((e) => [e.id, e]));
  const ids = rutas.rutas.map((r) => r.relacionOSM).join(',');

  console.log('1/3 Descargando trazados de las rutas...');
  const relaciones = await overpass(`[out:json][timeout:120];rel(id:${ids});out geom;`);
  console.log('    Descargando nombres de calles cercanas...');
  const calles = (
    await overpass(
      `[out:json][timeout:150];rel(id:${ids});way(r)->.w;way["highway"]["name"](around.w:70);out tags geom;`,
    )
  ).filter((c) => c.tags.name !== 'Transmetro');

  for (const ruta of rutas.rutas) {
    const rel = relaciones.find((r) => r.id === ruta.relacionOSM);
    if (!rel) throw new Error(`No se encontró la relación ${ruta.relacionOSM} (${ruta.id})`);
    const inicio = estaciones[ruta.estaciones[0]];
    ruta.trazado = unirVias(rel, { lat: inicio.lat, lon: inicio.lon }).map((p) => {
      const cercanas = calles.map((c) => [distanciaAVia(p, c), c.tags.name]).sort((a, b) => a[0] - b[0]);
      const via = cercanas[0]?.[1] || '';
      const cruce = cercanas.find(([dist, nombre]) => nombre !== via && dist < 150)?.[1] || '';
      return { lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5), via, cruce };
    });
    console.log(`    ${ruta.id}: ${ruta.trazado.length} puntos`);
  }
  rutas.consultado = hoy;
  guardar('rutas.json', rutas);

  console.log('2/3 Descargando hoteles cerca del corredor...');
  const hoteles = await overpass(
    `[out:json][timeout:120];rel(id:${ids});way(r)->.w;nwr["tourism"~"hotel|hostel|guest_house|apartment"](around.w:600);out center tags;`,
  );
  guardar('hoteles-osm.json', {
    fuente: 'OpenStreetMap (© colaboradores de OpenStreetMap, licencia ODbL)',
    consultado: hoy,
    nota: 'Lista para revisar. Copia a data/hoteles.json los hoteles que quieras usar.',
    hoteles: hoteles
      .filter((h) => h.tags.name)
      .map((h) => {
        const c = h.center || h;
        const t = h.tags;
        return {
          nombre: t.name,
          lat: +c.lat.toFixed(5),
          lon: +c.lon.toFixed(5),
          direccion: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' # '),
          tipo: t.tourism,
          web: t.website || '',
        };
      }),
  });
  console.log(`    ${hoteles.length} encontrados → data/hoteles-osm.json`);

  console.log('3/3 Descargando vías principales y río...');
  const vias = await overpass(
    `[out:json][timeout:150];(way["highway"~"^(trunk|primary|secondary)$"](${CAJA});way["waterway"="river"](${CAJA}););out tags geom;`,
  );
  const tipo = (t) =>
    t.waterway ? 'rio' : { trunk: 'troncal', primary: 'primaria', secondary: 'secundaria' }[t.highway];
  guardar('mapa-base.json', {
    fuente: 'OpenStreetMap (© colaboradores de OpenStreetMap, licencia ODbL)',
    consultado: hoy,
    nota: 'Vías principales y río simplificados para el fondo del mapa.',
    vias: vias
      .map((v) => {
        const pts = [v.geometry[0]];
        for (const p of v.geometry) if (d(p, pts[pts.length - 1]) > 110) pts.push(p);
        pts.push(v.geometry[v.geometry.length - 1]);
        return { tipo: tipo(v.tags), puntos: pts.map((p) => [+p.lat.toFixed(4), +p.lon.toFixed(4)]) };
      })
      .filter((v) => v.puntos.length > 2),
  });
  console.log('Listo. Ejecuta "npm test" para comprobar que los datos siguen siendo coherentes.');
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
