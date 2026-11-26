# Datos del simulador

## Qué es real y qué es supuesto

| Dato                                          | Origen                                        | ¿Real?                                        |
| --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Trazado de las rutas R1 y B1                  | OpenStreetMap, relaciones 2382291 y 2382289   | Sí                                            |
| Estaciones y su ubicación                     | OpenStreetMap                                 | Sí                                            |
| Calles y carreras que cruza el bus            | OpenStreetMap                                 | Sí                                            |
| Hoteles cercanos y sus direcciones            | OpenStreetMap (a menos de 600 m del corredor) | Sí, pero hay que confirmar que sigan operando |
| Vías y río del fondo del mapa                 | OpenStreetMap                                 | Sí (simplificados)                            |
| Tarifa (COP 3.700 / 3.800), en `js/i18n.js`   | Fuente secundaria (Colombia Tramita, 2026)    | Verificar en transmetro.gov.co                |
| Límite Soledad / Barranquilla                 | Aproximado en la Av. Circunvalar              | Aproximado                                    |
| Velocidad del bus (22 km/h) y paradas de 20 s | `js/config.js`                                | **Supuesto**                                  |
| Minutos a pie (línea recta × 1,3 a 75 m/min)  | `js/config.js`                                | **Estimado**                                  |

Las rutas B2 y R2 no se incluyen porque Transmetro anunció su suspensión temporal desde el 19 de mayo de 2026.

## Cómo editar los datos

Todos los archivos de `data/` son JSON. Se pueden abrir con cualquier editor de texto. Después de editar, ejecuta `npm test` para comprobar que no quedó nada roto.

### Agregar o quitar un hotel (`data/hoteles.json`)

```json
{
  "nombre": "Hotel Ejemplo",
  "lat": 10.98,
  "lon": -74.787,
  "direccion": "Calle 40 # 41-36",
  "porDefecto": true
}
```

- `lat` y `lon`: coordenadas. En OpenStreetMap o Google Maps, clic derecho sobre el lugar para copiarlas.
- `porDefecto`: `true` si debe aparecer marcado al abrir el simulador.
- El simulador asigna solo la estación más cercana y calcula los minutos a pie.
- Si el hotel queda a más de 1,1 km a pie de cualquier estación, no aparece.

### Cambiar el orden o las estaciones de una ruta (`data/rutas.json`)

Cada ruta tiene `estaciones`, una lista de identificadores en el orden del recorrido. Los identificadores están en `data/estaciones.json`, por ejemplo `ps` = Portal de Soledad y `ja` = Joe Arroyo.

### El trazado (`trazado` en `data/rutas.json`)

Es la lista de puntos por donde pasa el bus. Cada punto tiene:

- `via`: la avenida por la que va el bus.
- `cruce`: la calle o carrera que cruza en ese punto.

Con eso se arma el texto «Avenida Murillo con Carrera 21». No conviene editarlo a mano: usa `npm run datos`.

## Actualizar desde OpenStreetMap

```bash
npm run datos
```

- Vuelve a descargar los trazados de las rutas y los nombres de calles.
- Vuelve a descargar las vías del fondo del mapa.
- Guarda los hoteles encontrados en `data/hoteles-osm.json` **para revisarlos**. No modifica `data/hoteles.json`: copia a mano los hoteles que quieras usar.
- Las estaciones (`data/estaciones.json`) se mantienen a mano.

El script usa la API pública Overpass. Si un servidor está caído, prueba otro automáticamente.

## Licencia de los datos

Los datos de OpenStreetMap están bajo la licencia ODbL. Si publicas el simulador, mantén visible el crédito «© colaboradores de OpenStreetMap», como ya aparece debajo del mapa.
