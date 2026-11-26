# Cómo funciona el código

El proyecto usa HTML, CSS y JavaScript estándar, sin frameworks y sin paso de compilación. Cada archivo de `js/` hace una sola cosa.

## Flujo general

```
data/*.json
   │  (main.js los carga con fetch)
   ▼
crearRuta()  ── ruta.js ──►  distancias, estaciones sobre el trazado, hotel → estación
   │
   ▼
Simulador  ── simulador.js ──►  posición del bus "s" (metros recorridos)
   │  en cada cambio llama a onCambio()
   ▼
calcularEstado()  ── estado.js ──►  dirección, estación actual/próxima, hotel actual/siguiente
   │
   ├──► mapa.js     dibuja el bus, las marcas y las etiquetas
   ├──► panel.js    actualiza el panel de estado y el progreso
   └──► letrero.js  actualiza el letrero trilingüe
```

## La idea clave: la posición "s"

El bus no se guarda como latitud y longitud, sino como **metros recorridos desde el inicio de la ruta** (`s`). Así:

- Avanzar es sumar metros.
- Una estación es un valor de `s`.
- «¿Ya pasamos el hotel?» se reduce a comparar dos números.

`ruta.posicionEn(s)` convierte `s` en un punto del mapa cuando hay que dibujarlo.

## Archivos

| Archivo        | Responsabilidad                                                                                      | Usa el navegador |
| -------------- | ---------------------------------------------------------------------------------------------------- | ---------------- |
| `config.js`    | Constantes ajustables (velocidad, paradas, caminata, zoom). La tarifa está en `i18n.js`.             | No               |
| `geo.js`       | Convierte coordenadas a metros, mide distancias y arma el texto de la dirección.                     | No               |
| `ruta.js`      | `crearRuta()`: distancias acumuladas, ubicación de estaciones y hoteles.                             | No               |
| `simulador.js` | Clase `Simulador`: modo automático o manual, pausa, saltos de estación.                              | No               |
| `estado.js`    | `calcularEstado()`: todo lo que se muestra, a partir de `s`.                                         | No               |
| `mapa.js`      | Clase `Mapa`: SVG, cámara (seguir, ver todo, zoom y arrastre), marcas y etiquetas.                   | Sí               |
| `panel.js`     | Panel de estado, progreso y lista de hoteles.                                                        | Sí               |
| `letrero.js`   | Letrero para turistas.                                                                               | Sí               |
| `textos-ui.js` | Textos de la página en ES / EN / PT.                                                                 | No               |
| `idioma.js`    | Idioma de la página: `t()` para textos dinámicos y `data-i18n` para los fijos; recuerda la elección. | Sí               |
| `tema.js`      | Botón de modo claro / oscuro; recuerda la elección.                                                  | Sí               |
| `i18n.js`      | Textos del letrero para turistas en ES / EN / PT.                                                    | No               |
| `iconos.js`    | Pictogramas SVG.                                                                                     | No               |
| `utils.js`     | `$()`, `escapar()` y `cargarJSON()`.                                                                 | Sí               |
| `main.js`      | Arranque: carga los datos, crea los objetos y conecta los botones.                                   | Sí               |

Los módulos que no usan el navegador se prueban con Node en `tests/simulador.test.js`.

## Tareas comunes

- **Cambiar la velocidad del bus o el tiempo de parada:** `js/config.js`.
- **Agregar un idioma a la página:** copia el bloque `es` en `js/textos-ui.js`, tradúcelo, añade la opción al selector `idioma` de `index.html` y agrega ese idioma a cada mejora de `data/mejoras.json`.
- **Cambiar un texto de la página:** búscalo en `js/textos-ui.js` (no en `index.html`, que solo tiene las claves `data-i18n`).
- **Agregar un idioma al letrero:** copia un bloque en `js/i18n.js`, añade el código a `ORDEN_IDIOMAS` y agrega un botón `data-l="xx"` en `index.html`.
- **Agregar una ruta:** añade la ruta en `data/rutas.json` con su `relacionOSM` y su lista de `estaciones`, y luego ejecuta `npm run datos` para descargar su trazado.
- **Cambiar colores o tipografías:** variables al inicio de `css/estilos.css`.

## Por qué no se usa un mapa de teselas (Leaflet, Google Maps)

El mapa se dibuja en SVG con datos incluidos en el proyecto. Así funciona sin conexión a servicios externos, sin claves de API y dentro de entornos que bloquean imágenes remotas. Si más adelante quieres un mapa de fondo con teselas, `mapa.js` es el único archivo que habría que cambiar.
