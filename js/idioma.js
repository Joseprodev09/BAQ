/**
 * Idioma de la interfaz: guarda la elección, traduce los textos fijos de la
 * página (atributos data-i18n) y ofrece t() para los textos que cambian.
 */
import { TEXTOS_UI } from './textos-ui.js';

const CLAVE = 'baq360-idioma';
const DISPONIBLES = Object.keys(TEXTOS_UI);

function idiomaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (DISPONIBLES.includes(guardado)) return guardado;
  } catch {
    /* el navegador no permite guardar: se usa el idioma del navegador */
  }
  const delNavegador = (navigator.language || 'es').slice(0, 2);
  return DISPONIBLES.includes(delNavegador) ? delNavegador : 'es';
}

let actual = idiomaInicial();

export const getIdioma = () => actual;

/** Texto traducido. Reemplaza {llaves} con los valores dados: t('proxima', { e: 'La Ocho' }). */
export function t(clave, valores = {}) {
  const texto = TEXTOS_UI[actual][clave] ?? TEXTOS_UI.es[clave] ?? clave;
  return typeof texto === 'string' ? texto.replace(/\{(\w+)\}/g, (_, k) => valores[k] ?? '') : texto;
}

/** Cambia el idioma, lo recuerda y traduce los textos fijos de la página. */
export function setIdioma(idioma) {
  if (!DISPONIBLES.includes(idioma)) return;
  actual = idioma;
  try {
    localStorage.setItem(CLAVE, idioma);
  } catch {
    /* sin almacenamiento: el idioma vale solo para esta visita */
  }
  aplicarTextos();
}

/** Recorre los elementos con data-i18n, data-i18n-aria y data-i18n-html y les pone el texto del idioma actual. */
export function aplicarTextos() {
  document.documentElement.lang = actual;
  document.title = 'BAQ360 · ' + t('titulo');
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  // Solo textos propios de js/textos-ui.js (con enlaces o <code>), nunca datos externos.
  document.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.dispatchEvent(new Event('idioma-cambiado'));
  const lista = document.getElementById('fuentes');
  if (lista)
    lista.innerHTML = t('fuentes')
      .map((f) => `<li>${f}</li>`)
      .join('');
}
