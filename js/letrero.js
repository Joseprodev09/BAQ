/**
 * Letrero de señalización para turistas (propuesta): muestra la próxima
 * estación, qué hotel o atractivo queda cerca y cuánto se camina, en
 * español, inglés o portugués.
 */
import { $, escapar } from './utils.js';
import { TEXTOS } from './i18n.js';
import { ICONOS } from './iconos.js';
import { describirDireccion } from './geo.js';

/** Distancia mínima (m) para dar una flecha direccional; más cerca se indica «aquí». */
const AQUI_M = 25;
const metros = (m) => (Math.abs(m) >= 1000 ? (Math.abs(m) / 1000).toFixed(1) + ' km' : Math.round(Math.abs(m) / 10) * 10 + ' m');

/**
 * Flecha para llegar a `destino` desde la posición del bus, según hacia dónde
 * avanza el bus: ↑ adelante, → derecha, ← izquierda, ↓ atrás. Es una guía
 * calculada con el trazado; las flechas reales se verifican en campo.
 */
export function flechaHacia(ruta, s, destino) {
  const adelante = s + 25 <= ruta.total;
  const a = ruta.posicionEn(adelante ? s : s - 25).xy;
  const b = ruta.posicionEn(adelante ? s + 25 : s).xy;
  const h = [b[0] - a[0], b[1] - a[1]];
  const v = [destino[0] - ruta.posicionEn(s).xy[0], destino[1] - ruta.posicionEn(s).xy[1]];
  const grados = (Math.atan2(h[0] * v[1] - h[1] * v[0], h[0] * v[0] + h[1] * v[1]) * 180) / Math.PI;
  const abs = Math.abs(grados);
  if (abs <= 35) return '↑';
  if (abs >= 145) return '↓';
  return grados > 0 ? '→' : '←'; // el eje y del mapa crece hacia abajo
}

export function mostrarLetrero(estado, ruta, { idioma, elegidos, corredores = [] }) {
  const t = TEXTOS[idioma];
  const objetivo = estado.enEstacion ? estado.actual : estado.proxima || estado.actual;
  const indice = ruta.paradas.indexOf(objetivo);
  const esUltima = indice === ruta.paradas.length - 1;

  // Cabecera: color + código + destino + pictograma (diapositiva 6). Rutas actuales: color propio.
  const corredor = corredores.find((c) => c.codigo === ruta.corredor);
  const cab = $('sHead');
  cab.style.background = corredor ? corredor.color : ruta.color;
  cab.style.color = corredor ? corredor.texto : '#fff';
  $('sBadge').textContent = ruta.id;
  $('sName').textContent = corredor ? `${corredor.nombre.es} / ${corredor.nombre.en}` : ruta.destino;
  $('sDest').textContent = corredor ? ruta.destino : '';

  // Tres renglones de orientación: destino, estación y BAQ Point (punto de tarjeta más cercano por delante).
  const aqui = estado.enEstacion;
  const punto = estado.tarjetaAqui || estado.tarjetaSiguiente;
  const filas = [
    [ruta.destino, '↑', ''],
    ['Estación / Station', aqui ? '●' : flechaHacia(ruta, estado.s, objetivo.xy), aqui ? '' : metros(objetivo.s - estado.s)],
  ];
  if (punto) {
    const lejos = Math.abs(punto.s - estado.s) > AQUI_M;
    filas.push([
      'BAQ Point',
      lejos ? flechaHacia(ruta, estado.s, punto.xy) : '●',
      lejos ? metros(punto.s - estado.s) : '',
    ]);
  }
  $('sRows').innerHTML = filas
    .map(([n, f, d]) => `<li><b>${escapar(n)}</b>${d ? `<small>${escapar(d)}</small>` : ''}<span class="flecha" aria-hidden="true">${f}</span></li>`)
    .join('');

  $('sK').textContent = estado.enEstacion ? (esUltima ? t.fin : t.actual) : t.proxima;
  $('sSt').textContent = objetivo.nombre;
  $('sK2').textContent = t.ubicacion;
  $('sDir').textContent = describirDireccion(estado.punto, idioma); // en el idioma del letrero

  // Renglones del letrero: [icono, título, detalle]
  const renglones = [];
  ruta.hoteles
    .filter((h) => h.estacion === indice && elegidos.has(h.nombre))
    .forEach((h) =>
      renglones.push([
        ICONOS.hotel,
        `${t.bajeseAqui}: ${h.nombre}`,
        `${h.minutos} ${t.aPie}${h.direccion ? ' · ' + h.direccion : ''}`,
      ]),
    );
  if (['jb', 'pr', 'met'].includes(objetivo.id)) renglones.push([ICONOS.estadio, t.estadio, '']);
  if (objetivo.id === 'ja' || objetivo.id === 'ef') renglones.push([ICONOS.estadio, t.romelio, t.pocasCuadras]);
  if (objetivo.id === 'ps' || objetivo.id === 'ja') renglones.push([ICONOS.info, t.info, '']);
  renglones.push([ICONOS.tarjeta, t.tarifa, t.tarifaDetalle]);

  $('sList').innerHTML = renglones
    .slice(0, 4)
    .map(
      ([icono, titulo, detalle]) =>
        `<li><div class="pic">${icono}</div><div><b>${escapar(titulo)}</b>${detalle ? `<span>${escapar(detalle)}</span>` : ''}</div></li>`,
    )
    .join('');
}
