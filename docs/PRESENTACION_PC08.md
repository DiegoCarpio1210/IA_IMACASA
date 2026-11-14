# Demostración y entrega del 14 de noviembre de 2026

Desde la carpeta del proyecto, con Docker Desktop encendido:

```powershell
docker compose up -d --build
docker compose ps
python verificar.py http://localhost:8080
docker compose --profile publico up -d tunnel
docker compose logs --tail 30 tunnel
python verificar.py https://HOST-ACTUAL.trycloudflare.com
```

No publicar .env ni usar UI_PASSWORD como Bearer. No cambiar contraseñas operativas. No usar down -v. La URL verificada del 14/11 está guardada localmente en la copia privada; no es permanente.

## Verificación desde otro dispositivo

1. Abrir la URL actual desde teléfono con datos móviles y comprobar el login, sin proyectar claves.
2. Abrir /health: esperar 200 y {"status":"ok"}.
3. Abrir /info sin autenticación: esperar 401.
4. Para verificar Bearer en otra computadora autorizada, transferir la credencial por canal privado y ejecutar verificar.py con API_TOKEN en el entorno, cargado mediante entrada oculta. No pegar tokens en URL, capturas o repositorio. El navegador anónimo no añade Authorization por sí solo.
5. Registrar fecha, dispositivo y resultado; mantener equipo encendido y túnel activo durante evaluación. Esta comprobación manual sigue pendiente; la prueba HTTPS automatizada del 14/11 sí pasó.

## Recorrido del demo

Mostrar las tres estaciones, aviso simulado, evento/imagen, confianza ilustrativa, zoom/giro 2D y filtro PC08 + 09/11/2026 + Golpes. La base operativa contiene SIM-0032, 0027, 0026 y 0002; evitar generar inspecciones innecesarias en ella. Los roles operativos muestran solo su ámbito; supervisor consulta PC08; administración no tiene estadísticas por defecto.

## Copia de entrega

Informe sanitizado en docs/informe/CP1_PC08_definitivo_20261114_sanitizado.docx y .pdf. Copia privada fuera del repositorio: outputs/entrega-privada-PC08/CP1_Equipo_PENDIENTE_PC08_20261114_privado.docx y .pdf. Tiene URL comprobada y campo explícito pendiente para Bearer exclusivo: no se copió el token operativo ni se rotó .env. Confirmar número oficial y renombrar CP1_Equipo##_PC08.pdf solo cuando exista el dato. Tras completar campos privados, exportar y comprobar portada y 10 páginas de cuerpo.

El usuario no dispone de la cuenta GitHub del docente. Su acceso sigue pendiente; solicitarla por el canal académico, invitarla desde Settings > Collaborators y confirmar aceptación. No convertir el repositorio en público. Una URL no acredita permiso.

Para terminar el acceso externo: docker compose stop tunnel. Para detener sin borrar datos: docker compose stop.
