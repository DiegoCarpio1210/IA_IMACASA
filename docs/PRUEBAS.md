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

## Regresión de sesión y entrega final

Se reprodujo antes del arreglo `/ui/session` HTTP 200 junto con el aviso de 401 antiguo. Después, `tests/test_session_message.cjs` pasa para los cuatro roles: expiración de cookie, login, logout/relogin, Live/Historial/Sistema, tres estaciones, CSV y separación 401/403. Incluye un rol configurado sin simulate: nota explicativa, botón no disponible y backend 403; restaura permisos al finalizar. Ejecutar con las mismas variables TEST_BASE_URL, TEST_ACCOUNTS_FILE y TEST_BROWSER_PATH del fixture:

```powershell
node tests/test_dashboard.cjs
node tests/test_session_message.cjs
node tests/test_viewer.cjs
```

La regresión se repitió además en localhost:8080 Docker con la cuenta supervisora heredada: sesión 200 después de reingresar, franja vacía. Las cuentas particulares del equipo no se restablecieron para probarlas. Se reconstruyó Docker, se ejecutaron 9 pruebas Python locales y 9 en contenedor, 2 pruebas Node y los recorridos de navegador. Las 38 inspecciones sobreviven al reinicio. Hay una advertencia de deprecación de AnyIO/Starlette, no una prueba fallida.

La nueva comprobación HTTPS pública está en evidencias/cloudflare-verificacion.json: / 200, health 200, info sin token 401 y autenticado 200; eventos y administración sin sesión 401. Se hizo desde el equipo a través del servicio público, no desde un móvil. La URL sigue siendo temporal y debe revalidarse en clase.


## Revisión posvisita del 11 de noviembre

Verificación del 11/11/2026: 9 pruebas Python locales y 9 en Docker, 2 de imágenes y recorridos de cuatro roles aprobados. Se verificaron filtros, exportación, gráficos, visor, 401/403 y regresión de sesión. Docker conservó 38 eventos y el filtro histórico; HTTPS respondió 200/401/200. Son pruebas de software, no métricas de IA. La Victus y la disponibilidad en clase no se dan por verificadas.

Pruebas del navegador sobre base aislada, sin generar eventos en el historial operativo. Incluye aviso de solo lectura cuando se retira simulate y bloqueo 403. La nueva sección de contexto conserva ocho defectos más OK y tres estaciones. AnyIO/Starlette emitió una advertencia de deprecación, sin fallo. Captura api-posvisita.png representa las respuestas reales registradas en cloudflare-posvisita.json, con token omitido; no es una captura de consola Docker. El arranque de Docker se repitió, API healthy y UI actualizada. No se repitió prueba física desde teléfono en esta revisión.


## Integración del cambio remoto de interfaz

Durante el cierre se detectó `fea1f90`, publicado en la rama por otro trabajo. Se integró sin descartar mejoras de login, indicadores, historial o visor. El único conflicto fue index.html: se conservó la estructura remota y se incorporó el contexto de visita. No se cambiaron backend, contraseñas, permisos o catálogo. Se repitieron los cuatro roles, regresión de sesión, exportación, gráficos, visor e imágenes; todos pasaron sin modificar pruebas. También pasaron 9 pruebas Python sobre la integración; se reconstruyó Docker y se comprobó nuevamente reinicio con 38 eventos y filtro [32,27,26,2]. La comprobación HTTPS posterior NO pudo completarse: primero falló DNS y en el último intento Docker Engine no estaba disponible. cloudflare-integracion.json registra esta limitación; el éxito 200/401/200 de las 15:35 permanece como evidencia histórica. La ejecución de 9 pruebas en imagen Docker corresponde al paquete previo a esta integración solo de frontend.

Las capturas del PDF conservan fecha y carácter histórico; el texto académico sigue vigente. Login y contexto se recapturaron con la interfaz integrada. No se atribuyen las mejoras remotas a la modificación mínima posvisita.


## Ejecución vigente del 14 de noviembre

Ver [auditoría](AUDITORIA_CIERRE_20261114.md) y [resultados](evidencias/pruebas-20261114.json). Sustituye únicamente el estado de disponibilidad de los apartados históricos, no sus registros originales. Nueva prueba HTTPS en [Cloudflare](evidencias/cloudflare-20261114.json).
