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
