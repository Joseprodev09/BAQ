/**
 * Parámetros del simulador.
 *
 * Todo lo que está aquí son SUPUESTOS del simulador, no datos oficiales de
 * Transmetro. Cámbialos para probar otros comportamientos.
 */

/** Velocidad comercial del bus en km/h (supuesto). */
export const VELOCIDAD_KMH = 22;

/** Segundos que el bus se detiene en cada estación en un día normal. */
export const PARADA_SEGUNDOS = 20;

/** Multiplicador de tiempo con el que arranca el modo automático. */
export const VELOCIDAD_INICIAL = 30;

/** Metros que avanza el bus con cada flecha del teclado en modo manual. */
export const PASO_MANUAL_METROS = 100;

/** Caminata: la distancia en línea recta se multiplica por este factor. */
export const FACTOR_CAMINATA = 1.3;

/** Velocidad de caminata en metros por minuto. */
export const METROS_POR_MINUTO = 75;

/** Un hotel solo se asocia a una estación si queda a menos de esta distancia a pie. */
export const CAMINATA_MAXIMA_METROS = 1100;

/** Latitud aproximada del límite Soledad / Barranquilla sobre la Av. Murillo (Av. Circunvalar). */
export const LIMITE_SOLEDAD_LAT = 10.9235;

/** Ancho, en metros, de la vista cuando la cámara sigue al bus. */
export const ZOOM_SEGUIR_METROS = 2600;

/** Segundos entre cada cambio de idioma del letrero en modo rotación. */
export const ROTACION_IDIOMA_SEGUNDOS = 5;
