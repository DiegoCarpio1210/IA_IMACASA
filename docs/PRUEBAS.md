# Pruebas y resultados verificables

Ejecución del 10 de noviembre de 2026 en Lenovo P52s. No son métricas de inferencia ni pruebas de calidad de machetes.

| Prueba | Resultado observado |
|---|---|
| Python local, desde raíz del proyecto | 9 aprobadas |
| Python dentro de imagen Docker `test` | 9 aprobadas |
| Node, imágenes sintéticas | 2 aprobadas |
| Navegador por rol | Herrero, pulidor, supervisor y administrador aprobados |
| Visor navegador | Imágenes y píxeles cambian por evento, polling estable, zoom hasta 500 %, giro, desplazamiento, enfoque, ocultar marca, restablecer y estado vacío |
| Docker UI migrada | 38 eventos existentes conservados |
| Reinicio real Docker UI | Mismos IDs y campos; sesión persistente HTTP 200 |
| Filtro legado verificado | PC08 / 09-11-2026 / Golpes → SIM-0032, SIM-0027, SIM-0026, SIM-0002 |
| API local por UI | /health 200; /info sin token 401; /info token válido 200 |
| Acceso remoto actual | No revalidado en esta actualización; evidencia previa reportada por el equipo |

Pytest emite una advertencia de deprecación de AnyIO/Starlette en TestClient; no fallan pruebas por ella. Primeros intentos de QA detectaron la carpeta de tests excluida del build y un error en el propio test del zoom (intentaba pulsar un botón ya deshabilitado al llegar a 500 %); ambos corregidos antes del resultado final. Ejecutar pytest desde la raíz del proyecto, donde existe el módulo `app`.

## Cobertura Python

`test_app.py`: contrato API, seguridad de proxy, sesión e inspecciones. `test_rbac.py`: login correcto/incorrecto, hashes Argon2id, logout, permisos 403, aislamiento, estadísticas exactas de filas SQLite, filtros combinados, CSV, secundarios fuera del agregado, gestión y revocación de cuentas, roles, auditoría, parámetros y migración de IDs anteriores con respaldo. Persistencia de sesión tras reinicio de lifespan, complementada por prueba real de Docker.

```powershell
python -m pytest tests -q
docker build --target test -t pimientero-rbac-tests .
docker run --rm pimientero-rbac-tests
node --test tests/test_images.cjs
```

## Fixture de navegador reproducible

Las capturas no usan una base operativa: el fixture crea explícitamente 18 filas sintéticas (3 jornadas × 2 cuentas × 3 escenarios) en una carpeta nueva. Contraseñas aleatorias se guardan solo en un archivo local excluido del repositorio. No ejecutar el fixture contra el volumen de clase.

```powershell
python tests/prepare_browser_fixture.py --directory private/browser-run-01
$env:DB_PATH = Join-Path $PWD 'private/browser-run-01/browser-test.sqlite3'
python -m uvicorn app.ui:app --host 127.0.0.1 --port 8093
```

En otra terminal, instalar las dependencias de desarrollo y Chromium con `npm install` y `npx playwright install chromium`. No se necesitan para ejecutar el demo.

```powershell
$env:TEST_BASE_URL='http://127.0.0.1:8093'
$env:TEST_ACCOUNTS_FILE=Join-Path $PWD 'private/browser-run-01/browser-accounts.json'
$env:TEST_CAPTURE_DIR=Join-Path $PWD 'private/browser-run-01/capturas'
node tests/test_dashboard.cjs
$accounts=Get-Content $env:TEST_ACCOUNTS_FILE -Raw | ConvertFrom-Json
$env:TEST_UI_USER='supervisor'
$env:TEST_UI_PASSWORD=$accounts.supervisor.password
node tests/test_viewer.cjs
Remove-Item Env:TEST_UI_PASSWORD
```

Si Chromium no es el instalado por Playwright, definir TEST_BROWSER_PATH a su ejecutable. Los dashboards se prueban primero (18 filas); el test del visor agrega dos eventos. Para repetir las aserciones iniciales, crear otra carpeta nueva. Nunca subir browser-accounts.json.

## Persistencia Docker real

`python tests/check_docker_restart.py` usa el `.env` privado y Docker local; comprueba la migración de este entorno legado (espera los cuatro IDs históricos documentados), reinicia UI y compara SHA-256 de todos los campos de eventos y sesión. No imprime secretos, no crea ni borra eventos. Una instalación nueva no tiene esos cuatro IDs y no debe presentar este chequeo particular como si los tuviera. Si `docker` no está en PATH, definir DOCKER_EXE con su ruta. Las pruebas genéricas de migración en pytest sí son reproducibles en una instalación vacía.

## Evidencias y límites

Ver `evidencias/README.md`. La captura móvil del dashboard verifica tamaño de pantalla con Chromium local; no equivale a una nueva prueba física desde teléfono por Cloudflare. No se probó la Victus ni inferencia real. No hubo acceso a datos industriales nuevos. Los 18 registros de prueba y los 38 de Docker son conjuntos diferentes y no deben sumarse como producción.

## Control previo a publicación

`python tests/check_publication.py CARPETA_LIMPIA --private-env .env` comprueba nombres prohibidos, credenciales locales conocidas y patrones de tokens. Para PDF requiere `python -m pip install pypdf`. Extrae texto de PDF y XML del DOCX; revisar también capturas visualmente. Ejecutar contra una carpeta de publicación limpia, no contra el entorno operativo que deliberadamente contiene `.env`. No sustituye una auditoría de secretos desconocidos ni permisos legales.
