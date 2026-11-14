# Alcance vigente del 14 de noviembre de 2026

Esta corrección del equipo tiene prioridad sobre las hipótesis del 11/11. Informe vigente: [DOCX](informe/CP1_PC08_definitivo_20261114_sanitizado.docx) y [PDF](informe/CP1_PC08_definitivo_20261114_sanitizado.pdf).

## Piloto visual

Únicamente ondulaciones alternantes, enconchaduras unilaterales y golpes/abolladuras visibles. OpenCV y perfiles calibrados para los dos primeros; PatchCore superficial como modelo principal, PaDiM comparador y YOLO11n solo tras ajuste con etiquetas. Ninguno validado en machetes industriales. Los ocho valores del catálogo de demostración se conservan por la actividad académica, no son una promesa de implementar ocho detectores.

El ensayo mecánico de deformación residual queda excluido; sus 2 mm verbales nunca se reutilizan como umbral visual. Tampoco se reemplaza durómetro.

## Producción

15 000 y hasta 20 000 piezas/día son cifras verbales. Las horas efectivas y turnos son desconocidos. Los escenarios de 8, 10, 12 y 24 h son hipotéticos; 24 h puede sumar varios turnos. 45/min es una meta exploratoria del equipo, no requisito oficial. Confirmar caudal PC08, lotes, disponibilidad y paradas por comunicación con la empresa; no se programan más visitas académicas.

## Captura principal

Banda transportadora indexada entre Pulido y Enderezado, alimentación individual, orientación y separación, portapiezas elevado sin aplanar hoja, dos cámaras laterales y una superior. Basler acA2440-35uc de área, global shutter, 5 MP, USB3, 35 fps; óptica y campo según dimensiones reales. Datum rígido independiente de la banda. Calibrar distorsión, pose y geometría nominal por familia. Validar apoyo, vibración, oclusión y repetibilidad antes de fijar umbrales.

Perfiles con contraluz cuando exista paso óptico; fondos/capturas secuenciales. Superficie superior con difusa, rasantes opuestas y campo oscuro reflejado. Contraluz no revela por sí sola abolladuras en cara superior opaca. No hay cara inferior sin volteo, ni estéreo/3D garantizado por tener dos laterales.

Sospechosa o captura inválida → revisión humana → proceso correctivo correspondiente → nueva comprobación cuando aplique. Destino exacto pendiente; no se afirma retorno universal a Forjamiento.

## Dataset

Presupuesto futuro: 600 piezas distintas, 300 normales y 100 por defecto visual, seis vistas por pieza = 3600 imágenes. Piezas train/val/test 420/90/90; imágenes 2520/540/540. No existe ese dataset adquirido. Normales de entrenamiento PatchCore: 210 piezas × 4 vistas superiores = 840, separadas por luz/familia. Máximo 7560 presentaciones aumentadas en train, sin incrementar muestras físicas. Cinco categorías fuera del piloto conservan estimaciones académicas separadas de 40 piezas × 4 vistas; no se suman al presupuesto del piloto. El presupuesto previo 900/7440 es histórico.

## Diagramas vigentes

- [Flujo actual](diagramas/flujo-actual-20261114.svg)
- [Banda y servicios](diagramas/arquitectura-banda-20261114.svg)
- [Soporte y referencia](diagramas/soporte-banda-20261114.svg)

Todos los SVG anteriores se conservan como historia, sin vigencia como arquitectura definitiva. El banco fijo puede apoyar ensayos ópticos preliminares, pero no sustituye la banda propuesta.
