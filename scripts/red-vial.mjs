/**
 * Red vial para trazar rutas SIN internet.
 *
 * Reúne las calles reales que ya están en el proyecto y calcula por ellas el
 * camino más corto entre puntos:
 *   - data/mapa-base.json: vías troncales, primarias y secundarias de OpenStreetMap.
 *   - Trazados de data/rutas.json: R1 y B1 (relaciones de OpenStreetMap) y las calles
 *     por las que ya pasaban las rutas propuestas (calculadas originalmente con OSRM).
 *
 * Como el bus de una ruta de turistas usa avenidas y no calles de barrio, las avenidas
 * "cuestan menos" que las calles locales, y así el camino elegido no zigzaguea.
 *
 * Lo usa scripts/trazar-propuestas.mjs. No tiene dependencias.
 */

// --- Geometría simple en metros (misma proyección que scripts/actualizar-datos-osm.mjs) ---
const KX = 111320 * Math.cos((10.95 * Math.PI) / 180);
const KY = 110574;
export const aXY = (lat, lon) => [lon * KX, lat * KY];
export const aLatLon = ([x, y]) => ({ lat: y / KY, lon: x / KX });
export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Cuánto "cuesta" recorrer un metro según el tipo de vía (1 = avenida principal). */
const COSTO = { troncal: 1, primaria: 1, secundaria: 1.12, local: 1.7 };
const TOLERANCIA = 18; // m: puntos más cerca que esto se consideran el mismo cruce
const PASO = 20; // m: se parte cada tramo largo para que los cruces en T se conecten

/** Parte una línea en tramos de 20 m como máximo. */
function densificar(puntos) {
  const salida = [puntos[0]];
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1];
    const b = puntos[i];
    const n = Math.ceil(dist(a, b) / PASO);
    for (let k = 1; k <= n; k++) salida.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return salida;
}

export class RedVial {
  constructor() {
    this.nodos = []; // [x, y]
    this.vecinos = []; // por nodo: Map(destino → costo por metro mínimo)
    this.clase = []; // por nodo: el menor costo por metro de sus vías (1 = avenida principal)
    this.celdas = new Map(); // índice espacial de nodos
  }

  #clave(x, y) {
    return Math.floor(x / TOLERANCIA) + ',' + Math.floor(y / TOLERANCIA);
  }

  /** Nodo existente a menos de TOLERANCIA metros, o uno nuevo. */
  #nodo(p) {
    const cx = Math.floor(p[0] / TOLERANCIA);
    const cy = Math.floor(p[1] / TOLERANCIA);
    let mejor = -1;
    let menor = TOLERANCIA;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (const i of this.celdas.get(cx + dx + ',' + (cy + dy)) || []) {
          const d = dist(this.nodos[i], p);
          if (d < menor) {
            menor = d;
            mejor = i;
          }
        }
    if (mejor >= 0) return mejor;
    this.nodos.push(p);
    this.vecinos.push(new Map());
    this.clase.push(Infinity);
    const i = this.nodos.length - 1;
    const k = this.#clave(p[0], p[1]);
    if (!this.celdas.has(k)) this.celdas.set(k, []);
    this.celdas.get(k).push(i);
    return i;
  }

  /** Agrega una vía (lista de [lat, lon]) con su tipo: troncal, primaria, secundaria o local. */
  agregarVia(puntosLatLon, tipo) {
    const mult = COSTO[tipo] ?? COSTO.local;
    const linea = densificar(puntosLatLon.map(([lat, lon]) => aXY(lat, lon)));
    let anterior = this.#nodo(linea[0]);
    for (let i = 1; i < linea.length; i++) {
      const actual = this.#nodo(linea[i]);
      if (actual !== anterior) {
        for (const [a, b] of [
          [anterior, actual],
          [actual, anterior],
        ]) {
          const previo = this.vecinos[a].get(b);
          if (previo === undefined || mult < previo) this.vecinos[a].set(b, mult);
          if (mult < this.clase[a]) this.clase[a] = mult;
        }
      }
      anterior = actual;
    }
  }

  /**
   * Nodo más cercano a un punto [lat, lon] y a qué distancia (m) está.
   * Con soloAvenidas, ignora los nodos de calles locales.
   */
  masCercano(lat, lon, soloAvenidas = false) {
    const p = aXY(lat, lon);
    let mejor = -1;
    let menor = Infinity;
    this.nodos.forEach((n, i) => {
      if (soloAvenidas && this.clase[i] > COSTO.secundaria) return;
      const d = dist(n, p);
      if (d < menor) {
        menor = d;
        mejor = i;
      }
    });
    return { nodo: mejor, metros: menor };
  }

  /** Camino más barato entre dos nodos (Dijkstra). Devuelve la lista de nodos. */
  camino(origen, destino) {
    const n = this.nodos.length;
    const costo = new Float64Array(n).fill(Infinity);
    const previo = new Int32Array(n).fill(-1);
    costo[origen] = 0;
    const heap = [[0, origen]];
    const subir = (i) => {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[p][0] <= heap[i][0]) break;
        [heap[p], heap[i]] = [heap[i], heap[p]];
        i = p;
      }
    };
    const bajar = (i) => {
      for (;;) {
        let m = i;
        for (const c of [2 * i + 1, 2 * i + 2]) if (c < heap.length && heap[c][0] < heap[m][0]) m = c;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    };
    while (heap.length) {
      const [c, u] = heap[0];
      const ultimo = heap.pop();
      if (heap.length) {
        heap[0] = ultimo;
        bajar(0);
      }
      if (c > costo[u]) continue;
      if (u === destino) break;
      for (const [v, mult] of this.vecinos[u]) {
        const nuevo = c + dist(this.nodos[u], this.nodos[v]) * mult;
        if (nuevo < costo[v]) {
          costo[v] = nuevo;
          previo[v] = u;
          heap.push([nuevo, v]);
          subir(heap.length - 1);
        }
      }
    }
    if (!Number.isFinite(costo[destino])) return null;
    const ruta = [];
    for (let u = destino; u !== -1; u = previo[u]) ruta.push(u);
    return ruta.reverse();
  }
}

/**
 * Quita los bucles: si el camino vuelve a pasar por un nodo, se descarta lo recorrido entre medias.
 * Los nodos "protegidos" (las paradas) nunca se descartan, aunque estén en un ramal de ida y vuelta.
 */
export function quitarBucles(nodos, protegidos = new Set()) {
  const salida = [];
  const posicion = new Map();
  for (const n of nodos) {
    if (posicion.has(n) && !salida.slice(posicion.get(n) + 1).some((q) => protegidos.has(q))) {
      const desde = posicion.get(n);
      for (const q of salida.splice(desde + 1)) posicion.delete(q);
    } else {
      posicion.set(n, salida.length);
      salida.push(n);
    }
  }
  return salida;
}

/** Distancia de un punto a un segmento y posición t (0–1) del punto más cercano. */
export function aSegmento(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return { d: dist(p, [a[0] + t * dx, a[1] + t * dy]), t };
}
