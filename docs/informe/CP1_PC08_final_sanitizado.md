# Inspección visual asistida antes de Enderezado PC08

KEY Institute
Ingeniería de la Inteligencia Artificial
Checkpoint 01 · IMACASA · Pimientero G2

Diego Roberto Carpio Flamenco
Julio Roberto Guardado Quijano
Iván Daniel Salguero Esperanza
Alfredo Enmanuel Cortez Martínez

Número oficial de equipo pendiente de confirmación
Estación asignada PC08 · Enderezado
Exposición 12 de noviembre de 2026 · 6:50 a. m. · El Salvador
Actualización académica 11 de noviembre de 2026

## Resumen ejecutivo

Proponemos inspeccionar piezas entre Pulido y Enderezado mediante captura controlada de ambas caras y perfiles. Priorizamos golpes de mordaza, enconchados y ondulados, conservando el análisis de las ocho categorías del checkpoint. El enfoque combina PatchCore para anomalías de superficie con geometría de contornos y revisión humana. La banda, las cámaras y la inferencia son una propuesta de implementación; el software actual demuestra autenticación, imágenes sintéticas por evento, historial y API.

La visita aporta cifras operativas y descripciones verbales, no una validación experimental del sistema. La meta de 45 piezas/minuto exige estudiar alimentación, manipulación y derivación; no se deduce de la latencia de un modelo. La inspección propuesta complementa los controles mecánicos y de dureza.

## Evaluación del demo

Versión sanitizada para el repositorio privado. URL temporal de evaluación: [COMPLETAR Y VERIFICAR ANTES DE CLASE]. Credencial Bearer de /info: [SOLO EN COPIA PRIVADA DEL DOCENTE]. La contraseña de la interfaz no sustituye al token. Quick Tunnel debe permanecer activo durante la exposición. [1, 10]

# 1 Contexto industrial y capacidad

El levantamiento reúne observaciones del equipo y explicaciones del personal comunicadas en las notas de visita. No se dispone de acta firmada, fecha exacta documentada ni estudio de tiempos. Se informó una producción habitual de 15 000 machetes/día, cerca de 5 % de incidencias (750 piezas) y hasta 20 000/día en temporada alta, con jornadas de 8–10 horas. No está confirmado que todo ese flujo pase por un único PC08 ni que las incidencias correspondan a los tres defectos prioritarios.

Figura 1. Flujo actual observado y descrito en las notas del equipo. No se observó banda entre Pulido y Enderezado.

Se comunicaron aproximadamente 6–8 puestos de Enderezado. La acumulación y el reparto manual sugieren estudiar esperas y carga desigual; su magnitud no está medida. Se propone trazabilidad de piezas y apoyo a calidad, sin atribuir fallas ni evaluar productividad individual de los operarios.

| Escenario | Piezas/h | Piezas/min | s/pieza |
|---|---|---|---|
| 15 000 en 8 h | 1 875 | 31,25 | 1,92 |
| 15 000 en 10 h | 1 500 | 25,00 | 2,40 |
| 20 000 en 8 h | 2 500 | 41,67 | 1,44 |
| 20 000 en 10 h | 2 000 | 33,33 | 1,80 |
| Objetivo preliminar | 2 700 | 45,00 | 1,33 |

Cálculos: piezas/h = producción/horas efectivas; piezas/min = producción/(60 × horas); s/pieza = 3 600 × horas/producción. A 45/min se obtienen 21 600 piezas en 8 h y 27 000 en 10 h. El margen sobre 20 000 en 8 h es 8 %; la disponibilidad mínima sería 92,6 %. Con 90 % de disponibilidad se requerirían 46,30/min. Por ello, 45/min es una meta por contrastar, no una capacidad garantizada. El 5 % aplicado a 20 000 daría 1 000 incidencias solo bajo prevalencia constante, supuesto no verificado.

## Objetivo y método

Diseñar una propuesta de inspección visual asistida por IA previa a PC08 y demostrar su soporte informático académico. Los objetivos específicos son caracterizar los ocho defectos, justificar datos y captura, comparar modelos, diseñar servicios y soporte, verificar web y API, y evaluar viabilidad mediante un piloto de seis meses. La metodología integra visita cualitativa, revisión de fuentes primarias y pruebas de software; no incluye entrenamiento industrial.

# 2 Viabilidad de los defectos prioritarios

Las categorías proceden de la rúbrica [1]; las tres descripciones siguientes son interpretaciones locales comunicadas verbalmente. No constituyen definiciones universales ni tolerancias aprobadas. Una vista insuficiente produce resultado indeterminado, nunca una aprobación por defecto. Las cantidades son cuotas de adquisición futura, desarrolladas en la página 5.

| Categoría y evidencia | Captura y tarea | Límites y comprobación |
|---|---|---|
| Golpes; 100 piezas; 800 fotos base. Mordaza es un subtipo comunicado de Golpes. | Captura especial: ambas caras, difusa y rasante opuesta; acercamiento si falta detalle. PatchCore localiza anomalía; segmentación o cajas supervisadas después de etiquetar. | Sin profundidad ni tamaño mínimo informado. Confusión con huellas, rayas y reflejos. Inspector; perfilómetro o comparador si se exige cuantificar relieve. |
| Enconchados; 100 piezas; 800 fotos base. Doblez hacia un solo lado, según la visita. | Captura especial: perfil longitudinal completo, apoyo repetible, contraluz y referencia recta. Segmentar silueta; OpenCV extrae desviación respecto a referencia acordada. | Una foto superior no basta. Confusión con perspectiva, inclinación del útil y curvatura de diseño. Confirmar con mesa de referencia y comparador; no hay umbral visual documentado. |
| Ondulado del lomo; 100 piezas; 800 fotos base. Doblez hacia ambos lados, según la visita. | Captura especial: perfiles complementarios con contraluz. Analizar alternancia de desviación a lo largo de la hoja; segmentación y clasificación futura de perfiles. | Confirmar correspondencia exacta entre “ondulado” verbal y categoría académica. Confusión con torsión y geometría propia. Regla/mesa y comparador; vista adicional si hay oclusión. |

Para cada categoría se comparte un banco negativo de 400 piezas aceptadas (3 200 fotos base); no se multiplica por clase. Las fotos de una pieza defectuosa solo son positivas donde el defecto resulta visible. Casos ambiguos, múltiples defectos y marcas de fabricación aceptables deben recibir etiquetas específicas y resolución por calidad.

## Controles que permanecen instrumentales

El personal describió una medición inicial de altura de punta respecto a mesa, doblado en máquina durante aproximadamente un minuto, retirada de fuerza y nueva medición con pie de rey. Se comunicó un criterio interno cercano a 2 mm, cuya aplicación exacta debe confirmarse. No se atribuye a una norma internacional ni se usa como umbral del algoritmo visual. La definición de la magnitud residual, apoyos, carga, frecuencia de ensayo y regla de aceptación siguen pendientes.

También se indicó uso de durómetro para dureza alta o baja; una cámara convencional no la verifica. Algunas correcciones emplean placa metálica y mazo en un área de corrección manual/reproceso, denominación pendiente de validación. No se supone que todos los defectos tengan ese tratamiento.

# 3 Categorías adicionales y decisión humana

Estas cinco categorías siguen siendo obligatorias. La visita no aportó definición operacional suficiente para cerrarlas; las descripciones siguientes son hipótesis de inspección que deben contrastarse con ejemplos aceptados y rechazados. La dureza es un control complementario, no una novena clase de la rúbrica.

| Defecto y cuota futura | Viabilidad y tarea propuesta | Ambigüedad e instrumento |
|---|---|---|
| Huellas; 40 piezas; 320 fotos. Marca superficial por caracterizar. | 2D controlada si solo cambia apariencia; especial rasante si hay relieve. Ambas caras. Anomalía; clasificación tras confirmar significado local. | Puede confundirse con golpes o residuos. No asumir huella digital. Inspector y perfilometría si importa relieve. |
| Poros; 40 piezas; 320 fotos + 160 macro. Cavidad superficial hipotética. | Especial: macro, escala coplanar y rasante. Localizar/segmentar poros abiertos visibles. No detectar poros internos con RGB. | Confusión con polvo, sombras y picaduras. Microscopía/perfilometría para confirmación; ensayo interno definido por calidad si corresponde. |
| Torcido; 40 piezas; 320 fotos. Torsión por confirmar. | Especial multivista: perfiles de ambos bordes y secciones. Segmentar contornos; estimación geométrica. Dos proyecciones no garantizan reconstrucción 3D. | Confusión con ondulado, apoyo inclinado y perspectiva. Útil de referencia y comparador; 3D si el requisito lo exige. |
| Mal pulido; 40 piezas; 320 fotos. Apariencia desigual por confirmar. | 2D difusa más rasante, ambas caras y balance fijo. Anomalía de textura; segmentación de rayas visibles. | Confusión con reflejos o acabado intencional. Rugosímetro si se especifica rugosidad; brillo no equivale a Ra. |
| Hoja ampollada o quemada; 40 piezas; 320 fotos. Separar subtipos al validar. | 2D difusa para color y especial rasante para ampollas. Anomalía de color/relieve visible; ambas caras. | Color no demuestra daño metalúrgico. Perfilometría para relieve; dureza o examen metalúrgico según calidad. Confusión con óxido/iluminación. |

Cada fila comparte las 400 piezas conformes de referencia, incluyendo 20 con macro (80 fotos adicionales). Las cuotas de 40 son exploratorias: 4 lotes × 2 condiciones visuales × 5 piezas, si existen esas combinaciones. No prueban cobertura suficiente de defectos raros ni sustituyen confirmación industrial.

## Etiquetado y tratamiento de incertidumbre

Dos anotadores registrarán de forma independiente pieza, vista, región visible y clase; calidad resolverá desacuerdos. Separar etiqueta visual, resultado mecánico y decisión humana. Una anomalía significa desviación respecto al banco de referencia, no automáticamente rechazo. Conservar categorías simultáneas, casos indeterminados y motivo de revisión. El piloto debe medir desacuerdo entre inspectores antes de fijar etiquetas de entrenamiento.

# 4 Presupuesto y partición del dataset

Se sustituye el supuesto previo de 820 piezas/7 280 fotos por un piloto de hasta 900 piezas únicas y 7 440 fotos originales. Se refuerzan los tres defectos prioritarios: 100 piezas/clase = 5 lotes × 2 condiciones × 10; normales: 400 = 5 lotes × 4 familias × 20. Son cuotas propuestas, ajustables si esas familias o lotes no existen; registrar también jornada, severidad y acabado. No se dispone de un dataset industrial validado.

| Grupo | Piezas | Fotos base | Train/val/test por pieza |
|---|---|---|---|
| Aceptadas | 400 | 3 200 | 280 / 60 / 60 |
| Golpes de mordaza | 100 | 800 | 70 / 15 / 15 |
| Enconchados | 100 | 800 | 70 / 15 / 15 |
| Ondulados | 100 | 800 | 70 / 15 / 15 |
| Huellas | 40 | 320 | 28 / 6 / 6 |
| Poros | 40 | 320 | 28 / 6 / 6 |
| Torcido | 40 | 320 | 28 / 6 / 6 |
| Mal pulido | 40 | 320 | 28 / 6 / 6 |
| Ampollada/quemada | 40 | 320 | 28 / 6 / 6 |
| Total | 900 | 7 200 | 630 / 135 / 135 |

Se capturan ocho vistas por pieza. Añadir cuatro macros para las 40 piezas con poros y 20 aceptadas ya incluidas: 60 × 4 = 240; total 7 440. Distribuir esas 60 piezas 42/9/9 (14/3/3 normales y 28/6/6 poros). Resultado por fotografía: 5 208/1 116/1 116, equivalente a 70/15/15. Fotos de piezas aceptadas: 3 280; de piezas defectuosas: 4 160, sin asumir que todas muestran el defecto.

Asignar por ID físico antes de recortar o aumentar. Todas las caras, macros y derivados permanecen en la misma partición; reservar lotes/sesiones completos para test cuando sea posible y documentar ajustes de cuotas. Las clases se suponen disjuntas solo para presupuestar: con defectos múltiples, deduplicar ID y recalcular antes de capturar.

PatchCore/PaDiM ajustan solo los 280 normales de train (2 296 fotos con macros). Las 350 piezas defectuosas de train quedan reservadas al experimento supervisado YOLO, nunca al banco normal. Los tres candidatos comparten val/test. Primero explorar 90 piezas incluidas en las 900: 30 normales, 10 por prioridad y 6 por categoría restante; revisar visibilidad antes de ampliar.

Aumentación solo en train: hasta dos variantes moderadas por imagen (máximo 15 624 presentaciones, no nuevas piezas). Evitar deformación geométrica, cambios de tono para quemado o desenfoque que borre poros. Las cuotas enriquecidas no estiman prevalencia. Si la incidencia general fuera 5 %, reunir 500 piezas con cualquier problema requeriría en promedio 10 000 piezas, sin garantizar ninguna cuota por clase; usar selección dirigida y una muestra consecutiva separada.

Con 15 positivos de una prioridad en test, cero omisiones aún permite una cota unilateral exacta del 95 % de 1 − 0,05^(1/15) = 18,1 %; con 6, 39,3 %. Para cota menor a 5 % y cero omisiones se necesitan 59 independientes por clase. Ampliar según riesgo acordado; esto no es un resultado del modelo.

# 5 Captura óptica y soporte

| Vista por pieza | Cantidad | Condición y finalidad |
|---|---|---|
| Superior A/B | 2 | Una por cara, cámara perpendicular, luz difusa; textura y color. |
| Rasante A/B | 4 | Dos direcciones opuestas por cara; pieza inmóvil, reflejos controlados. |
| Perfiles complementarios | 2 | Perfil longitudinal y orientación complementaria; contraluz y referencia recta. Verificar cobertura de ambos bordes. |
| Macro adicional | 4 en 60 piezas | Dos regiones por cara acordadas; no certifican toda la superficie. |

Fondo mate, útil repetible sin forzar la hoja y filo protegido. Fijar distancia, foco y ángulos tras determinar campo de visión y detalle mínimo; no inventar focal ni distancias. Registrar escala coplanar, patrón de calibración y color; corregir distorsión [8]. Mantener exposición/balance constantes. Ensayar rasante y polarización sin eliminar señal útil [9]. Rechazar saturación, desenfoque, oclusión o contorno incompleto. Guardar originales sin filtros y transformaciones reproducibles.

Proponemos inicialmente dos Basler acA2440-35uc de área: superior y lateral, reorientando la pieza manualmente en un útil seguro para segunda cara/perfil. Es un banco piloto detenido, no una demostración de 45/min. El fabricante especifica 5 MP, 2448 × 2048 por defecto (2464 × 2056 completa), obturador global, 35 fps, color, USB 3.0 y disparo hardware [7]. Se conserva este modelo por captura sincronizable y disponibilidad de color; rendimiento y óptica deben validarse. Una banda necesitaría transferencia/volteo seguro o cámaras adicionales: una cámara inferior no ve a través de una banda opaca.

Figura 2. Soporte conceptual del banco detenido. Componentes futuros, sin dimensiones de fabricación.

Ejemplo óptico, no dimensión de IMACASA: para campo longitudinal de 600 mm sobre 2448 píxeles, escala = 0,245 mm/píxel; un rasgo de 1 mm ocuparía 4,08 píxeles, insuficiente para asegurar detección. Reducir campo o usar mosaicos si el piloto lo exige. A paso hipotético de 0,8 m y 45/min, la banda iría a 0,6 m/s; para desenfoque menor a un píxel, exposición ≤0,408 ms. Luz estroboscópica, lente C y disparo deben resolver esa condición. Global shutter evita sesgo temporal entre filas, no elimina desenfoque.

Nombre: PC08_<pieza>_<cara>_<vista>_<luz>_<toma>. Guardar lote, fecha, cámara/lente, exposición, escala, inspector, permiso y múltiples etiquetas. Las fotos antiguas de una presentación de empresa no son un dataset de defectos; no se incorporan por falta de autorización de distribución. Los ejemplos de la nueva visita aún no se localizaron en el proyecto.

# 6 Modelos preentrenados y enfoque híbrido

Los candidatos reutilizan representaciones visuales preentrenadas; ninguno reconoce las clases IMACASA sin adaptación. Las latencias bibliográficas son referencias con protocolos distintos, no una clasificación de velocidad en la Lenovo o la Victus.

| Candidato y salida | Tamaño de referencia | Latencia publicada y límites |
|---|---|---|
| PatchCore + WideResNet50-2 ImageNet. Puntuación y mapa de anomalía; normales para ajuste. [2,5] | 68,88 M parámetros de red completa; presupuesto FP32 275,5 MB. Extractor parcial + banco adicional. | 0,22 s/imagen, coreset 10 %, MVTec AD, entrada 224; GPU cuando posible, incluye backbone. Tabla 5. No se atribuye una GPU concreta no identificada. |
| PaDiM + ResNet18 ImageNet. Distancia a distribución normal por posición y mapa. [3,6] | 11,69 M parámetros completos; FP32 46,8 MB. Medias/covarianzas adicionales, dimensión 100. | 0,23 s/imagen; R18-Rd100, MVTec AD, CPU i7-4710HQ 2,50 GHz; tabla VII. Requiere encuadre consistente. |
| YOLO11n COCO. Cajas, clases y puntuaciones supervisadas. [4] | 2,6 M parámetros, 6,5 GFLOPs a 640; FP32 ≈10,4 MB, sin activaciones. | 56,1 ± 0,8 ms CPU ONNX; 1,5 ms T4 TensorRT10, 640, referencia oficial. COCO no incluye estos defectos; exige cajas y ajuste. |

## Decisión técnica

PatchCore es el modelo principal del piloto para golpes de mordaza y anomalías superficiales: aprende normalidad con piezas aceptadas y señala una región para revisión. No nombra automáticamente el defecto ni demuestra su profundidad. Separar bancos por vista, luz y familia; comenzar con coreset 10 % y contrastar 1 %. PaDiM es el comparador estadístico; YOLO11n se reserva para localización con etiquetas suficientes, especialmente golpes. Ondulado y enconchado requieren perfil geométrico, no una caja sobre una foto superior.

El complemento OpenCV calibra y segmenta siluetas. Proponemos comparar desviaciones y alternancia respecto a una referencia acordada por calidad; orientación, curvatura de diseño y apoyo pueden producir falsos patrones. Una revisión humana resuelve ambigüedad. No se usa el criterio verbal de 2 mm de la prueba mecánica como umbral de esta geometría.

Memoria de diseño: banco PatchCore de 100 000 × 1 536 valores FP32 = 614,4 MB antes de índice y activaciones. PaDiM con 56 × 56 posiciones y 100 dimensiones requiere ≈126,7 MB para medias y covarianzas densas; almacenar inversas añade memoria. Son ejemplos calculados, no consumos medidos. La Victus reportada (Ryzen 7, 16 GB, RTX 4050) es un candidato de experimentación; verificar VRAM y controladores antes de comprometer capacidad.

PyTorch/torchvision y OpenCV reutilizan el trabajo del curso; no se requiere una plataforma nueva ni modelos de texto como RoBERTa/DeBERTa. Evaluar sensibilidad por pieza/clase, falsas alarmas, localización y latencia p50/p95, con batch 1, calentamiento, ≥100 ciclos y memoria máxima. Bloquear umbrales con val antes de test. Reducir una hoja a 224 puede borrar microdefectos: comparar recortes preservando ID. Ocho inferencias de 0,22 s sumarían 1,76 s aun antes de manipular; la meta de 1,33 s/pieza exige validación y posible paralelismo.

# 7 Arquitectura industrial propuesta

Figura 3. Flujo conceptual previo a PC08. Gris: procesos existentes según visita. Azul: componentes futuros. No hay banda ni inferencia industrial implementadas.

El primer piloto usa mesa/bandeja y alimentación manual asistida: menor costo conceptual y mayor control de separación, pero depende del operario y exige útil que proteja el filo. Una banda indexada con alojamientos añade costo y sincronización, aunque mejora posición. Un alimentador automático desde montones tiene mayor complejidad por enganche, solapamiento y riesgo; no se recomienda como punto de partida sin ingeniería mecánica.

Un sensor de presencia y disparo coordinan cámaras e iluminación. Si faltan vistas, se llena la cola o falla captura/inferencia, la pieza queda pendiente de revisión, sin liberación automática. En el piloto la derivación es manual y registrada; un desviador futuro requerirá encoder, confirmación de paso, resguardos y evaluación de seguridad. No se dimensiona una banda ni un mecanismo de rechazo con estos datos.

| Servicio futuro | Elección y fundamento |
|---|---|
| Captura y envío | SDK pylon/USB3 a equipo local; ID físico y secuencia, cola acotada. Evita depender de Internet para decidir. |
| Inferencia y decisión | Procesos PyTorch y OpenCV por vista; agregación por pieza, estado indeterminado y revisión humana. No conectados al demo. |
| Datos e imágenes | SQLite y disco local en piloto de una estación; ID, metadatos y hash. Migrar a PostgreSQL/almacén de objetos si concurrencia/retención lo justifican. |
| UI y acceso | FastAPI, navegador de planta y RBAC; red local para operación. Cloudflare Quick Tunnel únicamente para evaluación académica. |

A ocho vistas y 45 piezas/min se generarían 6 imágenes/s. En RGB sin compresión, 2448 × 2048 × 3 bytes ≈15 MB/imagen: 90 MB/s y 2,59 TB/8 h. Dimensionar controladores USB, compresión sin pérdida, almacenamiento y retención; conservar defectos y muestra de normales según política acordada. No confundir 35 fps de cámara con capacidad de línea.

Distribución futura: registrar estado disponible/cola de cada uno de los 6–8 puestos y sugerir el de menor cola entre los aptos; el operario confirma destino. Un acumulador y límites de cola absorberían lotes irregulares. Sin tiempos por familia ni espacio medido, no se promete equilibrio. La cámara inspecciona; la logística y el transporte ejecutan el reparto.

# 8 Plataforma web y evidencia funcional

Se elige web para que supervisión consulte en PC o tableta mediante navegador y los operarios revisen eventos en un terminal compartido de planta; son usos propuestos, no dispositivos aprobados por IMACASA. La Lenovo aloja el demo y un teléfono permite verificar acceso externo. Frente a una app nativa, evita instalaciones por dispositivo; el visor ofrece más espacio en PC y diseño adaptable móvil. Se preservan PC08 principal y PC10/PC12 secundarios.

Figura 4. Captura autorizada del demo: imagen sintética entrante, estación, veredicto y confianza simulada. El visor permite acercar, desplazar y girar en 2D.

Figura 5. Detalle del historial sintético filtrado por PC08, 09/11/2026 y Golpes: SIM-0032, SIM-0027, SIM-0026 y SIM-0002. Captura completa en evidencias.

La autenticación utiliza Argon2id y sesiones; los permisos se aplican también en API/exportación. Herrero y pulidor consultan su ámbito, supervisor revisa PC08 global y administrador gestiona cuentas/roles. Es una propuesta académica, no un organigrama aprobado. Los gráficos agregan eventos sintéticos y no miden productividad real. Se conserva la corrección del aviso obsoleto de sesión.

La imagen cambia por evento; los valores de confianza no son probabilidades calibradas. La sección Sistema distingue el contexto comunicado, el objetivo futuro y la simulación. No se añadieron registros de producción a SQLite. Capturas completas de roles, móvil y visor están en docs/evidencias; la demostración en vivo permite revisar login, filtros combinados y exportación.

# 9 Despliegue evaluación y plan de seis meses

La API mock FastAPI/Uvicorn conserva exactamente dos rutas: GET /health abierto devuelve 200 y {"status":"ok"}; GET /info exige Bearer, devuelve 401 sin credenciales y 200 con equipo, estación, versión y timestamp al autenticarse. El backend de UI es un servicio separado con /ui/*; su sesión no sustituye al token. Docker Compose mantiene API, UI y volumen historial; Quick Tunnel expone HTTPS temporal [10].

Figura 6. Respuestas de comprobación del demo, sin mostrar el token. La fecha y el alcance figuran en el registro de evidencia.

Inicio desde la carpeta del proyecto: docker compose up -d --build; docker compose ps; python verificar.py http://localhost:8080. Para acceso externo: docker compose --profile publico up -d tunnel; docker compose logs --tail 30 tunnel; python verificar.py <URL-actual>. Revalidar 200/401/200 y acceso desde otro dispositivo antes de clase. No eliminar el volumen ni publicar .env. Completar URL/token solo en la copia privada del docente.

Verificación del 11/11/2026: 9 pruebas Python locales y 9 en Docker, 2 de imágenes y recorridos de cuatro roles aprobados. Se verificaron filtros, exportación, gráficos, visor, 401/403 y regresión de sesión. Docker conservó 38 eventos y el filtro histórico; HTTPS respondió 200/401/200. Son pruebas de software, no métricas de IA. La Victus y la disponibilidad en clase no se dan por verificadas.

| Mes | Actividad y condición para avanzar |
|---|---|
| 1 | Validar vocabulario, criterio mecánico, permisos, flujo efectivo y riesgo; calidad aprueba guía de etiquetas. |
| 2 | Banco detenido y dataset exploratorio; verificar visibilidad, escala, desacuerdo y seguridad de manipulación. |
| 3 | Completar cuotas viables y comparar PatchCore, PaDiM, YOLO y geometría; congelar particiones y evaluar error. |
| 4 | Integrar captura/servicios y probar alimentación asistida. Diseñar banda solo si el estudio de tiempos la justifica. |
| 5 | Piloto supervisado; medir omisiones, falsas alarmas, colas, ciclo p95, memoria y fallos seguros. |
| 6 | Validar con calidad y operación; decidir ampliación, rediseño o detención. No prometer despliegue productivo completo. |

Conclusión: la visita sitúa la necesidad en el flujo manual previo a PC08 y distingue tres prioridades visuales. La captura multivista y el enfoque híbrido son más defendibles que una única cámara superior. El demo acredita integración informática, no exactitud industrial. Antes de usar piezas reales se requieren ejemplos autorizados, criterios de calidad, óptica, seguridad y capacidad medidas. La prueba mecánica y el durómetro permanecen independientes.

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