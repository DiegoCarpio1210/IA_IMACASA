> Actualización 14/11/2026: [alcance vigente](ALCANCE_VIGENTE.md) y [auditoría actual](AUDITORIA_CIERRE_20261114.md) sustituyen las hipótesis industriales y el estado de entrega siguientes. El contenido inferior se conserva como registro histórico del 11/11; no usar 8–10 h como jornada confirmada, 900/7440 como dataset vigente ni banco fijo como arquitectura principal.

# Enfoque de IA tras la visita

Documento vigente: informe final sanitizado, página 7. La comparación es bibliográfica; no hay modelos entrenados ni inferencia conectada al demo.

| Candidato | Uso y salida | Tamaño de referencia | Tiempo de referencia |
|---|---|---|---|
| PatchCore + WideResNet50-2 | Anomalía superficial y mapa, normales para ajuste | Backbone completo 68,88 M; banco adicional | 0,22 s en MVTec con coreset 10 %, condiciones del artículo |
| PaDiM + ResNet18 | Modelo gaussiano por posición y mapa | Backbone completo 11,69 M; medias/covarianzas adicionales | 0,23 s CPU i7-4710HQ, R18-Rd100 |
| YOLO11n COCO | Cajas/clases tras adaptación supervisada | 2,6 M, 6,5 GFLOPs a 640 | 56,1 ms CPU ONNX / 1,5 ms T4 TensorRT10 |

Las cifras no son comparables como benchmark común. Fuentes, condiciones y limitaciones: FUENTES_PC08.md.

Principal: PatchCore para golpes de mordaza y otras anomalías visibles, con bancos separados por vista/luz/familia. Complemento: calibración y contornos con OpenCV para enconchado unilateral y ondulado alternante. El criterio visual necesita calidad y perfiles; no usar 2 mm del ensayo mecánico como regla automática. YOLO requiere cajas de defectos reales; COCO no contiene estas clases. PaDiM es el comparador bajo encuadre controlado.

El piloto reserva test común por pieza, revisa falsos negativos, registra p50/p95 del ciclo y RAM/VRAM. El tamaño del banco no equivale a memoria total. La prioridad de la nueva propuesta es mejorar captura y referencia geométrica antes de aumentar complejidad del modelo.
