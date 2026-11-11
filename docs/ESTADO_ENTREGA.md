# Estado técnico y paquete de entrega

## Resultado de la corrección

Se corrigió el mensaje obsoleto de autenticación sin cambiar permisos ni diseño. Causa, pasos de reproducción y archivos modificados: [CORRECCION_SESION.md](CORRECCION_SESION.md). La prueba previa falló mostrando sesión 200 junto al mensaje de 401; la misma secuencia corregida pasa en los cuatro roles y en Docker local.

## Verificaciones realizadas

| Verificación | Resultado |
|---|---|
| Pytest local / contenedor actualizado | 9 / 9 aprobadas; advertencia AnyIO/Starlette |
| Node imágenes | 2 aprobadas |
| Navegador dashboards | Cuatro roles y pantalla móvil aprobados con fixture sintético |
| Regresión nueva de sesión | Cuatro roles, login/logout, 401/403, navegación y CSV; nota y denegación para rol sin simulate |
| Visor | Imagen diferenciada y píxeles, zoom 500 %, giro, desplazamiento, foco, marca y reset aprobados |
| Docker localhost:8080 | Archivos desplegados coinciden por SHA-256; relogin con sesión 200 y sin aviso antiguo |
| SQLite | 38 eventos preservados con IDs/campos y sesión tras reinicio; filtro legado 32,27,26,2 |
| Cloudflare HTTPS | Health 200; info 401/200; endpoints UI sin sesión 401; login/events 200 y logout 401; cookie segura |
| Informe original | PDF conserva SHA-256 previo; no se editó DOCX/PDF originales |
| Copia sanitizada | 10 páginas totales, sin adjuntos PDF; 12 capturas y 2 informes revisados e inventariados |
| Seguridad del paquete | Sin coincidencias de secretos locales conocidos; excluidos .env, SQLite, respaldos y datos de planta |

No se comprobó en esta revisión un teléfono físico ni la Victus. Las cuatro cuentas del fixture son cuentas aleatorias aisladas; no se restablecieron las contraseñas particulares del equipo. No se entrenó ni ejecutó un modelo IA. Todas las inspecciones del demo son sintéticas.

## Cómo continuar

Abrir http://localhost:8080 con Docker activo; Ctrl+F5 después de actualizar. Para cuentas, [CUENTAS.md](CUENTAS.md). Para los cuatro integrantes, [COLABORACION.md](COLABORACION.md). Para túnel, [DESPLIEGUE.md](DESPLIEGUE.md). El PR existente es [#1](https://github.com/DiegoCarpio1210/IA_IMACASA/pull/1); no debe fusionarse automáticamente. La publicación del paquete exige visibilidad privada y revisión del índice. El estado remoto se comprueba antes del push; este inventario local no afirma que todos los archivos ya estén en GitHub.

## Pendientes reales

Confirmar número oficial, responsabilidades/puestos, definiciones y tolerancias, criterios de rechazo, captura autorizada y disponibilidad de piezas durante la visita. Integrar evidencias en el informe definitivo sin superar 10 páginas de cuerpo. Crear copia privada de evaluación con URL y credencial temporal verificada, manteniendo GitHub sanitizado. Repetir prueba externa y desde celular antes de clase; Quick Tunnel no garantiza continuidad.

La matriz de los 100 puntos está en [MATRIZ_RUBRICA.md](MATRIZ_RUBRICA.md). No se afirma una nota ni cumplimiento total por tener documentos. Los originales y cualquier archivo confidencial permanecen locales.

## Inventario preparado para el PR existente

- `.dockerignore`
- `.env.example`
- `.gitignore`
- `Dockerfile`
- `INICIAR_SIN_DOCKER.cmd`
- `LEEME.md`
- `PENDIENTES_DOCUMENTO.md`
- `README.md`
- `VALIDACION.md`
- `app/__init__.py`
- `app/api.py`
- `app/catalog.py`
- `app/manage.py`
- `app/rbac.py`
- `app/static/app.js`
- `app/static/dashboard.js`
- `app/static/index.html`
- `app/static/style.css`
- `app/static/synthetic-image.js`
- `app/static/theme.css`
- `app/static/vendor/Chart.LICENSE.md`
- `app/static/vendor/chart.umd.js`
- `app/static/viewer.js`
- `app/store.py`
- `app/ui.py`
- `compose.yaml`
- `docs/API.md`
- `docs/ARQUITECTURA.md`
- `docs/CAMBIOS.md`
- `docs/COLABORACION.md`
- `docs/CORRECCION_SESION.md`
- `docs/CUENTAS.md`
- `docs/DESPLIEGUE.md`
- `docs/ESTADO_ENTREGA.md`
- `docs/IA_MODELOS.md`
- `docs/IDENTIDAD.md`
- `docs/MATRIZ_RUBRICA.md`
- `docs/PRUEBAS.md`
- `docs/REVISION_PUBLICACION.md`
- `docs/SEGURIDAD.md`
- `docs/diagramas/flujo-propuesto.svg`
- `docs/diagramas/soporte-conceptual.svg`
- `docs/evidencias/README.md`
- `docs/evidencias/administracion.png`
- `docs/evidencias/cloudflare-verificacion.json`
- `docs/evidencias/docker-filtro-legado.png`
- `docs/evidencias/docker-ui-pc08.png`
- `docs/evidencias/docker-verificacion.json`
- `docs/evidencias/herrero-dashboard.png`
- `docs/evidencias/herrero-historial.png`
- `docs/evidencias/inspeccion-antes.png`
- `docs/evidencias/inspeccion-despues.png`
- `docs/evidencias/operativo-movil.png`
- `docs/evidencias/pulidor-dashboard.png`
- `docs/evidencias/pulidor-historial.png`
- `docs/evidencias/supervisor-dashboard.png`
- `docs/evidencias/supervisor-historial.png`
- `docs/informe/CP1_PC08_preliminar_sin_credenciales.docx`
- `docs/informe/CP1_PC08_preliminar_sin_credenciales.pdf`
- `docs/informe/CP1_PC08_preliminar_sin_credenciales.txt`
- `docs/informe/README.md`
- `iniciar-local.ps1`
- `iniciar_local.py`
- `package.json`
- `preparar.ps1`
- `requirements-dev.txt`
- `requirements.txt`
- `tests/LEEME.md`
- `tests/check_docker_restart.py`
- `tests/check_publication.py`
- `tests/prepare_browser_fixture.py`
- `tests/test_app.py`
- `tests/test_dashboard.cjs`
- `tests/test_images.cjs`
- `tests/test_publication.py`
- `tests/test_rbac.py`
- `tests/test_session_message.cjs`
- `tests/test_viewer.cjs`
- `verificar.py`
