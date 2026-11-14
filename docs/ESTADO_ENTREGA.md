> Actualización 14/11/2026: [alcance vigente](ALCANCE_VIGENTE.md) y [auditoría actual](AUDITORIA_CIERRE_20261114.md) sustituyen las hipótesis industriales y el estado de entrega siguientes. El contenido inferior se conserva como registro histórico del 11/11; no usar 8–10 h como jornada confirmada, 900/7440 como dataset vigente ni banco fijo como arquitectura principal.

# Estado de entrega posvisita

Actualización del 11 de noviembre de 2026. El informe final posvisita reemplaza el preliminar como propuesta académica vigente. Los archivos anteriores se conservan como históricos, sin sobrescribir originales.

## Archivos principales

- docs/informe/CP1_PC08_final_sanitizado.docx y .pdf; texto editable .md.
- docs/VISITA_IMACASA.md: origen y límites de los hallazgos.
- docs/FUENTES_PC08.md e IA_MODELOS.md: fuentes y selección híbrida.
- docs/diagramas/flujo-actual.svg, soporte-posvisita.svg, arquitectura-posvisita.svg.
- docs/calculos_pc08.py y evidencias/calculos-posvisita.json.
- docs/MATRIZ_RUBRICA.md: cobertura de 100 puntos, sin asignar nota.
- docs/PRESENTACION_PC08.md: arranque, recorrido y copia privada.

## Software

Único cambio funcional de presentación: app/static/index.html actualiza Sistema y equipo con contexto de visita separado de métricas sintéticas. Se mantienen diseño, visor, 3 estaciones, 8 categorías PC08, API mock, roles, autenticación e historial. No se añadió inferencia.

Verificación del 11/11/2026: 9 pruebas Python locales y 9 en Docker, 2 de imágenes y recorridos de cuatro roles aprobados. Se verificaron filtros, exportación, gráficos, visor, 401/403 y regresión de sesión. Docker conservó 38 eventos y el filtro histórico; HTTPS respondió 200/401/200. Son pruebas de software, no métricas de IA. La Victus y la disponibilidad en clase no se dan por verificadas.

Las seis cuentas existentes incluyen los cuatro usuarios *-demo previstos; se comprobó únicamente nombre, rol y estado. Las pruebas de los cuatro roles usaron credenciales efímeras en base aislada. No se restablecieron claves de usuarios operativos. Digest de los 38 eventos antes de reconstruir: 6b1432fd6d4d7608714a4c7b3b980718eb928655fb714e8c91d5bdb2edd66732; comparación posterior documentada en evidencia.

## Pendientes concretos

Número oficial; campos URL/token verificado de la copia privada; disponibilidad del túnel durante clase; ejemplos de defectos y autorización; validación escrita de vocabulario/criterio mecánico; dimensiones/flujo/captura/seguridad. No se atribuyen métricas reales a simulaciones. El despliegue Victus solo es necesario si será el equipo de presentación.


## Integración del cambio remoto de interfaz

Durante el cierre se detectó `fea1f90`, publicado en la rama por otro trabajo. Se integró sin descartar mejoras de login, indicadores, historial o visor. El único conflicto fue index.html: se conservó la estructura remota y se incorporó el contexto de visita. No se cambiaron backend, contraseñas, permisos o catálogo. Se repitieron los cuatro roles, regresión de sesión, exportación, gráficos, visor e imágenes; todos pasaron sin modificar pruebas. También pasaron 9 pruebas Python sobre la integración; se reconstruyó Docker y se comprobó nuevamente reinicio con 38 eventos y filtro [32,27,26,2]. La comprobación HTTPS posterior NO pudo completarse: primero falló DNS y en el último intento Docker Engine no estaba disponible. cloudflare-integracion.json registra esta limitación; el éxito 200/401/200 de las 15:35 permanece como evidencia histórica. La ejecución de 9 pruebas en imagen Docker corresponde al paquete previo a esta integración solo de frontend.

Las capturas del PDF conservan fecha y carácter histórico; el texto académico sigue vigente. Login y contexto se recapturaron con la interfaz integrada. No se atribuyen las mejoras remotas a la modificación mínima posvisita.
