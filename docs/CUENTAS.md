# Crear las cuatro cuentas de demostración

No necesitas conocer la contraseña anterior. Estos comandos crean cuentas nuevas con entrada oculta y conservan usuarios, inspecciones y volumen. Ejecutar en PowerShell desde la carpeta que contiene `compose.yaml`, con Docker Desktop iniciado:

```powershell
docker compose up -d
docker compose ps
docker compose exec ui python -m app.manage create-user --username admin-demo --name "Administrador de demostración" --role admin
docker compose exec ui python -m app.manage create-user --username supervisor-demo --name "Supervisor de demostración" --role supervisor
docker compose exec ui python -m app.manage create-user --username herrero-demo --name "Herrero de demostración" --role herrero
docker compose exec ui python -m app.manage create-user --username pulidor-demo --name "Pulidor de demostración" --role pulidor
```

Cada comando pide una contraseña nueva y su repetición. Usa una diferente por cuenta, entre 12 y 200 caracteres. Al escribir no aparecen letras ni asteriscos: es normal. No pongas la contraseña en el comando, en GitHub, en una captura ni en el chat. No uses `-T` en estos cuatro comandos: la terminal interactiva permite ocultar la entrada.

Si una cuenta ya existe, el comando no la reemplaza. Elige otro nombre o, únicamente si deseas cambiar esa cuenta, ejecuta `docker compose exec ui python -m app.manage reset-password --username NOMBRE`. El restablecimiento revoca las sesiones de esa cuenta; no borra inspecciones.

Abrir http://localhost:8080. Iniciar sesión con el nombre exacto y la contraseña que acabas de elegir:

| Usuario | Contraseña | Qué comprobar |
|---|---|---|
| admin-demo | La elegida al crear admin-demo | Administración, cuentas, permisos y auditoría; sin dashboard gerencial por defecto |
| supervisor-demo | La elegida al crear supervisor-demo | Indicadores PC08, historial global y revisión del demo |
| herrero-demo | La elegida al crear herrero-demo | Solo sus eventos e indicadores PC08 |
| pulidor-demo | La elegida al crear pulidor-demo | Solo sus eventos e indicadores PC08 |

Cerrar sesión antes de cambiar de cuenta. Un operario nuevo inicia sin inspecciones asignadas: es correcto que vea gráficos vacíos. Para probarlos, generar explícitamente un evento sintético con esa cuenta; no se asignan las 38 inspecciones antiguas a trabajadores inventados. El supervisor sí ve los registros heredados de PC08. La comparación por usuario necesita datos de al menos dos cuentas y sigue siendo simulada.

El usuario antiguo migrado conserva su acceso y no se eliminó. `UI_PASSWORD` en `.env` no es la clave de estas cuentas nuevas ni el Bearer Token de la API. Las nuevas contraseñas se guardan como hashes Argon2id en SQLite.

Si falta el comando `docker`, abrir una nueva terminal tras instalar Docker Desktop o usar su ruta completa. Si la UI parece anterior, ejecutar `docker compose up -d --build` y recargar con Ctrl+F5. No abrir `index.html` como archivo suelto.
