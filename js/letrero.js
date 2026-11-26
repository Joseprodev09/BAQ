/**
 * Letrero de señalización para turistas (propuesta): muestra la próxima
 * estación, qué hotel o atractivo queda cerca y cuánto se camina, en
 * español, inglés o portugués.
 */
import { $, escapar } from './utils.js';
import { TEXTOS } from './i18n.js';
import { ICONOS } from './iconos.js';
import { describirDireccion } from './geo.js';

export function mostrarLetrero(estado, ruta, { idioma, elegidos }) {
  const t = TEXTOS[idioma];
  const objetivo = estado.enEstacion ? estado.actual : estado.proxima || estado.actual;
  const indice = ruta.paradas.indexOf(objetivo);
  const esUltima = indice === ruta.paradas.length - 1;

  const insignia = $('sBadge');
  insignia.textContent = ruta.id;
  insignia.style.background = ruta.color;
  $('sDest').textContent = '→ ' + ruta.destino;
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
  if (objetivo.id === 'jb' || objetivo.id === 'pr') renglones.push([ICONOS.estadio, t.estadio, '']);
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
