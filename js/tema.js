/**
 * Modo claro / oscuro. Por defecto sigue la configuración del sistema; si el
 * usuario pulsa el botón, su elección se recuerda en este navegador.
 * Los colores de cada modo están en las variables de css/estilos.css.
 */
import { t } from './idioma.js';

const CLAVE = 'baq360-tema';
const raiz = document.documentElement;
const sistemaOscuro = () => matchMedia('(prefers-color-scheme: dark)').matches;

function temaGuardado() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export const esOscuro = () => (raiz.dataset.theme ? raiz.dataset.theme === 'dark' : sistemaOscuro());

/** Actualiza el texto y el estado del botón según el modo actual. */
export function actualizarBotonTema() {
  const boton = document.getElementById('tema');
  const oscuro = esOscuro();
  boton.setAttribute('aria-pressed', oscuro);
  // El botón ofrece el modo contrario al actual.
  document.getElementById('temaTx').textContent = oscuro ? t('modoClaro') : t('modoOscuro');
  boton.title = oscuro ? t('modoClaro') : t('modoOscuro');
}

export function iniciarTema() {
  const guardado = temaGuardado();
  if (guardado === 'dark' || guardado === 'light') raiz.dataset.theme = guardado;
  document.getElementById('tema').addEventListener('click', () => {
    const nuevo = esOscuro() ? 'light' : 'dark';
    raiz.dataset.theme = nuevo;
    try {
      localStorage.setItem(CLAVE, nuevo);
    } catch {
      /* sin almacenamiento: el modo vale solo para esta visita */
    }
    actualizarBotonTema();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', actualizarBotonTema);
  actualizarBotonTema();
}
