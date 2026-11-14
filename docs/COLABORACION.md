# Trabajo de cuatro integrantes

## Reparto propuesto

| Integrante | Responsabilidad | Archivos principales | Criterio de revisión |
|---|---|---|---|
| 1 Frontend y demostración | Detalles UX, visor, tres estaciones, dashboards, responsivo y capturas | app/static/, tests/*.cjs, docs/evidencias/ | Conservar diseño y aislamiento por rol; figuras rotuladas como sintéticas |
| 2 Backend y despliegue | FastAPI, RBAC, SQLite, API, Docker, túnel y pruebas | app/*.py, compose.yaml, Dockerfile, requirements*, tests/*.py, docs/API.md | Sin rebajar seguridad ni modificar/borrar datos para que pase el demo |
| 3 Informe y evidencias | Rúbrica, ocho defectos, bibliografía, captura/arquitectura propuesta y DOCX/PDF | docs/informe/, docs/MATRIZ_RUBRICA.md, docs/IA_MODELOS.md, docs/diagramas/ | Distinguir bibliografía, simulación y pruebas; sin resultados industriales inventados |
| 4 Integración e IA | Coordinar, comprobar cobertura de modelos, revisar PR y demostración completa | docs/, revisiones GitHub, pruebas integrales | Verificar conjunto y autorizar integración con el equipo; no entrenar IA por esta organización |

Los números son funciones de trabajo, no una asignación de nombres inventada. El equipo decide qué persona ocupa cada función. No se cambiaron permisos GitHub ni se enviaron invitaciones.

## Primera instalación

Cada integrante necesita acceso al repositorio privado, Git y Docker Desktop. Mientras PR #1 siga abierto, el código está en la rama de desarrollo, no en main:

```powershell
git clone --branch feature/pc08-rbac-dashboard https://github.com/DiegoCarpio1210/IA_IMACASA.git
cd IA_IMACASA
.\preparar.ps1
docker compose up -d --build
```

Abrir http://localhost:8080. Crear cuentas según [CUENTAS.md](CUENTAS.md). Cada clon tiene su propio `.env`, contraseñas y volumen; no compartir una base operativa ni esperar que Git sincronice inspecciones. Para otra máquina usar Docker Compose y el mismo procedimiento; no es necesario copiar la base del Lenovo.

## Ramas y Pull Requests

Crear una rama solo cuando haya trabajo concreto. Prefijos recomendados: `frontend/nombre-tarea`, `backend/nombre-tarea`, `documentacion/nombre-tarea`, `integracion/nombre-tarea`.

```powershell
git fetch origin
git switch feature/pc08-rbac-dashboard
git pull --ff-only
git switch -c frontend/nombre-tarea
# Editar, ejecutar pruebas y revisar el diff
git diff
git status --short
git add RUTA_DEL_ARCHIVO_REVISADO
git diff --cached
git commit -m "fix: describir el problema corregido"
git push -u origin frontend/nombre-tarea
```

Abrir PR hacia `feature/pc08-rbac-dashboard` mientras PR #1 no se haya integrado. Después de su aprobación y fusión manual por el responsable, el equipo podrá usar main como base. No hacer push directo a main, force push ni fusión automática. El PR debe explicar problema, comportamiento nuevo, pruebas ejecutadas y pendientes. No afirmar que una captura es una prueba industrial.

Para incorporar cambios de la base a una rama compartida, usar `git fetch origin` y `git merge origin/feature/pc08-rbac-dashboard`. Resolver cada conflicto leyendo ambas versiones y repetir pruebas; si no se puede resolver, `git merge --abort` conserva el trabajo previo al intento. No usar opciones que elijan ciegamente todos los cambios de un lado.

## Evitar conflictos

Coordinar antes de editar simultáneamente `app/static/app.js`, `dashboard.js`, `index.html`, `app/rbac.py`, `store.py`, `compose.yaml`, dependencias y README. Frontend y backend acuerdan contratos de respuesta en `docs/API.md`. No modificar un esquema de SQLite sin migración y prueba. Un solo integrante edita cada DOCX binario por vez: Word no permite fusionarlo como código. Registrar quién lo tiene y entregar una versión sanitizada revisada; nunca reemplazar originales privados. Las capturas se agregan con nombre que indique caso/entorno, no se sobreescriben para aparentar nuevas pruebas.

## Antes de solicitar integración

```powershell
docker build --target test -t pimientero-rbac-tests .
docker run --rm pimientero-rbac-tests
npm install
npx playwright install chromium
node --test tests/test_images.cjs
```

Seguir `docs/PRUEBAS.md` para fixture y variables de navegador; ejecutar dashboard, sesión y visor en ese orden (el visor agrega dos eventos al fixture). Confirmar 401/403 y aislamiento cuando se toque autenticación; revisar responsivo al cambiar UI. Escanear la carpeta de publicación con `tests/check_publication.py`, revisar capturas y documentos manualmente, y comprobar `git diff --cached`. No publicar `.env`, SQLite, WAL/SHM, backups, cookies o credenciales de fixture. Los roles industriales y tolerancias siguen pendientes de la visita.


## Entrega posvisita

Distribución vigente: integrante 1 frontend/demo; integrante 2 backend/API/Docker; integrante 3 informe/evidencias; integrante 4 integración/IA/calidad. No se asignan nombres sin acuerdo del equipo. Trabajar desde feature/pc08-rbac-dashboard en ramas individuales y PR hacia esa rama mientras PR #1 permanezca abierto. El informe vigente es CP1_PC08_final_sanitizado; reservar un editor DOCX y revisar contenido en Markdown para reducir conflictos. Las fotos industriales requieren autorización independiente; la copia privada del docente nunca se sube. No se agregaron colaboradores ni se cambiaron permisos.
