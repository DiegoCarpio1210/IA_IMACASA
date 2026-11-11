# Corrección del aviso de sesión

Se reprodujo el defecto con Chromium antes de editar: login de supervisor válido, eliminación de cookie para simular expiración, consulta de eventos → 401, nuevo login → `/ui/session` 200 y barra lateral de supervisor, pero `#message` todavía contenía «Inicia sesión para continuar».

La causa está en el estado frontend: `request()` mostraba el formulario ante 401 y lanzaba un error; el catch de `refresh()` escribía ese error en la franja del workspace. `showWorkspace()` no limpiaba esa franja al autenticar otra vez. No era una plantilla condicionada al rol, un hash inválido ni un 403 convertido por el servidor. El aviso podía sobrevivir al cambio de cuenta/pantalla aunque la cookie nueva fuera válida. El caso reportado con supervisor-demo corresponde a este ciclo reproducible; no se necesitó conocer ni restablecer su contraseña.

Se modificaron `app/static/app.js`, `dashboard.js` e `index.html`. Las transiciones de acceso limpian mensajes; los errores HTTP conservan su status; 401 se presenta en el formulario, mientras 403 se informa en la sección sin expulsar al usuario. Las respuestas de solicitudes pertenecientes a una sesión anterior se descartan mediante la generación de sesión (`accessEpoch`), y cada intento de login inicia una generación nueva. Se añadió una nota para roles configurados sin `simulate` y se conservan los controles ocultos según permiso, junto con la denegación del backend.

No cambió la política RBAC, Argon2id, las sesiones SQLite ni los permisos iniciales. Supervisor conserva consulta global PC08 y generación de demo; administrador mantiene gestión técnica y no recibe estadísticas gerenciales por defecto. Herrero y Pulidor mantienen ámbito propio. En ningún caso se hizo pública la inspección.

`tests/test_session_message.cjs` falla antes del arreglo y pasa después: 401 real sin cookie, nuevo login sin aviso obsoleto, logout/login, las cuatro cuentas, navegación Live/Historial/Sistema, tres estaciones, CSV y 403 sin cierre de sesión. También configura temporalmente un herrero sin permiso de simular en la base aislada, comprueba la nota y 403, y restaura sus permisos. No toca cuentas productivas.

Las cuentas de pruebas son aleatorias en una base separada. Las verificaciones Docker preservan los 38 eventos operativos y la sesión tras reiniciar. No se generaron inspecciones adicionales en el volumen de clase.
