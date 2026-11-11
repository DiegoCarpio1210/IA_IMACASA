# Migración y manejo de credenciales

Se respaldó el proyecto completo y la base Docker antes de editar. Los respaldos permanecen fuera de la publicación y pueden contener secretos, por lo que deben permanecer locales. La migración automática también genera un respaldo en `/data/backups` cuando encuentra el esquema antiguo.

## Respaldo y recuperación

Con Docker operativo, crear un respaldo coherente con la API SQLite, sin copiar archivos en plena escritura:

```powershell
docker compose exec -T ui python -c "from app import store; import sqlite3; from pathlib import Path; p=Path('/data/backups'); p.mkdir(exist_ok=True); src=sqlite3.connect('/data/events.sqlite3'); dst=sqlite3.connect('/data/backups/manual.sqlite3'); src.backup(dst); dst.close(); src.close()"
docker compose cp ui:/data/backups/manual.sqlite3 ./respaldo-local.sqlite3
```

Guardar el respaldo fuera del repositorio; contiene hashes y sesiones. Para volver a una versión antigua: detener la UI, conservar otra copia del estado actual y restaurar la base compatible con el código respaldado. No sustituir una base activa ni usar `down -v`. La copia anterior a RBAC no contiene las nuevas cuentas; un rollback requiere esa decisión explícita.

## Autenticación

Argon2id usa los parámetros de `argon2-cffi PasswordHasher` y admite rehash al iniciar sesión. Sesiones aleatorias de 256 bits aproximados (`token_urlsafe(32)`), solo hash SHA-256 en SQLite, vencimiento 8 h, cookie HttpOnly y SameSite Strict, Secure al acceder por HTTPS. Los cambios de cuenta y contraseña revocan sus sesiones. Los permisos y estado activo se comprueban en cada solicitud. Las mutaciones exigen cabecera propia y verifican Origin cuando existe. CSP local, no-store y no embedding. Rate limit de intentos fallidos por IP en memoria: 10/minuto, alcance de demo monoproceso; detrás de proxy puede agrupar visitantes. No se declara resistencia industrial a abuso distribuido.

La importación de UI_PASSWORD es transitoria y solo cuando la tabla de usuarios está vacía. Mantiene el acceso existente sin rotación silenciosa; guarda únicamente su hash en SQLite. No convierte UI_PASSWORD en Bearer. Nuevas cuentas se crean con entrada oculta en CLI o HTTPS en administración; no hay contraseñas universales en el código. `.env` heredado puede conservar la clave en texto por compatibilidad: retirar ese valor después de comprobar cuentas SQLite y respaldos. La aplicación ya no lo usa para autenticar una base con usuarios.

## Rotación de credenciales expuestas anteriormente

El token anterior apareció en conversaciones/informe de entrega. No se reproduce aquí. El repositorio nuevo no tiene historia previa que sanear; la copia publicada del informe retira credenciales. El `.env` operativo NO se cambió en esta actualización.

1. Cerrar temporalmente el túnel: `docker compose stop tunnel`.
2. Generar un token aleatorio nuevo con un gestor local o `secrets.token_urlsafe(32)` y guardarlo directamente en `API_TOKEN` del `.env`, sin imprimirlo en terminal, capturas o chats. No usar UI_PASSWORD.
3. `docker compose up -d --force-recreate api ui` para cargar configuración. Ejecutar `python verificar.py http://localhost:8080`; exigir 200/401/401/200. Comprobar además que el token retirado devuelve 401, introduciéndolo de forma privada.
4. Si la contraseña UI fue compartida, usar `docker compose exec ui python -m app.manage reset-password --username NOMBRE`; las sesiones se revocan. Vaciar UI_PASSWORD del `.env` solo después de validar la cuenta SQLite y volver a crear UI.
5. Actualizar solo las copias privadas de entrega que deban contener la credencial temporal. Nunca el repositorio. Reabrir el túnel, comprobar la URL nueva y repetir la prueba desde el móvil.

La rotación es un procedimiento pendiente de decidir antes de compartir acceso, no una prueba ya realizada ni modificación silenciosa del entorno. Repo privado no sustituye exclusión de secretos. No versionar bases, cookies, passwords de fixture, fotografías autorizadas solo para uso interno ni capturas de `.env`/`docker inspect` que expongan variables.
