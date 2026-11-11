# Modelos propuestos y límites de la investigación

No hay modelo cargado ni entrenado en este demo. Las imágenes, confianza y resultados son sintéticos. Se mantiene la selección del informe preliminar; no se modifican definiciones industriales pendientes.

| Candidato | Tarea y encaje propuesto | Tamaño y tiempo: interpretación |
|---|---|---|
| PatchCore con extractor Wide ResNet50-2 ImageNet | Anomalía de apariencia y localización; principal candidato para aprender normalidad con conformes | Los parámetros de la red de referencia no incluyen el banco de características. El banco crece con la selección de parches; no existe latencia medida en nuestro equipo |
| PaDiM con ResNet18 ImageNet | Distribución de características por posición; alternativa de anomalía/localización | Parámetros del backbone y memoria de estadísticas son cosas distintas. Requiere control del encuadre; tiempo publicado no es un tiempo garantizado en planta |
| YOLO11n con pesos COCO | Detección supervisada de cajas si se obtienen etiquetas de defectos | La tabla oficial indica protocolo y hardware propios. Las clases COCO no son los ocho defectos; requiere ajuste y validación antes de detectarlos |

La comparación cuantitativa original está en el informe sanitizado, página 5; incluye contexto de tamaño y latencia. No comparar directamente CPU, GPU, resoluciones o protocolos diferentes ni trasladar esos tiempos a la RTX4050. PatchCore y PaDiM son métodos de anomalías con extractores preentrenados, no clasificadores de defectos de IMACASA listos para usar. El principal se selecciona como primera hipótesis de investigación porque aprovecha conformes; no demuestra viabilidad para torcido, espesor, profundidad o daño térmico interno.

Fuentes primarias revisadas: [PatchCore, Roth et al., CVPR 2022](https://arxiv.org/abs/2106.08265), [PaDiM, Defard et al.](https://arxiv.org/abs/2011.08785), [documentación oficial YOLO11](https://docs.ultralytics.com/models/yolo11/). El enlace CVF de PatchCore devolvió 403 en esta revisión; la ficha arXiv del artículo sí se pudo consultar. No se copian resultados publicados como si fueran resultados del equipo.

Comparar con un baseline OpenCV de bordes/textura antes de añadir complejidad. RoBERTa/DeBERTa y LoRA estudiados en clase no justifican por sí solos inspección de superficies: sus tareas y adaptación no equivalen a detectar estos defectos. No se incorporaron a la aplicación. El protocolo de evaluación futura exige separar por machete/lote, mantener vistas y aumentaciones en la partición de origen y no aumentar val/test. Las cifras de imágenes del informe son supuestos de piloto, no un inventario real.

Tras la visita: confirmar clases/ambigüedades, obtener permiso y patrón de captura, medir disponibilidad de conformes y defectuosos, fijar criterios con el inspector y solo entonces ajustar modelos. Registrar versiones, hardware, resolución, memoria y latencia extremo a extremo p50/p95, además de errores por defecto y pieza. No usar porcentajes simulados como exactitud.
