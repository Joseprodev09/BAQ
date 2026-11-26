/**
 * Pruebas automáticas. Se ejecutan con:  npm test
 * Usan el corredor de pruebas que trae Node (node:test), sin instalar nada.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { aMetros, distancia, formatoKm, municipio, describirDireccion } from '../js/geo.js';
import { crearRuta } from '../js/ruta.js';
import { calcularEstado } from '../js/estado.js';
import { Simulador } from '../js/simulador.js';

const leer = (n) => JSON.parse(readFileSync(new URL(`../data/${n}.json`, import.meta.url)));
const estaciones = leer('estaciones').estaciones;
const rutas = leer('rutas').rutas;
const hoteles = leer('hoteles').hoteles;
const R1 = crearRuta(
  rutas.find((r) => r.id === 'R1'),
  estaciones,
  hoteles,
);
const B1 = crearRuta(
  rutas.find((r) => r.id === 'B1'),
  estaciones,
  hoteles,
);

test('geo: distancia de ~1 km entre dos puntos conocidos', () => {
  const a = aMetros(10.95, -74.79);
  const b = aMetros(10.959, -74.79); // ~0,009° de latitud ≈ 995 m
  assert.ok(Math.abs(distancia(a, b) - 995) < 5);
});

test('geo: formato de kilómetros con coma decimal', () => {
  assert.equal(formatoKm(12345), '12,3 km');
});

test('geo: municipio según la latitud', () => {
  assert.equal(municipio(10.91), 'Soledad');
  assert.equal(municipio(10.98), 'Barranquilla');
});

test('geo: describe la dirección poniendo primero la avenida del bus', () => {
  assert.equal(describirDireccion({ via: 'Carrera 38', cruce: 'Avenida Murillo' }), 'Avenida Murillo con Carrera 38');
  assert.equal(
    describirDireccion({ via: 'Avenida Carrera 46', cruce: 'Plaza de la Paz' }),
    'Avenida Olaya Herrera (Carrera 46) a la altura de Plaza de la Paz',
  );
});

test('datos: todas las estaciones de las rutas existen', () => {
  const ids = new Set(estaciones.map((e) => e.id));
  for (const r of rutas) for (const id of r.estaciones) assert.ok(ids.has(id), `${r.id}: falta ${id}`);
});

test('ruta: las estaciones quedan en orden creciente y cerca del trazado', () => {
  for (const ruta of [R1, B1]) {
    for (let i = 1; i < ruta.paradas.length; i++)
      assert.ok(ruta.paradas[i].s > ruta.paradas[i - 1].s, `${ruta.id}: ${ruta.paradas[i].nombre}`);
  }
});

test('ruta: longitudes razonables (R1 ≈ 12 km, B1 ≈ 10 km)', () => {
  assert.ok(R1.total > 11000 && R1.total < 13000, `R1 = ${R1.total}`);
  assert.ok(B1.total > 9500 && B1.total < 11000, `B1 = ${B1.total}`);
});

test('estado: al inicio ningún hotel alcanzado y el siguiente es el primero elegido', () => {
  const elegidos = new Set(['Hotel Samaritano', 'Hotel Majestic']);
  const e = calcularEstado(R1, 0, elegidos);
  assert.equal(e.hotelActual, null);
  assert.equal(e.hotelSiguiente.nombre, 'Hotel Samaritano');
  assert.equal(e.actual.nombre, 'Portal de Soledad');
});

test('estado: en La Arenosa ya pasó Avanty y sigue Majestic', () => {
  const elegidos = new Set(['Hotel Avanty', 'Hotel Majestic']);
  const arenosa = R1.paradas.find((p) => p.id === 'ar');
  const e = calcularEstado(R1, arenosa.s, elegidos);
  assert.equal(e.hotelActual.nombre, 'Hotel Avanty');
  assert.equal(e.hotelSiguiente.nombre, 'Hotel Majestic');
  assert.ok(e.enEstacion);
});

test('simulador: en automático llega al final y se detiene', () => {
  const sim = new Simulador(R1);
  for (let i = 0; i < 2000 && !sim.terminado; i++) sim.avanzar(1);
  assert.ok(sim.terminado);
  assert.equal(sim.reproduciendo, false);
  assert.equal(sim.s, R1.total);
});

test('simulador: en manual salta estación por estación', () => {
  const sim = new Simulador(R1);
  sim.saltarEstacion(1);
  assert.equal(sim.automatico, false);
  assert.equal(sim.s, R1.paradas[1].s);
  sim.saltarEstacion(-1);
  assert.equal(sim.s, 0);
});
