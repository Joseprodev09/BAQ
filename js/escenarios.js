/**
 * Escenarios del día (todos SIMULADOS). Cada escenario cambia la velocidad
 * del bus, el tiempo de parada en algunas estaciones y el aviso que se
 * muestra en pantalla.
 *
 * Para agregar un escenario: añade una entrada aquí y una <option> con el
 * mismo valor en el selector "esc" de index.html.
 */
import { PARADA_SEGUNDOS } from './config.js';
import { aMetros, distancia } from './geo.js';

const ARROYO_EL_SALADO = aMetros(10.91968, -74.7991); // cruce con la Av. Murillo (OSM)

/** Devuelve la parada de la ruta con ese id, si la ruta pasa por ella. */
const parada = (ruta, id) => ruta.paradas.find((p) => p.id === id);
const cercaDe = (ruta, id, s, metros) => {
  const p = parada(ruta, id);
  return p && Math.abs(p.s - s) < metros;
};

export const ESCENARIOS = {
  normal: {
    nombre: 'Día normal',
    factorVelocidad: () => 1,
    parada: () => PARADA_SEGUNDOS,
    aviso: () => '',
  },

  partido: {
    nombre: 'Día de partido en el Metropolitano',
    // Más lento entre Pacho Galán y Buenos Aires por la demanda hacia el estadio.
    factorVelocidad: (ruta, s) => {
      const a = parada(ruta, 'pg');
      const b = parada(ruta, 'ba');
      return a && b && s >= a.s && s <= b.s ? 0.7 : 1;
    },
    // Paradas más largas en las estaciones más cercanas al estadio.
    parada: (p) => (p.id === 'jb' || p.id === 'pr' ? 60 : PARADA_SEGUNDOS),
    aviso: (ruta, s) =>
      cercaDe(ruta, 'jb', s, 1500) || cercaDe(ruta, 'pr', s, 1500)
        ? 'Día de partido: más pasajeros y paradas largas en Pedro Ramayá y Joaquín Barrios Polo, las estaciones más cercanas al Metropolitano. Siga la señalización de flujo peatonal hacia los anillos de seguridad.'
        : 'Día de partido: el bus reduce la velocidad entre Pacho Galán y Buenos Aires por la demanda hacia el estadio.',
  },

  lluvia: {
    nombre: 'Lluvia fuerte (arroyos)',
    factorVelocidad: () => 0.55,
    parada: (p) => (p.id === 'pg' ? 90 : PARADA_SEGUNDOS),
    aviso: (ruta, s) =>
      distancia(ruta.posicionEn(s).xy, ARROYO_EL_SALADO) < 900
        ? 'Lluvia fuerte: la Avenida Murillo cruza el Arroyo El Salado en este tramo. El bus espera en Pacho Galán; los pasajeros no deben cruzar calles inundadas.'
        : 'Lluvia fuerte: el bus circula a menor velocidad en todo el corredor.',
  },

  apagon: {
    nombre: 'Apagón en el corredor',
    factorVelocidad: () => 0.8,
    parada: () => PARADA_SEGUNDOS,
    aviso: () =>
      'Apagón: semáforos apagados y pantallas en modo de respaldo. El bus avanza con precaución y la señalización pasa a ser fotoluminiscente.',
  },
};
