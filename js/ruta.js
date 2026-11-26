/**
 * Prepara una ruta para la simulación: calcula distancias acumuladas,
 * ubica cada estación sobre el trazado y asigna a cada hotel la estación
 * donde conviene bajarse.
 *
 * Una posición en la ruta se expresa como "s": metros recorridos desde el inicio.
 */
import { aMetros, distancia } from './geo.js';
import { FACTOR_CAMINATA, METROS_POR_MINUTO, CAMINATA_MAXIMA_METROS } from './config.js';

/**
 * @param {object} datosRuta   una entrada de data/rutas.json
 * @param {Array}  estaciones  lista de data/estaciones.json
 * @param {Array}  hoteles     lista de data/hoteles.json
 */
export function crearRuta(datosRuta, estaciones, hoteles) {
  // 1. Puntos del trazado en metros y distancia acumulada hasta cada punto.
  const puntos = datosRuta.trazado.map((p) => ({ ...p, xy: aMetros(p.lat, p.lon) }));
  const acumulado = [0];
  for (let i = 1; i < puntos.length; i++) {
    acumulado.push(acumulado[i - 1] + distancia(puntos[i - 1].xy, puntos[i].xy));
  }
  const total = acumulado[acumulado.length - 1];

  // Proyecta un punto sobre el trazado y devuelve su "s". Con "desde" solo busca
  // más adelante de esa distancia (necesario en circuitos que pasan dos veces
  // por la misma calle, como la ruta B03).
  function proyectar(xy, desde = 0) {
    let mejor = { d: Infinity, s: desde };
    for (let i = 1; i < puntos.length; i++) {
      if (acumulado[i] < desde) continue;
      const a = puntos[i - 1].xy;
      const b = puntos[i].xy;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      let t = ((xy[0] - a[0]) * dx + (xy[1] - a[1]) * dy) / (dx * dx + dy * dy || 1);
      t = Math.max(0, Math.min(1, t));
      const d = distancia([a[0] + t * dx, a[1] + t * dy], xy);
      const s = acumulado[i - 1] + t * (acumulado[i] - acumulado[i - 1]);
      if (d < mejor.d && s >= desde) mejor = { d, s };
    }
    return mejor.s;
  }

  // 2. Estaciones en el orden de la ruta, con su posición "s".
  const porId = Object.fromEntries(estaciones.map((e) => [e.id, e]));
  let anterior = 0;
  const paradas = datosRuta.estaciones.map((id, i, lista) => {
    const e = porId[id];
    if (!e) throw new Error(`La estación "${id}" de la ruta ${datosRuta.id} no existe en estaciones.json`);
    const xy = aMetros(e.lat, e.lon);
    let s = proyectar(xy, anterior);
    if (i === 0) s = 0; // la primera estación es el inicio
    if (i === lista.length - 1) s = total; // la última es el final
    anterior = s;
    return { ...e, xy, s };
  });

  // 3. Hoteles: estación más cercana y tiempo a pie.
  const hotelesRuta = hoteles
    .map((h) => {
      const xy = aMetros(h.lat, h.lon);
      let indice = 0;
      let menor = Infinity;
      paradas.forEach((p, i) => {
        const d = distancia(p.xy, xy);
        if (d < menor) {
          menor = d;
          indice = i;
        }
      });
      const caminata = menor * FACTOR_CAMINATA;
      return { ...h, xy, estacion: indice, caminata, minutos: Math.max(1, Math.round(caminata / METROS_POR_MINUTO)) };
    })
    .filter((h) => h.caminata < CAMINATA_MAXIMA_METROS)
    .sort((a, b) => a.estacion - b.estacion || a.caminata - b.caminata);

  /** Posición [x, y] y punto del trazado más cercano para una distancia s. */
  function posicionEn(s) {
    let i = 1;
    while (i < acumulado.length - 1 && acumulado[i] < s) i++;
    const a = puntos[i - 1];
    const b = puntos[i];
    const t = (s - acumulado[i - 1]) / (acumulado[i] - acumulado[i - 1] || 1);
    return {
      xy: [a.xy[0] + (b.xy[0] - a.xy[0]) * t, a.xy[1] + (b.xy[1] - a.xy[1]) * t],
      punto: t < 0.5 ? a : b,
    };
  }

  /** Índice de la última estación alcanzada en la distancia s. */
  function estacionAlcanzada(s) {
    let k = 0;
    paradas.forEach((p, i) => {
      if (p.s <= s + 1) k = i;
    });
    return k;
  }

  return {
    id: datosRuta.id,
    nombre: datosRuta.nombre,
    destino: datosRuta.destino,
    color: datosRuta.color,
    corredor: datosRuta.corredor || null,
    propuesta: datosRuta.tipo === 'propuesta',
    seBasaEn: datosRuta.seBasaEn,
    opera: datosRuta.opera,
    cuando: datosRuta.cuando,
    puntos,
    total,
    paradas,
    puntosTarjeta: paradas.filter((p) => p.tarjeta),
    hoteles: hotelesRuta,
    posicionEn,
    estacionAlcanzada,
  };
}
