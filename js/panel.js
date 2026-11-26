/**
 * Panel de estado al lado del mapa: dirección actual, hotel al que llegaron,
 * siguiente hotel y barra de progreso. Los textos salen de js/textos-ui.js.
 */
import { $ } from './utils.js';
import { formatoKm } from './geo.js';
import { t, getIdioma } from './idioma.js';

export function mostrarPanel(estado, ruta, simulador) {
  const { actual, proxima, enEstacion, hotelActual: h, hotelSiguiente: n } = estado;
  const km = (m) => formatoKm(m, getIdioma());
  const conDireccion = (texto, hotel) => texto + (hotel.direccion ? ' · ' + hotel.direccion : '');

  // Dirección
  $('dir').textContent = estado.direccion;
  const tramo = enEstacion
    ? t('enEstacion', { e: actual.nombre })
    : t('entre', { a: actual.nombre, b: proxima ? proxima.nombre : '—' });
  $('dir2').textContent = `${estado.municipio}, Atlántico · ${tramo}`;

  // Hotel al que llegaron
  $('hNow').textContent = h ? h.nombre : t('ningunHotel');
  $('hNow2').textContent = h
    ? conDireccion(t('bajaron', { e: ruta.paradas[h.estacion].nombre, m: h.minutos }), h)
    : t('aBordo');

  // Siguiente hotel
  $('hNext').textContent = n ? n.nombre : estado.hayHotelesElegidos ? t('recorridoCompleto') : t('eligeHoteles');
  $('hNext2').textContent = n
    ? t('faltan', { e: ruta.paradas[n.estacion].nombre, km: km(estado.metrosHastaSiguienteHotel), m: n.minutos })
    : '—';

  // Punto para comprar o recargar la tarjeta
  const c = estado.tarjetaAqui || estado.tarjetaSiguiente;
  const motivo = c ? c.tarjeta.motivo[getIdioma()] || c.tarjeta.motivo.es : '';
  const marca = c && c.tarjeta.estado === 'propuesto' ? ' · ' + t('tarjetaPropuesta') : '';
  $('cNext').textContent = c ? c.nombre + marca : t('sinTarjeta');
  $('cNext2').textContent = c
    ? (estado.tarjetaAqui ? t('tarjetaAqui') : t('tarjetaFaltan', { km: km(estado.metrosHastaTarjeta) })) + ' · ' + motivo
    : '—';

  // Progreso
  $('pA').textContent = t('deTotal', { a: km(estado.s), b: km(ruta.total) });
  const min = Math.floor(simulador.tiempo / 60);
  const seg = String(Math.floor(simulador.tiempo % 60)).padStart(2, '0');
  $('pT').textContent = t('tiempo', { t: `${min}:${seg}` });
  $('pB').textContent = proxima ? t('proxima', { e: proxima.nombre }) : t('llego', { e: ruta.destino });
  const barra = $('pos');
  if (document.activeElement !== barra) barra.value = Math.round((estado.s / ruta.total) * 1000);

  // Botones de modo
  $('play').textContent = simulador.automatico && simulador.reproduciendo ? t('pausar') : t('reproducir');
  $('mAuto').setAttribute('aria-pressed', simulador.automatico);
  $('mMan').setAttribute('aria-pressed', !simulador.automatico);
}
/** Lista de hoteles con casillas para elegir cuáles visita el recorrido. */
export function mostrarListaHoteles(ruta, elegidos) {
  const contenedor = $('hlist');
  contenedor.innerHTML = '';
  if (!ruta.hoteles.length) {
    contenedor.innerHTML = `<p class="note">${t('sinHoteles')}</p>`;
    return;
  }
  ruta.hoteles.forEach((h, i) => {
    const label = document.createElement('label');
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.dataset.i = i;
    casilla.checked = elegidos.has(h.nombre);
    const texto = document.createElement('span');
    const nombre = document.createElement('b');
    nombre.textContent = h.nombre;
    const detalle = document.createElement('span');
    detalle.className = 'note';
    detalle.textContent =
      t('bajar', { e: ruta.paradas[h.estacion].nombre, m: h.minutos }) + (h.direccion ? ' · ' + h.direccion : '');
    texto.append(nombre, document.createElement('br'), detalle);
    label.append(casilla, texto);
    contenedor.append(label);
  });
}
