> README histórico conservado; navegación vigente en [raíz](../README.md).

# Pimientero AI · IMACASA PC08

Prototipo académico de Ingeniería de la IA, Pimientero G2. PC08 Enderezado es el módulo principal. PC10 Montaje y PC12 Inyectado se conservan como demostraciones secundarias para el checkpoint; no representan desarrollos industriales del equipo. **No hay cámara ni modelo de IA conectado. Todas las imágenes, resultados y confidencias son simulados.** Equipo 01 provisional.

La versión 2 incorpora cuentas SQLite, Argon2id, autorización en backend, indicadores por ámbito y administración técnica. Conserva el visor, historial, exportación y la API mock de dos endpoints. El informe preliminar se conserva por separado; ver [cambios y pendientes](CAMBIOS.md).

## Arquitectura y roles

Navegador → UI FastAPI/Uvicorn → SQLite en volumen `historial`. La UI reenvía `/health` y `/info` a la API mock, preservando el Bearer recibido; no lo añade por el visitante. Cloudflare Quick Tunnel es opcional y temporal. Gráficos Chart.js 4.4.8 incluidos localmente, sin CDN en ejecución. [Arquitectura, esquema y permisos](ARQUITECTURA.md).

| Rol inicial | Historial y CSV | Indicadores | Administración |
|---|---|---|---|
| Herrero provisional | Eventos propios | PC08 propio | No |
| Pulidor provisional | Eventos propios | PC08 propio | No |
| Jefe provisional | Todo PC08; secundarios propios | PC08 agregado y comparación con ≥2 usuarios asignados | Revisión humana del demo |
| Administrador técnico | Eventos propios | Sin gerenciales por defecto | Cuentas, roles, parámetros y auditoría |

Los nombres y permisos son configurables. No se asignaron defectos exclusivos a puestos. Falta validar responsabilidades con IMACASA. Las comparaciones son descriptivas de simulaciones, no productividad.

## Acceso para el equipo

Si no recuerdas la contraseña anterior, sigue [Crear las cuatro cuentas de demostración](CUENTAS.md). No hace falta borrar usuarios ni historial. Los comandos solicitan contraseñas ocultas y no contienen claves predefinidas.

## Inicio con Docker en PowerShell

Ejecutar desde la carpeta del proyecto, con Docker Desktop iniciado:

```powershell
.\preparar.ps1
docker compose up -d --build
docker compose ps
# Primera instalación: crear administrador con contraseña introducida en pantalla oculta
docker compose exec ui python -m app.manage create-user --username admin-local --name "Administrador del demo" --role admin
```

Abrir http://localhost:8080 e ingresar con esa cuenta. Desde Administración se crean operarios y supervisor. Alternativa por terminal:

```powershell
docker compose exec ui python -m app.manage create-user --username jefe-demo --name "Supervisor de demo" --role supervisor
docker compose exec ui python -m app.manage create-user --username herrero-demo --role herrero
docker compose exec ui python -m app.manage create-user --username pulidor-demo --role pulidor
```

Las claves se solicitan dos veces, mínimo 12 caracteres; no se pasan como argumentos. `preparar.ps1` genera un token API aleatorio y no sobrescribe un `.env` existente. `.env.example` solo documenta variables; no contiene credenciales válidas.

**Entorno Lenovo ya migrado:** conserva el usuario y contraseña anteriores como supervisor. No hay que recrearlos. La importación de `UI_PASSWORD` solo ocurre cuando no existen usuarios; luego manda SQLite. Crear el administrador con el comando anterior antes de gestionar otras cuentas. No se estableció una contraseña administrativa universal.

```powershell
python verificar.py http://localhost:8080
docker compose logs --tail 50 api ui
docker compose stop
# Volver a iniciar sin reconstrucción
docker compose up -d
```

`verificar.py` usa solo Python estándar, lee el token local sin imprimirlo y exige 200/401/401/200. Para publicar temporalmente el demo:

```powershell
docker compose --profile publico up -d tunnel
docker compose logs --tail 30 tunnel
# Usar la URL HTTPS recién emitida, no una URL histórica
python verificar.py https://URL-ACTUAL.trycloudflare.com
```

No ejecutar `down -v`: borraría el volumen. Cerrar el túnel al terminar: `docker compose stop tunnel`. API y UI se enlazan a 127.0.0.1; el móvil usa el túnel HTTPS. La URL anterior no garantiza disponibilidad futura.

## Uso y datos

Ingresar, seleccionar PC08 y generar un caso explícito. Cada evento se guarda con propietario e imagen sintética diferenciada. Visor: zoom 100–500 %, desplazamiento, giro 2D, foco, ocultar marca y restablecer. Historial combina estación, fecha/rango, defecto, usuario/puesto autorizados y revisión. CSV se filtra en servidor y no se limita a las 500 filas visibles. Dashboard PC08 usa únicamente registros guardados; sin datos muestra estado vacío. Las asignaciones antiguas desconocidas permanecen nulas, no se inventan trabajadores.

## Pruebas

```powershell
docker build --target test -t pimientero-rbac-tests .
docker run --rm pimientero-rbac-tests
# Sin Docker, desde esta misma carpeta:
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest tests -q
node --test tests/test_images.cjs
```

[Pruebas de navegador, persistencia real y resultados](PRUEBAS.md). Node/Playwright se necesitan solo para esas pruebas; no para usar el demo. [Evidencias](evidencias/README.md).

## Sin Docker

`INICIAR_SIN_DOCKER.cmd` / `iniciar-local.ps1` usan Python 3.12 o 3.13, entorno virtual, API en 8000 y UI en 8080. Antes de reutilizar un entorno anterior, instalar `requirements.txt` actualizado (incluye Argon2). No iniciar simultáneamente con Docker en los mismos puertos. La base de este modo está en `datos-locales/events.sqlite3`; no es el volumen Docker y no se sincroniza automáticamente. Para crear cuentas locales en ese modo:

```powershell
$env:DB_PATH = Join-Path $PWD 'datos-locales/events.sqlite3'
.\.venv\Scripts\python.exe -m app.manage create-user --username admin-local --role admin
```

## Seguridad y límites

No subir `.env`, bases operativas, WAL/SHM, sesiones, respaldos ni fotografías internas. [Migración, respaldo y rotación](SEGURIDAD.md). Las claves no se incluyen en el informe sanitizado. HTTP local sirve para el equipo propio; acceso externo debe usar HTTPS. SQLite y la limitación de intentos en memoria son decisiones para un demo de una instancia, no certificación industrial ni plataforma de producción.

La paleta naranja/blanco/verde deriva del sitio público de IMACASA y ajustes de contraste, sin atribuir un manual oficial ni aprobación empresarial; [fuentes y códigos](IDENTIDAD.md). Pendientes industriales: definiciones, tolerancias, captura autorizada, responsabilidades y criterios de aceptación. No se entrenaron modelos ni se modificaron esos supuestos.

## Entrega y trabajo del equipo

[Corrección de sesión](CORRECCION_SESION.md) · [Colaboración de cuatro integrantes](COLABORACION.md) · [API](API.md) · [Despliegue](DESPLIEGUE.md) · [Modelos propuestos](IA_MODELOS.md) · [Matriz oficial de 100 puntos](MATRIZ_RUBRICA.md) · [Revisión de material publicable](REVISION_PUBLICACION.md).

El paquete incorpora las 12 capturas sintéticas y los DOCX/PDF sanitizados autorizados tras revisión. El informe permanece preliminar; los originales privados no se modificaron. No contiene credenciales de presentación.


## Actualización académica posvisita

El informe vigente es [Word](informe/CP1_PC08_final_sanitizado.docx) / [PDF](informe/CP1_PC08_final_sanitizado.pdf), con [matriz de rúbrica](MATRIZ_RUBRICA.md), [registro de visita](VISITA_IMACASA.md) y [guía de presentación](PRESENTACION_PC08.md). Los preliminares quedan históricos. No hay modelo ni cámara real conectados.
