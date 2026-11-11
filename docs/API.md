# Contratos de API y UI

## Servicio mock del checkpoint

`app/api.py` conserva solamente dos endpoints. El puerto local 8000 es la API; la UI en 8080 los reenvía sin inyectar credenciales. La API no tiene documentación automática expuesta. La sesión UI y el Bearer de API son independientes.

| Método y ruta | Autenticación | Respuesta |
|---|---|---|
| GET /health | Pública | 200, `{ "status": "ok" }` |
| GET /info | Bearer API_TOKEN del entorno privado | Sin token o incorrecto: 401. Válido: 200 con equipo, estacion, version y timestamp con zona |

`version` es la versión del contrato mock (1.0.0), no la versión del frontend. El número de equipo en `equipo` sigue provisional. La URL temporal del túnel apunta a la UI y permite probar los dos endpoints mediante proxy. Si el docente exige que el origen público contenga únicamente dos rutas, presentar la separación de servicios y acordar su interpretación; no ocultar que la UI tiene backend propio.

## Backend propio de la interfaz

| Rutas | Permiso/estado |
|---|---|
| POST /ui/login | Credenciales de cuenta; respuesta establece cookie de sesión |
| POST /ui/logout, GET /ui/session | Sesión activa; logout revoca su token |
| GET /ui/events | read_own o read_pc08; filtros con ámbito aplicado en SQL |
| POST /ui/simulate | simulate; origen siempre SIMULADO; propio salvo asignación PC08 autorizada al jefe |
| GET /ui/export | export y mismo ámbito de lectura; CSV completo filtrado |
| GET /ui/stats | stats_own o stats_pc08; siempre PC08 |
| GET /ui/operators | read_pc08 |
| POST /ui/events/{id}/review | review; solo PC08; pending/confirmed/dismissed |
| GET/POST /ui/admin/users, POST /ui/admin/users/{id} | users; nunca devuelve hash |
| GET /ui/admin/roles, POST /ui/admin/roles/{id} | roles |
| GET /ui/admin/audit | audit |
| GET/POST /ui/admin/settings | settings |

Las mutaciones UI exigen `X-Demo-Request: 1` y Origin del mismo host cuando está presente. Sin sesión: 401. Sesión válida sin permiso: 403. Datos inválidos: 422. Conflicto de último administrador: 409. Estos estados no son intercambiables; la UI corregida no trata 403 como logout.

Filtros: station, date, date_from, date_to, defect, owner_id, role, review_status. El historial visible devuelve hasta 500 filas y un total de toda la selección; CSV aplica todos los filtros sin ese límite. Día/fecha se muestran en El Salvador. Endpoints de UI no son inferencia y no sustituyen el servicio mock.

Ver `tests/test_app.py`, `test_rbac.py`, `test_session_message.cjs` y `verificar.py`. No introducir contraseñas o tokens en ejemplos de documentación ni en URLs.
