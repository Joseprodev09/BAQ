/**
 * Dibuja el mapa en SVG: vías de fondo, trazado de la ruta, estaciones,
 * hoteles, lugares de referencia y el bus. También maneja la cámara
 * (seguir al bus, ver la ruta completa, acercar, alejar y arrastrar).
 *
 * Las coordenadas internas están en metros (ver geo.js).
 */
import { aMetros } from './geo.js';
import { ZOOM_SEGUIR_METROS } from './config.js';

const NS = 'http://www.w3.org/2000/svg';
const COLOR_HOTEL = '#3b5bdb';
const COLOR_VISITADO = '#2e7d4f';

/** Crea un elemento SVG. Los colores con var() o light-dark() van como estilo. */
function crear(etiqueta, atributos, padre) {
  const el = document.createElementNS(NS, etiqueta);
  for (const [k, v] of Object.entries(atributos)) {
    if ((k === 'fill' || k === 'stroke') && String(v).includes('(')) el.style[k] = v;
    else el.setAttribute(k, v);
  }
  if (padre) padre.appendChild(el);
  return el;
}

const trazo = {
  'vector-effect': 'non-scaling-stroke',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  fill: 'none',
};
const ruta2path = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

export class Mapa {
  constructor(svg, mapaBase, lugares) {
    this.svg = svg;
    this.lugares = lugares.map((l) => ({ ...l, xy: aMetros(l.lat, l.lon) }));
    this.capas = {};
    for (const nombre of ['base', 'ruta', 'lugares', 'hoteles', 'estaciones', 'bus', 'etiquetas']) {
      this.capas[nombre] = crear('g', {}, svg);
    }
    this.capas.etiquetas.setAttribute('font-family', 'Atkinson Hyperlegible, sans-serif');
    this.capas.etiquetas.setAttribute('paint-order', 'stroke');
    this.capas.etiquetas.style.stroke = 'var(--bg)';

    this.dibujarBase(mapaBase);
    this.cam = { cx: 0, cy: 0, w: ZOOM_SEGUIR_METROS };
    this.objetivo = { ...this.cam };
    this.zoomSeguir = ZOOM_SEGUIR_METROS;
    this.seguir = true;
    this.ultimoAncho = -1;
    this.activarArrastre();
  }

  /** Vías principales y río (data/mapa-base.json). */
  dibujarBase(mapaBase) {
    for (const via of mapaBase.vias) {
      const d = ruta2path(via.puntos.map(([lat, lon]) => aMetros(lat, lon)));
      if (via.tipo === 'rio') {
        crear('path', { ...trazo, d, stroke: 'var(--water)', 'stroke-width': 14 }, this.capas.base);
        continue;
      }
      const secundaria = via.tipo === 'secundaria';
      crear('path', { ...trazo, d, stroke: 'var(--road2)', 'stroke-width': secundaria ? 5 : 8 }, this.capas.base);
      crear('path', { ...trazo, d, stroke: 'var(--road)', 'stroke-width': secundaria ? 3 : 5.5 }, this.capas.base);
    }
  }

  /** Dibuja una ruta nueva (al iniciar o al cambiar de ruta). */
  setRuta(ruta) {
    this.ruta = ruta;
    const { ruta: gRuta, estaciones, hoteles, bus } = this.capas;
    gRuta.innerHTML = estaciones.innerHTML = hoteles.innerHTML = bus.innerHTML = '';

    const d = ruta2path(ruta.puntos.map((p) => p.xy));
    crear('path', { ...trazo, d, stroke: '#fff', 'stroke-width': 11, opacity: 0.85 }, gRuta);
    crear('path', { ...trazo, d, stroke: ruta.color, 'stroke-width': 6 }, gRuta);
    // Línea discontinua blanca sobre el tramo ya recorrido.
    this.recorrido = crear(
      'path',
      { ...trazo, d, stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '0 1', opacity: 0.55 },
      gRuta,
    );

    this.circulosEstacion = ruta.paradas.map((p) =>
      crear(
        'circle',
        {
          cx: p.xy[0],
          cy: p.xy[1],
          fill: '#fff',
          stroke: '#17202a',
          'stroke-width': 2.5,
          'vector-effect': 'non-scaling-stroke',
        },
        estaciones,
      ),
    );
    this.marcasHotel = ruta.hoteles.map((h) => {
      const p = ruta.paradas[h.estacion].xy;
      crear(
        'line',
        {
          x1: h.xy[0],
          y1: h.xy[1],
          x2: p[0],
          y2: p[1],
          stroke: COLOR_HOTEL,
          'stroke-width': 1.2,
          'stroke-dasharray': '3 3',
          'vector-effect': 'non-scaling-stroke',
          opacity: 0.6,
        },
        hoteles,
      );
      return crear(
        'rect',
        { stroke: '#fff', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', rx: 2 },
        hoteles,
      );
    });
    this.halo = crear('circle', { fill: ruta.color, opacity: 0.25 }, bus);
    this.bus = crear(
      'circle',
      { fill: '#17202a', stroke: '#fff', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' },
      bus,
    );

    const xs = ruta.puntos.map((p) => p.xy[0]);
    const ys = ruta.puntos.map((p) => p.xy[1]);
    this.extension = {
      cx: (Math.min(...xs) + Math.max(...xs)) / 2,
      cy: (Math.min(...ys) + Math.max(...ys)) / 2,
      dx: Math.max(...xs) - Math.min(...xs) + 1200,
      dy: Math.max(...ys) - Math.min(...ys) + 1600,
    };
    if (!this.estado) {
      // Primera ruta: la cámara arranca sobre el inicio, sin animación.
      const [x, y] = ruta.puntos[0].xy;
      this.cam = { cx: x, cy: y, w: this.zoomSeguir };
    }
    if (!this.seguir) this.verTodo();
    this.ultimoAncho = -1;
  }

  /** Guarda el estado a mostrar; el dibujo ocurre en cuadro(). */
  actualizar(estado, elegidos) {
    this.estado = estado;
    this.elegidos = elegidos;
    this.recorrido.setAttribute('stroke-dasharray', `${estado.s} ${this.ruta.total * 2}`);
    const clave = [estado.indice, estado.hotelSiguiente?.nombre, [...elegidos].join()].join('|');
    if (clave !== this.claveMarcas) {
      this.claveMarcas = clave;
      this.ultimoAncho = -1; // fuerza redibujar marcas y etiquetas
    }
  }

  // ---------- Cámara ----------
  setSeguir(activo) {
    this.seguir = activo;
    if (activo) this.zoomSeguir = ZOOM_SEGUIR_METROS;
    else this.verTodo();
  }

  verTodo() {
    const r = this.svg.getBoundingClientRect();
    const proporcion = r.height / (r.width || 1);
    const e = this.extension;
    this.objetivo = { cx: e.cx, cy: e.cy, w: Math.max(e.dx, e.dy / proporcion) };
  }

  zoom(factor) {
    const limitar = (w) => Math.max(700, Math.min(20000, w * factor));
    if (this.seguir) this.zoomSeguir = limitar(this.zoomSeguir);
    else this.objetivo.w = limitar(this.objetivo.w);
  }

  activarArrastre() {
    let inicio = null;
    this.svg.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? 1.15 : 0.87);
      },
      { passive: false },
    );
    this.svg.addEventListener('pointerdown', (e) => {
      inicio = { x: e.clientX, y: e.clientY, cx: this.objetivo.cx, cy: this.objetivo.cy };
      this.svg.setPointerCapture(e.pointerId);
    });
    this.svg.addEventListener('pointermove', (e) => {
      if (!inicio) return;
      const dx = e.clientX - inicio.x;
      const dy = e.clientY - inicio.y;
      if (this.seguir) {
        if (Math.hypot(dx, dy) < 6) return;
        this.seguir = false; // arrastrar desactiva "Seguir el bus"
        this.objetivo = { ...this.cam };
        inicio.cx = this.cam.cx;
        inicio.cy = this.cam.cy;
        this.onDejarDeSeguir?.();
      }
      const u = this.cam.w / this.svg.getBoundingClientRect().width;
      this.objetivo.cx = this.cam.cx = inicio.cx - dx * u;
      this.objetivo.cy = this.cam.cy = inicio.cy - dy * u;
    });
    this.svg.addEventListener('pointerup', () => (inicio = null));
  }

  /** Se llama en cada cuadro de animación: mueve la cámara y el bus. */
  cuadro() {
    const r = this.svg.getBoundingClientRect();
    if (!r.width || !this.estado) return;
    if (this.seguir) this.objetivo = { cx: this.estado.xy[0], cy: this.estado.xy[1], w: this.zoomSeguir };

    const suave = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.12;
    for (const k of ['cx', 'cy', 'w']) this.cam[k] += (this.objetivo[k] - this.cam[k]) * suave;
    const alto = this.cam.w * (r.height / r.width);
    this.svg.setAttribute('viewBox', `${this.cam.cx - this.cam.w / 2} ${this.cam.cy - alto / 2} ${this.cam.w} ${alto}`);

    const u = this.cam.w / r.width; // metros por píxel de pantalla
    if (this.ultimoAncho < 0 || Math.abs(this.cam.w - this.ultimoAncho) > this.cam.w * 0.01) {
      this.ultimoAncho = this.cam.w;
      this.dibujarMarcas(u);
    }
    const [x, y] = this.estado.xy;
    this.bus.setAttribute('cx', x);
    this.bus.setAttribute('cy', y);
    this.bus.setAttribute('r', 9 * u);
    this.halo.setAttribute('cx', x);
    this.halo.setAttribute('cy', y);
    this.halo.setAttribute('r', (18 + 4 * Math.sin(performance.now() / 300)) * u);
  }

  /** Tamaños que dependen del zoom (marcas a tamaño fijo en pantalla) y etiquetas. */
  dibujarMarcas(u) {
    const { ruta, estado, elegidos } = this;
    this.circulosEstacion.forEach((c) => c.setAttribute('r', 6 * u));

    ruta.hoteles.forEach((h, i) => {
      const elegido = elegidos.has(h.nombre);
      const siguiente = h === estado.hotelSiguiente;
      const visitado = elegido && ruta.paradas[h.estacion].s <= estado.s + 1;
      const lado = (siguiente ? 14 : elegido ? 11 : 8) * u;
      const m = this.marcasHotel[i];
      m.setAttribute('x', h.xy[0] - lado / 2);
      m.setAttribute('y', h.xy[1] - lado / 2);
      m.setAttribute('width', lado);
      m.setAttribute('height', lado);
      m.style.fill = siguiente ? 'var(--warn)' : visitado ? COLOR_VISITADO : COLOR_HOTEL;
      m.style.opacity = elegido ? 1 : 0.55;
    });

    const gL = this.capas.lugares;
    gL.innerHTML = '';
    for (const l of this.lugares) {
      if (l.tipo === 'estadio')
        crear(
          'ellipse',
          {
            cx: l.xy[0],
            cy: l.xy[1],
            rx: 110,
            ry: 80,
            fill: 'light-dark(#cfe3c4, #22392a)',
            stroke: '#5b8a4a',
            'stroke-width': 1.5,
            'vector-effect': 'non-scaling-stroke',
          },
          gL,
        );
      else if (l.tipo === 'arroyo')
        crear('circle', { cx: l.xy[0], cy: l.xy[1], r: 60, fill: 'var(--water)', opacity: 0.6 }, gL);
      else crear('circle', { cx: l.xy[0], cy: l.xy[1], r: 5 * u, fill: '#8a6d3b' }, gL);
    }
    this.dibujarEtiquetas(u);
  }

  dibujarEtiquetas(u) {
    const g = this.capas.etiquetas;
    const { ruta, estado, elegidos } = this;
    g.innerHTML = '';
    g.setAttribute('font-size', 13 * u);
    g.setAttribute('stroke-width', 3.5 * u);
    const texto = (x, y, contenido, extra) => (crear('text', { x, y, ...extra }, g).textContent = contenido);

    // Estaciones: todas si hay zoom; si no, solo extremos, actual y próxima.
    const todas = this.cam.w < 6000;
    ruta.paradas.forEach((p, i) => {
      const clave = i === 0 || i === ruta.paradas.length - 1 || i === estado.indice || i === estado.indice + 1;
      if (!todas && !clave) return;
      const derecha = p.xy[1] > -2500; // en la Av. Olaya Herrera las etiquetas van a la izquierda
      texto(p.xy[0] + (derecha ? 10 : -10) * u, p.xy[1] + 4 * u, p.nombre, {
        'text-anchor': derecha ? 'start' : 'end',
        fill: 'var(--ink)',
        'font-weight': i === estado.indice + 1 ? 700 : 400,
      });
    });
    if (this.cam.w < 4500) {
      for (const l of this.lugares) {
        if (l.tipo === 'arroyo') continue;
        texto(l.xy[0] - 12 * u, l.xy[1] + (l.tipo === 'estadio' ? -90 : 4 * u), l.nombre, {
          'text-anchor': 'end',
          fill: 'var(--mute)',
          'font-style': 'italic',
        });
      }
    }
    if (this.cam.w < 3200) {
      for (const h of ruta.hoteles) {
        if (elegidos.has(h.nombre))
          texto(h.xy[0] + 9 * u, h.xy[1] - 7 * u, h.nombre, { fill: COLOR_HOTEL, 'font-weight': 700 });
      }
    }
  }
}
