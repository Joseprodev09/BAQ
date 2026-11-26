/** Pequeñas utilidades compartidas. */

/** Atajo para document.getElementById. */
export const $ = (id) => document.getElementById(id);

/** Escapa texto antes de insertarlo como HTML (evita que un dato rompa la página). */
export const escapar = (texto) =>
  String(texto).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

/** Descarga y lee un archivo JSON de la carpeta data/. */
export async function cargarJSON(ruta) {
  const respuesta = await fetch(ruta, { cache: 'no-cache' }); // siempre la versión actual
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta} (${respuesta.status})`);
  return respuesta.json();
}
