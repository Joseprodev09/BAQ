# Simulador de recorrido Transmetro · Barranquilla

Simulador web del recorrido de las rutas troncales **R1** (Portal de Soledad → Joe Arroyo) y **B1** (Portal de Soledad → Parque Cultural del Caribe) de Transmetro. Usa el trazado real de las rutas y muestra, mientras el bus avanza:

- **Dónde está el bus**: la avenida, la calle o carrera que cruza, el municipio y entre qué estaciones va.
- **El hotel al que llegó el grupo** y **el siguiente hotel**, con la estación donde bajarse y los minutos a pie.
- **Un letrero de señalización para turistas** en español, inglés y portugués (propuesta del proyecto «Quilla Sede Lista»).

El recorrido puede ser **automático** (el bus avanza solo, de ×10 a ×120) o **manual** (barra, botones o flechas del teclado). Arriba a la derecha hay un botón de **modo oscuro** y un selector de **idioma** (español, inglés y portugués) que traduce toda la página; las dos elecciones se recuerdan en el navegador.

---

## Cómo abrirlo en tu computador

> **Importante:** no basta con hacer doble clic en `index.html`. El navegador bloquea la lectura de los archivos de datos cuando la página se abre directamente desde el disco. Hay que abrirla con un pequeño servidor local, como se explica abajo.

### Opción 1: con Node.js (recomendada)

1. Instala [Node.js](https://nodejs.org) (versión 18 o superior) si no lo tienes.
2. Abre una terminal **dentro de esta carpeta**.
   - En Windows: abre la carpeta en el Explorador, escribe `cmd` en la barra de direcciones y presiona Enter.
3. Ejecuta:

   ```bash
   npm start
   ```

4. Abre en el navegador la dirección **http://localhost:3000**.

### Opción 2: con Visual Studio Code

1. Abre la carpeta en VS Code.
2. Instala la extensión **Live Server**.
3. Haz clic derecho sobre `index.html` → **Open with Live Server**.

### Opción 3: con Python

```bash
python -m http.server 3000
```

Después abre **http://localhost:3000**.

---

## Cómo usarlo

| Quiero…                        | Hago…                                                                  |
| ------------------------------ | ---------------------------------------------------------------------- |
| Cambiar de ruta                | Elijo R1 o B1 en el selector «Ruta» (arriba a la derecha).             |
| Ver el recorrido solo          | Modo **Automático** y **Reproducir**. Ajusto la **Velocidad**.         |
| Moverme yo                     | Modo **Manual**: barra, **Estación anterior/siguiente** o flechas ← →. |
| Saltar de estación en estación | **Mayús + flecha** del teclado.                                        |
| Elegir los hoteles del tour    | Marco o desmarco hoteles en «Hoteles del recorrido».                   |
| Ver todo el trazado            | **Ver ruta completa**. Para volver: **Seguir el bus**.                 |
| Cambiar el idioma de la página | Uso el selector con el globo, arriba a la derecha.                     |
| Activar el modo oscuro         | Pulso **Modo oscuro**, arriba a la derecha.                            |
| Cambiar el idioma del letrero  | Botones Español / English / Português, o **Rotar idiomas**.            |

---

## Publicarlo en internet (Vercel)

Es una web estática, así que no necesita compilación ni base de datos.

**Desde GitHub (recomendado):**

1. Sube esta carpeta a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
3. En _Framework Preset_ elige **Other**. Deja vacíos _Build Command_ y _Output Directory_.
4. Pulsa **Deploy**. Cada vez que subas cambios a GitHub, Vercel publica la nueva versión.

**Desde la terminal:**

```bash
npm run deploy
```

La primera vez te pedirá iniciar sesión en Vercel. Más detalles en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md).

---

## Estructura del proyecto

```
transmetro-sim/
├── index.html            Página principal (solo estructura, sin código)
├── css/
│   └── estilos.css       Colores, tipografías y diseño
├── js/                   Código, un archivo por responsabilidad
│   ├── main.js           Punto de entrada: carga datos y conecta todo
│   ├── config.js         Parámetros ajustables (velocidad, paradas, caminata…)
│   ├── simulador.js      Motor: mueve el bus (automático y manual)
│   ├── ruta.js           Prepara una ruta: distancias, estaciones y hoteles
│   ├── estado.js         Calcula lo que se muestra (dirección, hoteles…)
│   ├── geo.js            Coordenadas, distancias y direcciones en texto
│   ├── mapa.js           Dibuja el mapa SVG y maneja la cámara
│   ├── panel.js          Panel de estado junto al mapa
│   ├── letrero.js        Letrero trilingüe para turistas
│   ├── textos-ui.js      Textos de la página en español, inglés y portugués
│   ├── idioma.js         Cambia el idioma de la página y lo recuerda
│   ├── tema.js           Modo claro / oscuro
│   ├── i18n.js           Textos del letrero para turistas (ES / EN / PT)
│   ├── iconos.js         Pictogramas del letrero
│   └── utils.js          Utilidades pequeñas
├── data/                 Datos en JSON (se pueden editar sin programar)
│   ├── estaciones.json   Estaciones con coordenadas
│   ├── rutas.json        Rutas, orden de estaciones y trazado
│   ├── hoteles.json      Hoteles que usa el simulador
│   ├── lugares.json      Estadios y lugares de referencia
│   ├── mapa-base.json    Vías y río del fondo del mapa
│   └── mejoras.json      Propuestas de señalización (ES / EN / PT)
├── scripts/
│   └── actualizar-datos-osm.mjs   Vuelve a descargar los datos de OpenStreetMap
├── tests/
│   └── simulador.test.js Pruebas automáticas (npm test)
├── docs/                 Documentación ampliada
├── package.json          Comandos del proyecto
└── vercel.json           Configuración de Vercel
```

## Comandos

| Comando          | Qué hace                                               |
| ---------------- | ------------------------------------------------------ |
| `npm start`      | Abre el simulador en http://localhost:3000             |
| `npm test`       | Ejecuta las pruebas automáticas                        |
| `npm run datos`  | Actualiza trazados, hoteles y mapa desde OpenStreetMap |
| `npm run deploy` | Publica en Vercel                                      |

No hay dependencias que instalar: `npm start` y `npm run deploy` descargan lo necesario la primera vez.

`npm run rutas` recalcula el trazado de las rutas propuestas (ver docs/DATOS.md).

## Más documentación

- [docs/DATOS.md](docs/DATOS.md): de dónde salen los datos, qué es real y qué es supuesto, y cómo editarlos.
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): cómo funciona el código por dentro.
- [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md): publicación en Vercel paso a paso.

## Datos y créditos

- Trazados, estaciones, calles y hoteles: © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright), licencia ODbL. Consultados el 26 de noviembre de 2026.
- La velocidad del bus y los tiempos de parada son **supuestos del simulador**, no datos de Transmetro.
"# BAQ" 
# BAQ360
