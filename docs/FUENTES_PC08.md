> Revalidado el 14/11/2026. La cámara se aplica ahora a tres vistas de banda propuesta; véase ALCANCE_VIGENTE.md. Se conservan condiciones bibliográficas de los modelos.

# Registro de fuentes primarias

Consulta: 11 de noviembre de 2026. Enlaces abiertos y contrastados; no se inventaron DOI ni se trasladaron resultados a IMACASA.

[1] KEY Institute, “CheckPoint infra Reto IMACASA”, Ingeniería de la IA, 5 nov. 2026. PDF oficial del curso consultado localmente.

https://keyinstitute.instructure.com/courses/310/files/51600

[2] K. Roth et al., “Towards Total Recall in Industrial Anomaly Detection”, CVPR, 2022. Tabla 5 y apéndice de implementación.

https://arxiv.org/abs/2106.08265

[3] T. Defard, A. Setkov, A. Loesch y R. Audigier, “PaDiM: a Patch Distribution Modeling Framework for Anomaly Detection and Localization”, arXiv:2011.08785, 2020. Tabla VII.

https://arxiv.org/abs/2011.08785

[4] Ultralytics, “Ultralytics YOLO11”, documentación oficial, tabla Detection COCO.

https://docs.ultralytics.com/models/yolo11/

[5] PyTorch, “wide_resnet50_2”, documentación oficial de torchvision, parámetros y pesos ImageNet.

https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.wide_resnet50_2.html

[6] PyTorch, “resnet18”, documentación oficial de torchvision, parámetros y pesos ImageNet.

https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet18.html

[7] Basler, “acA2440-35uc”, documentación oficial de especificaciones de cámara.

https://docs.baslerweb.com/aca2440-35uc

[8] OpenCV, “Camera Calibration”, documentación oficial.

https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html

[9] Edmund Optics, “Common Illumination Types”, nota técnica del fabricante.

https://www.edmundoptics.com/knowledge-center/application-notes/illumination/choose-the-correct-illumination/

[10] Cloudflare, “Quick Tunnels”, documentación oficial; túneles temporales de prueba.

https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/

## Localización de las afirmaciones

- PatchCore: artículo completo https://arxiv.org/html/2106.08265v2, tabla 5 y sección de tiempo; 0,22 s con coreset 10 %, backbone incluido, GPU donde es posible. No se afirma hardware local ni un modelo de GPU no identificado.
- PaDiM: https://arxiv.org/html/2011.08785v1, tabla VII; R18-Rd100 0,23 s con i7-4710HQ. No confundir con WR50-Rd550, que usa otra dimensión y tiempo.
- YOLO11n: tabla Detection COCO, 640, 2,6 M, 6,5 GFLOPs, CPU ONNX 56,1 ± 0,8 ms y T4 TensorRT10 1,5 ms. No equivalen a latencia de línea ni garantizan detección de clases PC08.
- torchvision: 68 883 240 y 11 689 512 parámetros de las redes completas, no del sistema completo con bancos/estadísticas. Los MB FP32 del informe son cálculos propios, no tamaño de archivo ni RAM pico publicados.
- Basler: 2448 × 2048 por defecto y 2464 × 2056 completa; global shutter, color, USB3, 35 fps y trigger. Se diferencia el banco detenido de una banda hipotética.
- OpenCV e iluminación: fundamento de calibración, control de reflejos y silueta. Las decisiones ópticas requieren piloto.
- Cloudflare: Quick Tunnel temporal para pruebas, sin continuidad garantizada. La evidencia operativa está separada de la documentación del proveedor.

La rúbrica [1] se leyó completa desde el PDF local del curso (2 páginas, fecha interna 05/11/2026); no se afirmó acceso público al enlace Canvas autenticado. Las notas industriales se registran en VISITA_IMACASA.md como comunicación del equipo. No hay una norma internacional documentada para el criterio verbal de 2 mm.


[11] KEYENCE, Machine Vision Lighting Selection Guide. https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp

[12] M. Aghaei et al., Complex-Object Visual Inspection via Multiple Lighting Configurations, arXiv:2004.09374, 2020. https://arxiv.org/abs/2004.09374

La nota Edmund diferencia contraluz para silueta y luz difusa; su apartado darkfield transmitido no es el campo oscuro reflejado propuesto para metal. Este último se fundamenta en KEYENCE y la investigación multiluces. No se extrapolan resultados a IMACASA.
