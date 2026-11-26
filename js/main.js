/**
 * Punto de entrada. Carga los datos, crea el simulador y el mapa, y conecta
 * los controles de la página.
 *
 * Flujo:  data/*.json → crearRuta() → Simulador → calcularEstado() → mapa, panel y letrero
 */
import { $, cargarJSON, escapar } from './utils.js';
import { crearRuta } from './ruta.js';
import { Simulador } from './simulador.js';
import { calcularEstado } from './estado.js';
import { Mapa } from './mapa.js';
import { mostrarPanel, mostrarListaHoteles } from './panel.js';
import { mostrarLetrero } from './letrero.js';
import { ORDEN_IDIOMAS } from './i18n.js';
import { t, getIdioma, setIdioma, aplicarTextos } from './idioma.js';
import { iniciarTema, actualizarBotonTema } from './tema.js';
import { PASO_MANUAL_METROS, ROTACION_IDIOMA_SEGUNDOS } from './config.js';

async function iniciar() {
  // 0. Idioma y modo oscuro (antes de cargar datos, para que hasta el mensaje de error salga traducido)
  aplicarTextos();
  $('idioma').value = getIdioma();
  iniciarTema();

  // 1. Datos
  const [estaciones, rutas, hoteles, lugares, mapaBase, mejoras] = await Promise.all(
    ['estaciones', 'rutas', 'hoteles', 'lugares', 'mapa-base', 'mejoras'].map((n) => cargarJSON(`data/${n}.json`)),
  );
  const datosRutas = Object.fromEntries(rutas.rutas.map((r) => [r.id, r]));
  const elegidos = new Set(hoteles.hoteles.filter((h) => h.porDefecto).map((h) => h.nombre));
  const prepararRuta = (id) => crearRuta(datosRutas[id], estaciones.estaciones, hoteles.hoteles);

  // 2. Selector de rutas
  $('ruta').innerHTML = rutas.rutas
    .map((r) => `<option value="${escapar(r.id)}">${escapar(r.nombre)}</option>`)
    .join('');

  // 3. Simulador, mapa y estado de la interfaz
  let ruta = prepararRuta(rutas.rutas[0].id);
  const sim = new Simulador(ruta);
  const mapa = new Mapa($('map'), mapaBase, lugares.lugares);
  const ui = { idioma: getIdioma(), rotar: true, claveLetrero: '' }; // ui.idioma = idioma del letrero

  function refrescar() {
    const estado = calcularEstado(ruta, sim.s, elegidos, getIdioma());
    mostrarPanel(estado, ruta, sim);
    mapa.actualizar(estado, elegidos);
    // El letrero solo se redibuja cuando cambia algo visible en él.
    const clave = [estado.indice, estado.enEstacion, ui.idioma, ruta.id, [...elegidos].join()].join('|');
    if (clave !== ui.claveLetrero) {
      ui.claveLetrero = clave;
      mostrarLetrero(estado, ruta, { idioma: ui.idioma, elegidos });
    }
  }
  sim.onCambio = refrescar;

  function cargarRuta(id) {
    ruta = prepararRuta(id);
    mapa.setRuta(ruta);
    mostrarListaHoteles(ruta, elegidos);
    $('lgR').style.background = ruta.color;
    $('lgRt').textContent = t('lgRuta', { r: ruta.id });
    sim.cambiarRuta(ruta);
  }
  cargarRuta(ruta.id);

  // 4. Controles
  $('ruta').onchange = (e) => cargarRuta(e.target.value);
  $('mAuto').onclick = () => sim.setAutomatico(true);
  $('mMan').onclick = () => sim.setAutomatico(false);
  $('play').onclick = () => sim.alternarReproduccion();
  $('prev').onclick = () => sim.saltarEstacion(-1);
  $('next').onclick = () => sim.saltarEstacion(1);
  $('pos').oninput = (e) => sim.irA((e.target.value / 1000) * ruta.total);
  $('vel').value = String(sim.multiplicador);
  $('vel').onchange = (e) => (sim.multiplicador = Number(e.target.value));
  $('reset').onclick = () => sim.reiniciar();
  $('hlist').addEventListener('change', (e) => {
    const h = ruta.hoteles[Number(e.target.dataset.i)];
    if (!h) return;
    e.target.checked ? elegidos.add(h.nombre) : elegidos.delete(h.nombre);
    refrescar();
  });

  // Cámara
  const marcarCamara = (seguir) => {
    $('cFollow').setAttribute('aria-pressed', seguir);
    $('cAll').setAttribute('aria-pressed', !seguir);
  };
  $('cFollow').onclick = () => {
    mapa.setSeguir(true);
    marcarCamara(true);
  };
  $('cAll').onclick = () => {
    mapa.setSeguir(false);
    marcarCamara(false);
  };
  mapa.onDejarDeSeguir = () => marcarCamara(false);
  $('zin').onclick = () => mapa.zoom(0.7);
  $('zout').onclick = () => mapa.zoom(1.4);

  // Teclado: ← → mueven 100 m; Mayús + flecha salta de estación; espacio pausa.
  document.addEventListener('keydown', (e) => {
    const enCampo = /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.id !== 'pos';
    if (enCampo) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      if (e.shiftKey) sim.saltarEstacion(dir);
      else sim.irA(sim.s + PASO_MANUAL_METROS * dir);
    }
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      sim.alternarReproduccion();
    }
  });

  // Idiomas del letrero (independiente del idioma de la página)
  const botonesIdioma = document.querySelectorAll('.langs [data-l]');
  const setIdiomaLetrero = (l) => {
    ui.idioma = l;
    botonesIdioma.forEach((b) => b.setAttribute('aria-pressed', b.dataset.l === l));
    refrescar();
  };
  botonesIdioma.forEach(
    (b) =>
      (b.onclick = () => {
        ui.rotar = false;
        $('rot').setAttribute('aria-pressed', false);
        setIdiomaLetrero(b.dataset.l);
      }),
  );
  $('rot').onclick = () => {
    ui.rotar = !ui.rotar;
    $('rot').setAttribute('aria-pressed', ui.rotar);
  };
  setInterval(() => {
    if (ui.rotar) setIdiomaLetrero(ORDEN_IDIOMAS[(ORDEN_IDIOMAS.indexOf(ui.idioma) + 1) % ORDEN_IDIOMAS.length]);
  }, ROTACION_IDIOMA_SEGUNDOS * 1000);

  // 5. Mejoras de señalización (cada una trae su texto en español, inglés y portugués)
  function mostrarMejoras() {
    const l = getIdioma();
    $('mejoras').innerHTML = mejoras.mejoras
      .map((m) => {
        const x = m[l] || m.es;
        return `<div class="mejora"><h3>${escapar(x.titulo)}</h3><p>${escapar(x.propuesta)}</p><p class="why">${escapar(x.problema)}</p></div>`;
      })
      .join('');
  }
  mostrarMejoras();

  // Selector de idioma de la página (esquina superior derecha)
  $('idioma').onchange = (e) => {
    setIdioma(e.target.value);
    actualizarBotonTema();
    mostrarListaHoteles(ruta, elegidos);
    $('lgRt').textContent = t('lgRuta', { r: ruta.id });
    mostrarMejoras();
    setIdiomaLetrero(e.target.value); // el letrero también cambia; la rotación sigue si está activa
  };

  // 6. Bucle de animación
  let anterior = performance.now();
  function cuadro(ahora) {
    const dt = Math.min(0.1, (ahora - anterior) / 1000);
    anterior = ahora;
    sim.avanzar(dt);
    mapa.cuadro();
    requestAnimationFrame(cuadro);
  }
  requestAnimationFrame(cuadro);
}

iniciar().catch((error) => {
  console.error(error);
  $('errorCarga').hidden = false;
});
