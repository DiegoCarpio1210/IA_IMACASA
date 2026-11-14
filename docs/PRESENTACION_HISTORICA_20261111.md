# Guía de presentación y evaluación privada

Exposición prevista: jueves 12 de noviembre de 2026, 6:50 a. m., El Salvador. Número de equipo pendiente; no renombrar a Equipo 01 confirmado.

## Preparación

Desde la carpeta clonada del proyecto, con Docker Desktop iniciado:

```powershell
docker compose up -d --build
docker compose ps
python verificar.py http://localhost:8080
docker compose --profile publico up -d tunnel
docker compose logs --tail 30 tunnel
python verificar.py https://HOST-ACTUAL.trycloudflare.com
```

En una instalación nueva ejecutar primero `./preparar.ps1`; en la existente conserva `.env` y las cuentas. Abrir http://localhost:8080 y usar credenciales locales; no abrir index.html desde el explorador. La verificación lee API_TOKEN sin imprimirlo. No usar UI_PASSWORD como Bearer. Mantener computadora y Docker encendidos y probar desde un teléfono. El túnel puede cambiar al reiniciarse; no reutilizar una URL histórica sin comprobar.

## Recorrido sugerido de seis minutos

1. Explicar el flujo manual observado, los tres defectos prioritarios y los ocho del análisis.
2. Iniciar sesión, mostrar las tres estaciones y señalar el aviso de simulación.
3. Explorar una imagen: acercar, desplazar, girar y restaurar. El giro es 2D.
4. Filtrar PC08 / 09-11-2026 / Golpes. La base heredada conserva SIM-0032, SIM-0027, SIM-0026 y SIM-0002. No generar eventos innecesarios sobre esa base.
5. Mostrar indicadores dentro del rol autorizado y exportación; aclarar que no son productividad de planta.
6. Mostrar /health 200, /info 401 y /info autenticado 200, sin proyectar el token. Explicar arquitectura futura y límites.

## Copia privada del docente

La versión local `outputs/entrega-privada-PC08/CP1_Equipo_PENDIENTE_PC08_privado.docx` (fuera del repositorio) contiene campos delimitados, no credenciales inventadas. Antes de entregar:

1. Confirmar el número oficial y sustituirlo en portada/nombre CP1_Equipo##_PC08.pdf.
2. Obtener la URL del túnel vigente y comprobarla con verificar.py.
3. Preparar un token de evaluación exclusivo siguiendo SEGURIDAD.md, si todavía no existe uno dedicado. No extraer ni restablecer contraseñas de las cuentas. Si cambia API_TOKEN, recrear el servicio API y repetir 200/401/200.
4. Completar URL y Bearer verificado únicamente en esta copia privada, exportar PDF y revisar portada/paginación. No copiarla a docs/informe ni subirla a GitHub.
5. Compartir al docente por el canal académico autorizado y revocar la credencial temporal después de evaluar.

El PDF sanitizado del repositorio está completo académicamente, pero no satisface por sí solo los campos privados de acceso de la portada. La disponibilidad en clase y la calificación dependen de la evaluación real del docente.

Para detener conservando datos: `docker compose stop`. Para cerrar solo el acceso externo: `docker compose stop tunnel`. Nunca eliminar el volumen historial.
