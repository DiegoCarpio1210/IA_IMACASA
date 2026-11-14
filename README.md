# PIMIENTERO AI — CHECKPOINT 01

KEY Institute · Ingeniería de la Inteligencia Artificial · IMACASA · Pimientero G2 · PC08 Enderezado. Número de equipo pendiente.

**Integrantes:** Diego Roberto Carpio Flamenco, Julio Roberto Guardado Quijano, Iván Daniel Salguero Esperanza y Alfredo Enmanuel Cortez Martínez.

Proponemos inspección previa a Enderezado para ondulaciones, enconchaduras y golpes/abolladuras. La banda, cámaras e inferencia son una propuesta futura. El demo web funcional usa datos e imágenes sintéticos; conserva PC08, PC10 y PC12 y las ocho categorías académicas PC08. No reemplaza la prueba mecánica.

## INFORME DEFINITIVO — CHECKPOINT 01

[PDF definitivo sanitizado](docs/informe/CP1_PC08_definitivo_20261114_sanitizado.pdf) · [Word editable](docs/informe/CP1_PC08_definitivo_20261114_sanitizado.docx) · [Alcance corregido](docs/ALCANCE_VIGENTE.md). Los [documentos anteriores](docs/informe/README.md) permanecen como históricos.

## Navegación académica

- [Auditoría y límites actuales](docs/AUDITORIA_CIERRE_20261114.md)
- [Inventario completo](docs/INDICE_REPOSITORIO.md)
- [Rúbrica de 100 puntos](docs/MATRIZ_RUBRICA.md)
- [Evidencias](docs/INDICE_EVIDENCIAS.md)
- [Arquitectura y servicios](docs/ARQUITECTURA.md)
- [Modelos y fuentes](docs/IA_MODELOS.md)
- [Backend, API y despliegue — aporte de Alfredo](docs/INFORME_BACKEND_API_DESPLIEGUE.md)
- [Pruebas](docs/PRUEBAS.md) · [Seguridad](docs/SEGURIDAD.md)
- [Presentación](docs/PRESENTACION_PC08.md)

## Ejecución

Con Docker Desktop iniciado, desde esta carpeta:

```powershell
docker compose up -d --build
docker compose ps
python verificar.py http://localhost:8080
docker compose --profile publico up -d tunnel
```

Abrir http://localhost:8080. Conservar .env y las cuentas existentes. En una instalación nueva ejecutar preparar.ps1 y seguir [cuentas](docs/CUENTAS.md). Nunca eliminar el volumen historial. El túnel es temporal y debe verificarse de nuevo antes de compartirlo; no publicar tokens. Para ejecución sin Docker consultar [guía local](LEEME.md).

## Límites

No hay cámara industrial conectada ni IA entrenada. No se conocen tolerancias visuales oficiales ni horas efectivas de producción. El repositorio es privado: el docente necesita acceso autorizado, explicado en la auditoría. La copia privada de evaluación no se publica.
