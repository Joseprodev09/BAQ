/** Pictogramas SVG del letrero (dibujos propios, sin dependencias). */
const svg = (contenido, relleno = true) =>
  `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" ${relleno ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2.2"'}>${contenido}</svg>`;

export const ICONOS = {
  hotel: svg(
    '<path d="M3 18v-8h2v4h14a2 2 0 0 1 2 2v2h-2v-2H5v2zm4-5a2 2 0 1 1 0-4 2 2 0 0 1 0 4m3 0V9h7a3 3 0 0 1 3 3v1z"/>',
  ),
  estadio: svg('<ellipse cx="12" cy="12" rx="9" ry="6"/><ellipse cx="12" cy="12" rx="4" ry="2.4"/>', false),
  tarjeta: svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>', false),
  info: svg(
    '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M11 10h2v7h-2zM11 6h2v2h-2z"/>',
  ),
};
