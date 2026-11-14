# Pimientero AI
Checkpoint 01

KEY Institute
Ingeniería de la Inteligencia Artificial
IMACASA
Pimientero G2 · PC08 Enderezado

Integrantes

Diego Roberto Carpio Flamenco
Julio Roberto Guardado Quijano
Iván Daniel Salguero Esperanza
Alfredo Enmanuel Cortez Martínez

Entrega preparada el 14 de noviembre de 2026
Número oficial de equipo pendiente de confirmación

Inspección visual propuesta antes de Enderezado

Piloto de ondulaciones, enconchaduras y golpes o abolladuras. Propuesta de banda transportadora con cámaras laterales y superior. El demo utiliza imágenes y resultados simulados; no ejecuta inferencia industrial ni reemplaza ensayos mecánicos.

[Repositorio privado y entregables](https://github.com/DiegoCarpio1210/IA_IMACASA)
Copia sanitizada: credenciales excluidas.

# 1. Introducción, problemática y objetivos

Proponemos apoyar la inspección previa a PC08 con una banda y captura controlada de tres defectos visuales. Actualmente, según la explicación del equipo tras la visita, las piezas se acumulan y trasladan en carritos. La oportunidad es registrar sospechas de forma trazable y enviarlas a revisión humana; no existe un estudio de tiempos ni una tasa de detección medida.

1.1 Objetivos

Objetivo general: diseñar una inspección visual asistida para ondulaciones, enconchaduras y golpes/abolladuras, diferenciándola del demo académico. Objetivos específicos: justificar captura y dataset; comparar tres enfoques preentrenados; conservar un prototipo autenticado con historial; y verificar la API mediante Docker y túnel conforme a la guía [1].

2. Marco teórico

La visión por computadora convierte contraste y geometría visible en características medibles. La calibración relaciona píxeles y un plano de referencia y corrige distorsión [8]. El aprendizaje automático ajusta un criterio con datos: no basta instalar una biblioteca para reconocer defectos. PatchCore y PaDiM reutilizan características de redes preentrenadas para modelar normalidad; YOLO necesita ejemplos etiquetados para localizar clases nuevas [2–4]. Un mapa de anomalía no mide profundidad ni certifica propiedades mecánicas.

3. Contexto industrial

Se comunicaron verbalmente 15 000 machetes/día, hasta 20 000 en picos y cerca del 5 % con problemas: 15 000 × 0,05 = 750. No se atribuyen esas incidencias a los tres defectos ni a un único punto PC08. Horas efectivas y turnos no están confirmados. Se describieron aproximadamente 6–8 puestos de Enderezado.

Figura 1. Flujo actual descrito por el equipo. La banda es una propuesta, no una instalación observada.
La prueba de doblado y medición residual queda fuera del sistema. El valor verbal de aproximadamente 2 mm pertenece a ese procedimiento, no es umbral visual. La dureza requiere durómetro. El destino de corrección de cada defecto tampoco está confirmado.

# 3.1 Análisis de las ocho categorías académicas

La guía exige una fila por defecto [1]. Solo tres entran en el piloto. Las cifras son presupuesto de adquisición, no fotografías existentes ni promesa de exactitud. “Con defecto” significa capturas de piezas defectuosas: la anomalía puede no verse en todas las vistas.

| Defecto y alcance | Viabilidad, tarea y alternativa | Imágenes propuestas |
|---|---|---|
| Golpes o; abolladuras; Piloto | Captura especial superior, luz rasante/campo oscuro. Anomalías con PatchCore; cajas con YOLO tras ajuste. Profundidad: perfilómetro. | 100 piezas × 6 = 600; 1800 normales compartidas. |
| Ondulado del lomo; Piloto visual | Perfiles calibrados; OpenCV, extracción y comparación geométrica. Alternativa: regla patrón/mesa y comparador. Confirmar equivalencia del término local. | 100 × 6 = 600; 1800 normales compartidas. |
| Enconchados; Piloto visual | Desviación unilateral verbal; perfiles calibrados con OpenCV. Mesa y comparador si la vista no permite evaluar. | 100 × 6 = 600; 1800 normales compartidas. |
| Huellas; Fuera del piloto | 2D controlado si es marca visible; significado pendiente. Anomalías/segmentación. Inspector y medición superficial según definición. | Extensión: 40 × 4 = 160; 1200 normales compartidas. |
| Poros; Fuera del piloto | Macro y resolución según tamaño mínimo. Detección/segmentación. Microscopía u otro ensayo si es interno. | Extensión: 40 × 4 macro = 160; 1200 normales por adquirir. |
| Torcido; Fuera del piloto | Vistas múltiples; geometría, no una foto superior. Alternativa: útil de planitud y comparador. | Extensión: 40 × 4 = 160; 1200 normales compatibles. |
| Mal pulido; Fuera del piloto | 2D con luz controlada; clasificación/anomalías. Rugosímetro para rugosidad, no inferirla del brillo. | Extensión: 40 × 4 = 160; 1200 normales compatibles. |
| Hoja ampollada; o quemada; Fuera del piloto | 2D color/textura y rasante para relieve; anomalías/segmentación. No certifica temple; dureza/ensayo pertinente. | Extensión: 40 × 4 = 160; 1200 normales compatibles. |
Las cinco extensiones son estimaciones académicas independientes, no objetivos ni datos del piloto. Suponen 28/6/6 piezas (112/24/24 imágenes) por categoría y 300 normales × 4; solo se reutilizan negativos si coinciden vista, escala y luz. Macro exige negativos nuevos. No sumar repetidamente los negativos compartidos.

# 4. Justificación técnica de captura

4.1 Cámaras, iluminación y soporte

Proponemos tres cámaras de área Basler acA2440-35uc: una superior y dos laterales opuestas, disparadas por etapas. El fabricante especifica 5 MP, 2448 × 2048 por defecto, obturador global, color, USB 3.0 y 35 fps; admite trigger [7]. Se seleccionarán ópticas C-mount para campo de visión y distancia reales, sin dar por comprada ni validada la cámara.

Figura 2. Concepto de soporte rígido y banda indexada. No representa medidas finales ni hardware construido.
La banda propuesta transporta portapiezas separados, con apoyos definidos que no fuerzan la hoja a quedar plana. Una estructura rígida fija cámaras y referencias; la superficie flexible de la banda no es el datum. Vibración, tensión, hundimiento, apoyo, curvatura nominal y oclusión deben ensayarse. Si el apoyo oculta o modifica la desviación, la captura se declara no evaluable.

Las vistas laterales utilizan contraluz detrás del perfil cuando el paso óptico queda libre. C1 y C2 se disparan secuencialmente con fondos propios para evitar interferencias; no se presume reconstrucción 3D. La superior observa solo la cara expuesta: difusa para controlar reflejos y dos barras rasantes opuestas/campo oscuro reflejado para resaltar variaciones locales [9,11,12]. Contraluz no revela abolladuras de la cara superior opaca. No hay inspección inferior sin volteo.

4.2 Referencia geométrica

Calibrar intrínsecos/distorsión con patrón y extrínsecos con referencia rígida a la altura de inspección [8]. Registrar una pieza aceptada de cada geometría; alinear posición y orientación sin eliminar la deformación buscada. Comparar residuo del perfil contra esa referencia: unilateral sugiere enconchado; alternante, ondulación. La dirección de las dos vistas debe reconciliarse. Umbrales se definirán con IMACASA; no reutilizar los 2 mm del ensayo mecánico.

# 4.3 Modelos comparados y selección

Los tres candidatos reutilizan pesos preentrenados; los tiempos siguientes provienen de fuentes con hardware y resolución distintos. No son una comparación experimental común ni latencias de esta computadora.

| Modelo y tarea | Tamaño y latencia bibliográfica | Encaje y limitación |
|---|---|---|
| PatchCore; Anomalías y mapa [2,5] | WideResNet50-2 completo: 68,88 M parámetros. Tabla 5: 0,22 s/imagen, coreset 10 %, MVTec, 224 px; backbone incluido y GPU cuando es posible (modelo no precisado). | Principal para golpes visibles. Banco de normales por vista/luz/familia. No identifica la causa ni profundidad; sensible a reflejos y dominio. |
| PaDiM; Anomalías y localización [3,6] | ResNet18 completo: 11,69 M. Tabla VII: 0,23 s, R18-Rd100 en CPU i7-4710HQ a 2,50 GHz. | Comparador con encuadre estable; distribución por posición. Alineación y covarianzas importan; no resuelve solo geometría mecánica. |
| YOLO11n; Detección con cajas [4] | 2,6 M; 6,5 GFLOPs a 640. CPU ONNX: 56,1 ± 0,8 ms; T4 TensorRT10: 1,5 ± 0,0 ms. | Alternativa supervisada para golpes. COCO no aporta las clases PC08; requiere cajas y entrenamiento/ajuste local. |
Selección: PatchCore para superficie, complementado por OpenCV para perfiles de ondulaciones/enconchaduras. La referencia geométrica permite explicar dónde se desvía la hoja; una anomalía visual general no sustituye esa medición. PaDiM aporta un comparador; YOLO se incorpora solo si hay etiquetas suficientes. PyTorch/torchvision ofrecen los backbones conocidos; no se necesitan modelos de lenguaje, LoRA ni segmentación panóptica para este alcance.

4.4 Recursos y evaluación futura

Parámetros de backbone no equivalen a memoria total. En FP32, 68 883 240 × 4 ≈ 275,5 MB; un banco hipotético de 100 000 vectores × 1536 × 4 agrega 614,4 MB, sin activaciones ni índices. Ajustar coreset y parches según medición. La Victus Ryzen 7/16 GB/RTX4050 es recurso reportado, no benchmark verificado; medir p50/p95 de ciclo y RAM/VRAM antes de elegir despliegue.

Evaluar por pieza y familia, con test bloqueado: sensibilidad, falsas alarmas y localización cuando exista máscara. Un fallo de captura se deriva a revisión. No se prometen precisión perfecta, F1, mAP ni velocidad industrial.

# 5. Cálculos y dataset del piloto

No se localizaron fotografías nuevas de defectos con etiquetas y permiso de publicación. Las imágenes sintéticas del demo no son entrenamiento ni test industrial. Las fotografías exploratorias referidas por el equipo deben inventariarse; no se atribuye una cantidad disponible. Sin nuevas visitas previstas, las semanas académicas usarán únicamente material autorizado disponible.

| Grupo de piezas | Total | Train | Val | Test | Fotos |
|---|---|---|---|---|---|
| Aceptadas | 300 | 210 | 45 | 45 | 1800 |
| Ondulaciones | 100 | 70 | 15 | 15 | 600 |
| Enconchaduras | 100 | 70 | 15 | 15 | 600 |
| Golpes/abolladuras | 100 | 70 | 15 | 15 | 600 |
| Total piezas | 600 | 420 | 90 | 90 | 3600 |
| Total fotos | 3600 | 2520 | 540 | 540 | 6/pieza |
Presupuesto inicial: tres familias geométricas hipotéticas, con 100 aceptadas/familia y 33/33/34 defectuosas por tipo; adaptar a las familias reales. Priorizar variación de lote, acabado, orientación, severidad y posición. No son cuotas estadísticas de producción: el 5 % general no permite deducir prevalencia por defecto. Registrar multietiqueta; si una pieza tiene dos defectos, contar su ID una sola vez y recalcular cuotas.

Seis capturas por pieza: dos perfiles laterales y cuatro superiores (difusa, rasante izquierda, rasante derecha y campo oscuro reflejado). Por eso 600 × 6 = 3600. No todas las fotos de una pieza defectuosa contienen señal visible. PatchCore se ajusta solo con 210 normales de train: 840 vistas superiores, distribuidas por luz/familia; las 210 piezas defectuosas de train se reservan para un eventual modelo supervisado.

Partición 70/15/15 por ID físico, antes de recortes o aumentación; bloquear lotes cuando sea posible. Máximo dos variantes suaves más original: 2520 × 3 = 7560 presentaciones, no nuevas muestras independientes. No deformar perfiles ni cambiar iluminación de forma que invente/oculte defectos; aumentación solo en train.

5.1 Protocolo y límites

Registrar ID, familia, lote, cara, vista, luz, exposición, fecha, etiqueta y permiso. Fondo mate, escala/patrón en el plano calibrado, foco y exposición fijos por receta. Conservar originales; etiquetar aceptable/sospechoso/no evaluable con revisión humana. Un exploratorio de 60 piezas (30 aceptadas y 10 de cada defecto) es un subconjunto propuesto, no material ya reunido. Con solo 15 defectuosas por clase en test, aun cero omisiones deja una cota unilateral 95 % de 18,1 %: 1 − 0,05^(1/15). No certifica bajo riesgo.

# 5.2 Capacidad y arquitectura de servicios

Caudal hipotético = producción diaria / (60 × horas efectivas). Ningún escenario confirma la jornada real. 24 h representa operación acumulada, posiblemente varios turnos.

| Piezas/día | 8 h | 10 h | 12 h | 24 h |
|---|---|---|---|---|
| 15 000 | 31,25 | 25,00 | 20,83 | 10,42 |
| 20 000 | 41,67 | 33,33 | 27,78 | 13,89 |
Valores en piezas/min. La meta exploratoria 45/min implica 1,33 s/pieza; no es requisito oficial. En el escenario 20 000/8 h requiere 92,6 % de disponibilidad; con 90 % se necesitarían 46,30/min. Confirmar turnos, flujo PC08, picos y paradas. Alimentación y revisión pueden ser el cuello de botella.

Figura 3. Flujo industrial propuesto. Sin anomalía detectada no equivale a certificación de calidad.
Captura pylon/USB3 y procesamiento edge evitan depender de Internet. Cola acotada conserva ID/receta; timeout o saturación deriva a revisión. SQLite y disco local sirven al piloto; almacenamiento de objetos y PostgreSQL solo si concurrencia/retención lo justifican. FastAPI entrega metadatos e imágenes a la UI; Cloudflare se limita al demo académico.

Ejemplo óptico, no tolerancia: FOV de 600 mm / 2448 px = 0,245 mm/px; un detalle de 1 mm ocupa 4,08 px. Con paso hipotético de 0,8 m y 45/min, v = 0,6 m/s y exposición ≤0,408 ms para desplazamiento de 1 px. Preferir indexado detenido al inicio. Seis imágenes RGB de 15,04 MB a 45/min producen ≈67,68 MB/s y 1,95 TB/8 h sin compresión: definir retención y medir bus, inferencia y ciclo completo.

# 6. Desarrollo del prototipo

Elegimos web para operarios y supervisión en una computadora de estación, con acceso de revisión desde móvil sin instalar otra aplicación. Dispositivos y uso en planta requieren aprobación. Se preservó el frontend del equipo; HTML/CSS/JavaScript y Chart.js local muestran PC08, PC10 y PC12, imagen entrante simulada por evento, veredicto, defecto y confianza ilustrativa.

Figura 4. Formulario actual sin credenciales. Captura del 14/11/2026.
Figura 5. Visor de un evento sintético. Zoom, desplazamiento y giro 2D; no reconstrucción 3D.
Argon2id protege contraseñas; sesiones de 8 h se almacenan como hash. Cuatro roles aplican permisos y ámbito en backend: operativos consultan propios; supervisor, PC08; administrador gestiona cuentas. Cookie HttpOnly/SameSite, 401 sin sesión y 403 sin permiso. Historial filtra estación, fecha y defecto y exporta CSV; los 38 eventos históricos permanecen intactos. Las ilustraciones no representan piezas reales ni detecciones de IA.

# 6.1 API, Docker y pruebas actuales

Dos servicios FastAPI/Uvicorn separados: API mock con solo /health y /info; UI con sus rutas /ui/* y proxy que reenvía Authorization sin añadir secretos. /health público devuelve {"status":"ok"}; /info exige Bearer. Docker usa usuario no root, volumen historial y API healthy. Cloudflare Quick Tunnel publica temporalmente la UI y el proxy; no garantiza continuidad [10].

Figura 6. Visualización de respuestas HTTPS reales del 14/11/2026. Token y host omitidos; no es captura de terminal.
| 7. Prueba actual del 14/11 | Resultado verificado |
|---|---|
| Python local / imagen Docker | 9 / 9 aprobadas; advertencia de deprecación AnyIO. |
| Node y navegador | 2 pruebas de imágenes; cuatro roles, gráficos, filtros, CSV, móvil emulado, sesión y visor PASS; sin errores JS observados. |
| Persistencia Docker | 38 eventos, IDs/campos conservados; sesión 200 después de reiniciar UI. |
| Filtro histórico | PC08 + 09/11/2026 + Golpes: SIM-0032, 0027, 0026 y 0002. |
| HTTPS y seguridad de acceso | 200 health; 401 info anónimo/incorrecto; 200 Bearer válido. No se repitió teléfono físico. |
Las suites usan bases aisladas; el ensayo de persistencia no genera inspecciones operativas. Se preservaron fea1f90 (frontend) y fb308f1 (anexo backend). No se cambiaron claves ni permisos reales. Se audita publicación para excluir .env, bases y credenciales. No se afirma seguridad industrial certificada.

7.1 Reproducción

docker compose up -d --build
docker compose ps
python verificar.py http://localhost:8080
docker compose --profile publico up -d tunnel
python verificar.py https://HOST-ACTUAL.trycloudflare.com

Obtener HOST-ACTUAL del log del túnel; verificar.py lee API_TOKEN sin imprimirlo. El acceso desde teléfono y la continuidad durante evaluación deben comprobarse en ese momento. Evidencias completas e instrucciones en el repositorio privado.

# 8. Conclusiones y siguientes pasos

El checkpoint demuestra software autenticado, imágenes sintéticas por evento, historial, API y despliegue verificados. La inspección industrial sigue siendo una propuesta para tres defectos. La geometría requiere referencia rígida; la superficie requiere luz controlada. No se validó ningún modelo sobre machetes reales ni se sustituyó el ensayo mecánico.

La decisión es revisar piezas sospechosas, derivarlas al proceso correctivo que IMACASA determine y comprobarlas nuevamente cuando corresponda. No se afirma retorno universal a Forjamiento ni que enderezar corrija abolladuras. Falta confirmar criterios visuales, horas/turnos, flujo PC08, dimensiones y ejemplos autorizados.

9. Cronograma académico de tres semanas

| Periodo de 2026 | Actividades y condición |
|---|---|
| 9–15 noviembre | Visita reportada, levantamiento, investigación, demo, pruebas actuales e informe CP01. Fotos de defectos pendientes de inventario; no se afirma dataset listo. |
| 16–22 noviembre | Futuro: organizar y etiquetar fotos disponibles; ensayo PatchCore y perfiles OpenCV solo si las vistas permiten evaluarlos. Sin nuevas visitas. |
| 23–29 noviembre | Futuro: evaluar, ajustar e integrar experimentalmente; fine-tuning solo con etiquetas suficientes. Si faltan fotos adecuadas, documentar imposibilidad, no fabricar métricas. |
9.1 Propuesta industrial de seis meses

| Mes | Hito propuesto y decisión |
|---|---|
| 1 | Criterios, autorización, flujo y riesgos; acordar aceptación y manejo seguro. |
| 2 | Captura controlada y dataset piloto; validar luz, referencia y repetibilidad. |
| 3 | Comparar modelos; medir falsos negativos y memoria por familia. |
| 4 | Integrar cámaras, banda indexada, servicios y trazabilidad por pieza. |
| 5 | Piloto supervisado: carga, paradas, captura inválida y derivación segura. |
| 6 | Validación, optimización, capacitación y decisión de escalamiento. |
El plan industrial requiere autorización y recursos posteriores, no implica nuevas visitas del equipo académico. Para entregar: confirmar número oficial, acceso GitHub del docente y credencial temporal exclusiva; comprobar túnel vigente. La matriz externa traza los 100 puntos sin autocalificar ni garantizar los 15 de la prueba en vivo.

# Referencias
[1] KEY Institute, “CheckPoint infra Reto IMACASA”, Ingeniería de la IA, 5 nov. 2026. PDF oficial del curso consultado localmente. https://keyinstitute.instructure.com/courses/310/files/51600
[2] K. Roth et al., “Towards Total Recall in Industrial Anomaly Detection”, CVPR, 2022. Tabla 5 y apéndice de implementación. https://arxiv.org/abs/2106.08265
[3] T. Defard, A. Setkov, A. Loesch y R. Audigier, “PaDiM: a Patch Distribution Modeling Framework for Anomaly Detection and Localization”, arXiv:2011.08785, 2020. Tabla VII. https://arxiv.org/abs/2011.08785
[4] Ultralytics, “Ultralytics YOLO11”, documentación oficial, tabla Detection COCO. https://docs.ultralytics.com/models/yolo11/
[5] PyTorch, “wide_resnet50_2”, documentación oficial de torchvision, parámetros y pesos ImageNet. https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.wide_resnet50_2.html
[6] PyTorch, “resnet18”, documentación oficial de torchvision, parámetros y pesos ImageNet. https://docs.pytorch.org/vision/stable/models/generated/torchvision.models.resnet18.html
[7] Basler, “acA2440-35uc”, documentación oficial de especificaciones de cámara. https://docs.baslerweb.com/aca2440-35uc
[8] OpenCV, “Camera Calibration”, documentación oficial. https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html
[9] Edmund Optics, “Common Illumination Types”, nota técnica del fabricante. https://www.edmundoptics.com/knowledge-center/application-notes/illumination/choose-the-correct-illumination/
[10] Cloudflare, “Quick Tunnels”, documentación oficial; túneles temporales de prueba. https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/
[11] KEYENCE, “Machine Vision Lighting Selection Guide”, documentación técnica. https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp
[12] M. Aghaei et al., “Complex-Object Visual Inspection via Multiple Lighting Configurations”, arXiv:2004.09374, 2020. https://arxiv.org/abs/2004.09374