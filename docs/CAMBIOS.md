# Actualización técnica de Pimientero AI para PC08

La actualización incorpora autorización real por rol, cuentas persistentes y dashboards basados en SQLite, manteniendo el prototipo académico. PC08 sigue siendo el trabajo principal del equipo. Se conservaron PC10/PC12 por la aclaración final del usuario; **no se ejecutó su eliminación**. Ambos se identifican como módulos secundarios simulados.

## Qué cambió

- `app/store.py`: migración y respaldo SQLite, usuarios, roles, sesiones, auditoría y configuración. Historial conservado.
- `app/rbac.py`, `app/manage.py`: login Argon2id, permisos backend, ámbito propio/PC08, cuentas configurables, revisión y exportación.
- `app/ui.py`: integración RBAC; conserva proxy de `/health` y `/info`. `app/api.py` sin cambios funcionales.
- `app/static/index.html`, `app.js`, `dashboard.js`, `theme.css`: navegación según permisos, estadísticas, administración y paleta naranja/blanco/verde. `viewer.js` y `synthetic-image.js` reutilizados.
- `Dockerfile`, `compose.yaml`, dependencias y scripts: etapa de pruebas, Argon2, UI_PASSWORD opcional para primeras instalaciones con CLI, mismo volumen persistente. `.env` operativo conservado.
- `tests/`: pruebas de aislamiento, 403, hashes, CSV, filtros, estadísticas, migración y sesión; navegador por rol, imágenes y visor; reinicio real Docker.

## Resultado comprobado el 10 de noviembre

Lenovo P52s: API y UI reconstruidas; API healthy. 38 eventos conservados. Reinicio real UI mantiene datos y sesión. Filtro PC08 + 09/11/2026 + Golpes conserva IDs 32, 27, 26 y 2. API local 200/401/200 autenticado. Nueve pruebas Python aprobadas dentro y fuera de Docker, dos pruebas Node de imágenes y recorridos de navegador. Ver [detalle reproducible](PRUEBAS.md).

El acceso Cloudflare y móvil había sido verificado por el equipo previamente. No se presenta como una nueva prueba externa de esta versión. La URL es temporal y debe revalidarse al presentar. La HP Victus no es necesaria para que el demo local funcione; despliegue allí sigue opcional.

## Cambios futuros en el informe del checkpoint

No se rehízo el informe principal ni se modificaron definiciones industriales, tolerancias, modelos, cantidades de imágenes o arquitectura industrial futura. La copia `docs/informe` únicamente retira credenciales; conserva su naturaleza preliminar y sus cifras históricas de pruebas. Debe leerse junto con esta actualización, no como versión definitiva nueva.

| Apartado del informe | Integración necesaria antes de entrega |
|---|---|
| Interfaz y evidencia | Reemplazar captura antigua por PC08 actual; añadir dashboard operativo y gerencial con pie de figura de simulación |
| Arquitectura del demo | Añadir SQLite de cuentas/sesiones, RBAC y separación de API mock |
| Docker y acceso | Incorporar evidencia local verificada y resultados; URL temporal revalidada el día de clase |
| Seguridad | Retirar credenciales compartidas y usar acceso temporal verificado solo en copia privada |
| Autoevaluación | Reevaluar evidencia incorporada; no convertir esta mejora en puntos oficiales garantizados |
| Visita IMACASA | Incorporar únicamente definiciones, tolerancias, procedimientos y fotografías autorizadas obtenidas en planta |

## Pendientes de validación industrial

Confirmar nombres de puestos, ámbitos de acceso, autoridad del supervisor y revisión humana; definiciones de los ocho defectos y tolerancias; instrumentos usados; protocolo de captura y permisos de fotografía; asignación fiable pieza/operario; número oficial de equipo. Ningún dato sintético sustituye estos pendientes. Los nombres actuales y permisos son provisionales configurables.

## Publicación

Repositorio destino privado: `DiegoCarpio1210/IA_IMACASA`. Se prepara rama de desarrollo y PR, sin integrar automáticamente a main. Se excluyen secretos, base operativa, respaldos e imágenes internas. El commit y PR final se informan en la entrega. El repositorio estaba vacío al comenzar; no se borró historia remota.

## Corrección final y paquete autorizado

La instrucción final amplió la autorización para incluir las 12 capturas y el DOCX/PDF sanitizados después de revisar su contenido. REVISION_PUBLICACION.md registra archivos y hashes; MATRIZ_RUBRICA.md contrasta el PDF oficial. COLABORACION.md distribuye cuatro funciones y explica clonado, ramas y PR sin fusiones automáticas. API.md y DESPLIEGUE.md documentan contratos y ejecución; IA_MODELOS.md conserva la propuesta bibliográfica y sus límites.

El arreglo de la franja no cambia permisos: limpia estado de errores entre sesiones, separa 401/403 y descarta solicitudes de sesiones anteriores. Los originales privados y la propuesta industrial permanecen intactos. Ver CORRECCION_SESION.md y PRUEBAS.md para resultados actuales; las secciones anteriores describen la actualización previa.


## Actualización posvisita 11 de noviembre de 2026

Informe nuevo sin sobrescribir originales; datos de visita y enfoque híbrido; cálculos y diagramas nuevos; cambio mínimo de texto en index.html; pruebas repetidas y evidencia HTTPS nueva. No se modifican API, usuarios, permisos o eventos. Publicación autorizada de los entregables sanitizados y capturas del demo; se excluyen originales privados, .env y fotos industriales.
