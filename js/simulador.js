/**
 * Motor de la simulación. Guarda dónde está el bus y lo hace avanzar.
 * No dibuja nada: solo avisa con onCambio() cuando el estado cambia.
 *
 * Modo automático: el bus avanza solo, se detiene en cada estación y sigue.
 * Modo manual: la posición la decide el usuario (barra, botones o teclado).
 */
import { VELOCIDAD_KMH, VELOCIDAD_INICIAL, PARADA_SEGUNDOS } from './config.js';

export class Simulador {
  constructor(ruta) {
    this.multiplicador = VELOCIDAD_INICIAL; // ×30 = 30 segundos simulados por segundo real
    this.automatico = true;
    this.reproduciendo = true;
    this.onCambio = () => {};
    this.cambiarRuta(ruta);
  }

  cambiarRuta(ruta) {
    this.ruta = ruta;
    this.reiniciar();
  }

  reiniciar() {
    this.s = 0; // metros recorridos
    this.tiempo = 0; // segundos simulados
    this.espera = 0; // segundos que faltan de parada en la estación actual
    this.reproduciendo = this.automatico;
    this.onCambio();
  }

  get terminado() {
    return this.s >= this.ruta.total;
  }

  /** Avanza la simulación dt segundos reales (llamado en cada cuadro). */
  avanzar(dt) {
    if (!this.automatico || !this.reproduciendo || this.terminado) return;
    let restante = dt * this.multiplicador;
    this.tiempo += restante;

    while (restante > 0 && !this.terminado) {
      // Detenido en una estación.
      if (this.espera > 0) {
        const usado = Math.min(this.espera, restante);
        this.espera -= usado;
        restante -= usado;
        continue;
      }
      // En movimiento hacia la próxima estación.
      const v = VELOCIDAD_KMH / 3.6; // m/s
      const proxima = this.ruta.paradas.find((p) => p.s > this.s + 0.5);
      const limite = proxima ? proxima.s : this.ruta.total;
      const paso = Math.min(v * restante, limite - this.s);
      this.s += paso;
      restante -= paso / v;

      if (proxima && this.s >= proxima.s - 0.5) {
        this.s = proxima.s;
        const esUltima = proxima === this.ruta.paradas[this.ruta.paradas.length - 1];
        this.espera = esUltima ? 0 : PARADA_SEGUNDOS;
      }
    }
    if (this.terminado) this.reproduciendo = false;
    this.onCambio();
  }

  setAutomatico(activo) {
    this.automatico = activo;
    this.reproduciendo = activo;
    this.espera = 0;
    this.onCambio();
  }

  alternarReproduccion() {
    if (!this.automatico) return this.setAutomatico(true);
    if (this.terminado) {
      this.reiniciar(); // al terminar, "Reproducir" empieza de nuevo
      return;
    }
    this.reproduciendo = !this.reproduciendo;
    this.onCambio();
  }

  /** Lleva el bus a una distancia exacta (modo manual). */
  irA(s) {
    if (this.automatico) this.setAutomatico(false);
    this.s = Math.max(0, Math.min(this.ruta.total, s));
    this.onCambio();
  }

  /** Salta a la estación siguiente (+1) o anterior (-1). */
  saltarEstacion(direccion) {
    const actual = this.ruta.estacionAlcanzada(this.s);
    const enEstacion = Math.abs(this.ruta.paradas[actual].s - this.s) < 2;
    let i = direccion > 0 ? actual + 1 : enEstacion ? actual - 1 : actual;
    i = Math.max(0, Math.min(this.ruta.paradas.length - 1, i));
    this.irA(this.ruta.paradas[i].s);
  }
}
