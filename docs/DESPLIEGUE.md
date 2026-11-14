# Demostración local y túnel temporal

Desde la carpeta con compose.yaml, Docker Desktop iniciado:

```powershell
.\preparar.ps1
docker compose up -d --build
docker compose ps
python verificar.py http://localhost:8080
```

Abrir http://localhost:8080, nunca index.html como archivo. Ingresar con una cuenta existente o crear cuentas mediante `docs/CUENTAS.md`. Si la sesión caducó, el formulario solicita acceso; una cuenta válida no debe conservar el aviso anterior. Después de actualizar usar Ctrl+F5.

```powershell
docker compose --profile publico up -d tunnel
docker compose logs --tail 30 tunnel
python verificar.py https://URL-EMITIDA-AHORA.trycloudflare.com
```

La URL Quick Tunnel es temporal. El comando verificar.py lee API_TOKEN del `.env` sin imprimirlo y comprueba 200/401/401/200. No usar UI_PASSWORD como Bearer. Las pruebas de esta revisión recorrieron HTTPS desde el equipo por el servicio público: interfaz 200, health 200, info anónimo 401, info autenticado 200, eventos y administración sin sesión 401. Eso no sustituye una prueba desde un teléfono ni garantiza disponibilidad durante la clase. La evidencia está en `evidencias/cloudflare-verificacion.json`; el hostname temporal no se anuncia como enlace permanente.

Para respaldar, consultar `SEGURIDAD.md`. Para consultar logs: `docker compose logs --tail 50 api ui`. Para parar servicios conservando datos: `docker compose stop`; para volver: `docker compose up -d`. Cerrar acceso externo al terminar: `docker compose stop tunnel`. Nunca `docker compose down -v`.

Antes de clase: encender Docker, comprobar API healthy, verificar nuevamente la URL y las tres respuestas exigidas, probar desde el celular y mantener el equipo encendido. La copia privada de entrega debe incluir credenciales temporales verificadas conforme a la rúbrica; la copia GitHub permanece sanitizada. No se incluyó una contraseña universal.
