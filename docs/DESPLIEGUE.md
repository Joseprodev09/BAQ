# Publicar en Vercel

El proyecto es una web estática. Vercel solo tiene que servir los archivos tal cual: no hay compilación.

## Opción A: desde GitHub (recomendada)

1. Crea un repositorio en GitHub, por ejemplo `simulador-transmetro`.
2. Sube el contenido de esta carpeta:

   ```bash
   git init
   git add .
   git commit -m "Simulador Transmetro Barranquilla"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/simulador-transmetro.git
   git push -u origin main
   ```

3. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
4. **Add New… → Project** → elige el repositorio → **Import**.
5. Configuración:
   - **Framework Preset:** Other
   - **Build Command:** vacío
   - **Output Directory:** vacío
6. **Deploy**. En un minuto tendrás una dirección como `simulador-transmetro.vercel.app`.

A partir de ahí, cada `git push` publica automáticamente la nueva versión.

## Opción B: desde la terminal

```bash
npm run deploy
```

1. La primera vez te pide iniciar sesión (se abre el navegador).
2. Responde las preguntas: confirma la carpeta y acepta los valores sugeridos.
3. Al terminar, muestra la dirección pública.

Para una versión de prueba que no reemplace la publicada, usa `npx vercel` sin `--prod`.

## Qué hace `vercel.json`

- `cleanUrls`: permite direcciones sin `.html`.
- Cabecera `Cache-Control`: los navegadores guardan los archivos una hora. Después de publicar un cambio, puede tardar hasta una hora en verse en un navegador que ya había abierto la página. Para verlo al instante, recarga con Ctrl + F5.

## Problemas frecuentes

| Síntoma                                   | Causa y solución                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Aparece «No se pudieron cargar los datos» | La página se abrió con doble clic. Usa `npm start` en local; en Vercel esto no pasa.             |
| En Vercel aparece un error 404            | La carpeta publicada no es la que contiene `index.html`. Revisa _Root Directory_ en el proyecto. |
| Los cambios no se ven                     | Recarga con Ctrl + F5 (ver caché arriba).                                                        |
