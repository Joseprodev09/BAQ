/**
 * Utilidades geográficas: convertir coordenadas a metros, medir distancias
 * y describir una posición con palabras.
 *
 * No depende del navegador, así que se puede probar con Node (ver tests/).
 */
import { LIMITE_SOLEDAD_LAT, LIMITE_PUERTO_COLOMBIA_LON } from './config.js';
import { CONECTORES } from './textos-ui.js';

// Punto de referencia en el centro del área (cerca de la Av. Murillo).
const LAT0 = 10.95;
const LON0 = -74.79;
const METROS_POR_GRADO_LON = 111320 * Math.cos((LAT0 * Math.PI) / 180);
const METROS_POR_GRADO_LAT = 110574;

/**
 * Convierte latitud/longitud en coordenadas planas [x, y] en metros.
 * x crece hacia el este y y crece hacia el sur (como en una pantalla).
 */
export function aMetros(lat, lon) {
  return [(lon - LON0) * METROS_POR_GRADO_LON, -(lat - LAT0) * METROS_POR_GRADO_LAT];
}

/** Distancia en metros entre dos puntos [x, y]. */
export function distancia(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/** 1234 → "1,2 km" (en inglés: "1.2 km") */
export function formatoKm(metros, idioma = 'es') {
  const texto = (metros / 1000).toFixed(1);
  return (idioma === 'en' ? texto : texto.replace('.', ',')) + ' km';
}

/**
 * Municipio aproximado del punto: al sur del límite de la Av. Murillo es Soledad;
 * al oeste de LIMITE_PUERTO_COLOMBIA_LON (ruta B04) es Puerto Colombia.
 */
export function municipio(lat, lon = -74.8) {
  if (lon < LIMITE_PUERTO_COLOMBIA_LON) return 'Puerto Colombia';
  return lat < LIMITE_SOLEDAD_LAT ? 'Soledad' : 'Barranquilla';
}

const CORREDORES = ['Avenida Murillo', 'Avenida Carrera 46'];
const NOMBRE_VISIBLE = { 'Avenida Carrera 46': 'Avenida Olaya Herrera (Carrera 46)' };

/**
 * Describe un punto del trazado como una dirección legible.
 * Ejemplo: { via: 'Avenida Murillo', cruce: 'Carrera 21' } → "Avenida Murillo con Carrera 21"
 * Los nombres de calles no se traducen; solo cambian las palabras que los unen.
 */
export function describirDireccion({ via, cruce }, idioma = 'es') {
  const c = CONECTORES[idioma] || CONECTORES.es;
  let principal = via;
  let secundaria = cruce;
  // Si el corredor quedó como "cruce", se intercambian para nombrar primero la avenida del bus.
  if (CORREDORES.includes(secundaria) && !CORREDORES.includes(principal)) {
    [principal, secundaria] = [secundaria, principal];
  }
  const nombre = NOMBRE_VISIBLE[principal] || principal || '—';
  if (!secundaria) return nombre; // tramos sin cruce conocido (carreteras)
  const esCalle = /^(Calle|Carrera|Avenida|Vía|Diagonal|Transversal)/.test(secundaria);
  return nombre + (esCalle ? c.con : c.altura) + secundaria;
}
