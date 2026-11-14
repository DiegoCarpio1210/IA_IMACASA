# Auditoría de cierre del 14 de noviembre de 2026

## Base y preservación

Árbol inicial limpio. Rama feature/pc08-rbac-dashboard; main con README solamente al inicio. Fetch detectó fb308f126c3a4cba581acdbf81a0c26493e8115e (Alfredo Cortez), dos archivos de documentación/evidencia, integrado por fast-forward. fea1f90 (frontend) y c7e42b1 están incluidos. Ningún archivo eliminado, ninguna contraseña o permiso operativo modificado. Inventario inicial: 99 archivos rastreados, 15 capturas PNG. La biblioteca Chart.js vendorizada se conserva con licencia.

## Hallazgos y decisiones

- La guía original tiene dos páginas y seis componentes (25+20+20+15+15+5). Exige análisis por defecto, no implementar un clasificador de ocho clases. Se conservan ocho categorías académicas, pero el piloto se limita a tres.
- El parche del equipo sustituye 900 piezas/7440 imágenes por un presupuesto nuevo; las cifras viejas son históricas. Jornada efectiva desconocida; escenarios 8/10/12/24 h no son mediciones. Banda con cámaras laterales y superior es la propuesta principal, todavía no construida.
- Anexo de Alfredo: la tabla atribuye API_TOKEN también a UI, pero compose.yaml solo la pasa al servicio API. UI reenvía el Bearer recibido, no necesita ese secreto.
- Anexo de Alfredo: verificar.py comprueba health, token ausente, incorrecto y válido, claves y timestamp; Basic, WWW-Authenticate y /docs están cubiertos por test_app.py, no por ese script. La documentación de casos es válida como contrato, pero no todos se ejecutan en verificar.py.
- Exigir longitud exacta 40 para API_TOKEN solo corresponde al generador preparar.ps1; el contrato admite otros tokens no vacíos. No se cambia el token operativo.
- El texto histórico del visor dice que enconchados no está confirmado: se interpreta como falta de validación industrial formal. El informe distingue la explicación verbal recibida. No se modifica el diseño ni la lógica del compañero.
- Los límites del demo incluyen SQLite monoinstancia, limitación de intentos en memoria, autenticación de demostración y ausencia de modelo/cámara física. No constituyen certificación de seguridad industrial.
- Los registros gráficos y las imágenes son simulados. Las capturas de API muestran respuestas o una visualización de un registro real, no fotografías de planta ni una terminal inventada.

## Referencia visual

El usuario confirmó PBL_3_reporte.pdf de Descargas. Carta; cuerpo Times New Roman 12 pt, títulos principales 14 pt, subtítulos 12 pt negrita, portada 16 pt, texto justificado y marco de página. Se conserva esa identidad sin copiar contenido de electrónica, índice ni referencias ajenas.

## Acceso del docente

El repositorio permanece privado. Falta identificar y comprobar la cuenta GitHub del docente; un enlace no acredita permiso. El propietario debe abrir Settings > Collaborators, invitar la cuenta confirmada y comprobar aceptación; después pedir que abra el enlace autenticado. No se cambia visibilidad ni se crea copia pública. Si una cuenta personal no ofrece permiso de solo lectura adecuado, no prometerlo: usar el canal académico autorizado para el PDF sanitizado.

## Ejecuciones actuales

Pendientes de registrar después de organizar. Las ejecuciones del 10 y 11/11 son históricas.


## Resultados actuales verificados

14/11/2026: Python local 9 PASS, Docker 9 PASS, Node imágenes 2 PASS. Navegador cuatro roles, dashboards, historial, exportación, móvil emulado, sesión 401/403, rol solo lectura y visor PASS. Primer intento del visor sin variable privada no llegó al login; repetición correctamente configurada PASS. Docker 29.9.3, API healthy, UI running, archivos coincidentes y reinicio con 38 eventos/campos conservados; filtro [32,27,26,2]. HTTPS nuevo 200/401/200; verificar.py también comprueba token incorrecto 401. Evidencia: pruebas-20261114.json y cloudflare-20261114.json. No se probó un teléfono físico en esta ejecución. No son pruebas de IA.


## Revisión documental

PDF vigente: 10 páginas de cuerpo incluida portada y 1 de referencias, sin índice. Cuerpo TNR 12, títulos 14/12, tablas 11 como referencia. Fuentes primarias reabiertas y verificadas; iluminación reflejada distinguida de darkfield transmitido. Enlace GitHub clicable. Copia privada fuera del repo: mismo cuerpo, URL temporal verificada y Bearer exclusivo pendiente, sin token operativo copiado. Usuario confirmó no disponer de cuenta GitHub docente; acceso pendiente.


## Publicación revisada

128 archivos del paquete revisados sin hallazgos de secretos. Índice Git de 128 archivos e historial de 9 commits previos al cierre revisados sin hallazgos. Enlaces Markdown locales válidos. PDF/DOCX con texto y metadatos inspeccionados; capturas del demo revisadas visualmente. No hay modificaciones en app/, tests/, Dockerfile ni compose.yaml respecto a fb308f1. El control es una auditoría acotada de entrega, no una certificación integral de seguridad.

