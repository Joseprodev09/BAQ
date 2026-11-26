/**
 * Calcula, a partir de la posición del bus, todo lo que muestra la pantalla:
 * dirección, estación actual y próxima, hotel alcanzado y siguiente hotel.
 *
 * Es una función pura (no toca la página), así que se puede probar con Node.
 */
import { describirDireccion, municipio } from './geo.js';

/**
 * @param {object} ruta          resultado de crearRuta()
 * @param {number} s             metros recorridos
 * @param {Set<string>} elegidos nombres de los hoteles incluidos en el recorrido
 * @param {string} idioma       'es', 'en' o 'pt' (solo cambia las palabras de la dirección)
 */
export function calcularEstado(ruta, s, elegidos, idioma = 'es') {
  const indice = ruta.estacionAlcanzada(s);
  const actual = ruta.paradas[indice];
  const proxima = ruta.paradas[indice + 1] || null;
  const enEstacion = Math.abs(actual.s - s) < 2;
  const { xy, punto } = ruta.posicionEn(s);

  const hoteles = ruta.hoteles.filter((h) => elegidos.has(h.nombre));
  const yaPasados = hoteles.filter((h) => ruta.paradas[h.estacion].s <= s + 1);
  const hotelActual = yaPasados[yaPasados.length - 1] || null;
  const hotelSiguiente = hoteles.find((h) => ruta.paradas[h.estacion].s > s + 1) || null;

  return {
    s,
    xy,
    indice,
    actual,
    proxima,
    enEstacion,
    punto,
    direccion: describirDireccion(punto, idioma),
    municipio: municipio(punto.lat),
    hotelActual,
    hotelSiguiente,
    hayHotelesElegidos: hoteles.length > 0,
    metrosHastaSiguienteHotel: hotelSiguiente ? ruta.paradas[hotelSiguiente.estacion].s - s : 0,
  };
}
