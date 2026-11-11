# Registro de evidencias de la actualización

Capturas obtenidas el 10 de noviembre de 2026 con Chromium/Playwright. `herrero-dashboard.png`, `pulidor-dashboard.png`, `supervisor-dashboard.png` y sus historiales provienen de una **base SQLite aislada de pruebas**, con 18 eventos sintéticos creados explícitamente: tres jornadas, dos cuentas de prueba y tres resultados por jornada/usuario. No son registros de producción ni datos de la empresa.

`administracion.png` muestra cuentas genéricas del fixture y campos de contraseña vacíos. `inspeccion-antes.png` / `inspeccion-despues.png` registran dos eventos nuevos de prueba y muestran la diferencia de imagen. El fixture cambió después de capturar dashboards; por eso sus contadores no deben confundirse con los 38 eventos de Docker operativo.

El texto `docker-verificacion.json` recoge estados verificados de Docker local sin secretos. No se fabrica una captura de Docker Desktop ni del túnel para sustituir su ausencia. Las fotos de planta externas al proyecto no se publican. La revisión final agregó cloudflare-verificacion.json con HTTPS público comprobado; no se repitió el celular.

Los originales no contienen fotos reales de IMACASA. Cada figura se debe rotular en el informe como simulación y señalar el entorno de prueba. Falta integrar las capturas seleccionadas en el informe definitivo después de la visita.

Las capturas docker-ui-pc08.png y docker-filtro-legado.png se obtuvieron directamente de localhost:8080, UI Docker actualizada, sin generar eventos nuevos. La segunda muestra los cuatro IDs históricos verificados. No contienen credenciales.

Las 12 capturas fueron autorizadas para publicación tras revisión. Son evidencia histórica de la UI sintética; la nueva regresión de sesión se documenta en CORRECCION_SESION.md. El JSON Cloudflare es evidencia de respuestas, no una captura de terminal.
