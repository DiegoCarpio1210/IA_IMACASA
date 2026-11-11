# Registro de evidencias de la actualización

Capturas obtenidas el 10 de noviembre de 2026 con Chromium/Playwright. `herrero-dashboard.png`, `pulidor-dashboard.png`, `supervisor-dashboard.png` y sus historiales provienen de una **base SQLite aislada de pruebas**, con 18 eventos sintéticos creados explícitamente: tres jornadas, dos cuentas de prueba y tres resultados por jornada/usuario. No son registros de producción ni datos de la empresa.

`administracion.png` muestra cuentas genéricas del fixture y campos de contraseña vacíos. `inspeccion-antes.png` / `inspeccion-despues.png` registran dos eventos nuevos de prueba y muestran la diferencia de imagen. El fixture cambió después de capturar dashboards; por eso sus contadores no deben confundirse con los 38 eventos de Docker operativo.

El texto `docker-verificacion.json` recoge estados verificados de Docker local sin secretos. No se fabrica una captura de Docker Desktop ni del túnel para sustituir su ausencia. Las fotos de planta externas al proyecto no se publican. La revisión final agregó cloudflare-verificacion.json con HTTPS público comprobado; no se repitió el celular.

Los originales de estas capturas no contienen fotos reales de IMACASA. El informe posvisita integra recortes fieles de la vista de inspección y del historial, rotulados como simulación y con sus originales conservados.

Las capturas docker-ui-pc08.png y docker-filtro-legado.png se obtuvieron directamente de localhost:8080, UI Docker actualizada, sin generar eventos nuevos. La segunda muestra los cuatro IDs históricos verificados. No contienen credenciales.

Las 12 capturas fueron autorizadas para publicación tras revisión. Son evidencia histórica de la UI sintética; la nueva regresión de sesión se documenta en CORRECCION_SESION.md. El JSON Cloudflare es evidencia de respuestas, no una captura de terminal.

## Evidencia posvisita del 11 de noviembre de 2026

- `contexto-posvisita.png`: sección Sistema con contexto verbal y propuesta, capturada en servidor aislado con la misma UI; ninguna estadística industrial se incorporó a SQLite.
- `login-posvisita.png`: formulario sin credenciales. El aviso de inicio corresponde al estado anónimo, no al error antiguo de una sesión autenticada.
- `cloudflare-posvisita.json`: tres respuestas HTTPS obtenidas del túnel actual, token omitido. `api-posvisita.png` es la captura de una vista legible de ese registro real; no se hace pasar por terminal ni por Docker Desktop. Figura 6 del PDF.
- `pruebas-posvisita.json`: resultados de pruebas y digest de los 38 eventos conservados antes/después de reconstruir.
- `calculos-posvisita.json`: resultados de fórmulas de diseño; no son observaciones de planta.

Las figuras 4–5 son recortes de capturas históricas autorizadas; no cambian valores ni identificadores. La verificación actual de filtros y persistencia está registrada por separado. Los gráficos de los cuatro roles se volvieron a comprobar en una base aislada; no se atribuyen sus contadores al historial operativo.
