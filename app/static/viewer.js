'use strict';
(()=>{
 const el=id=>document.getElementById(id),svg=el('inspectionSvg'),object=el('inspectionObject'),marker=el('defectMarker');
 const guides={
 'Golpes': [449,161,94,65,'Superficie de la hoja','Explorar la irregularidad superficial. La profundidad y el límite de rechazo requieren validación instrumental o captura apropiada.'],
 'Huellas': [340,163,110,55,'Marca superficial por definir','El significado industrial de «huellas» está pendiente. Esta zona es únicamente un ejemplo de navegación.'],
 'Poros': [520,162,70,48,'Detalle superficial','Revisar pequeños puntos o discontinuidades. Hace falta definir el tamaño mínimo de interés y la resolución de captura.'],
 'Ondulado del lomo': [440,125,230,35,'Lomo de la hoja','Comparar el contorno con una referencia geométrica. La vista y la tolerancia necesarias están pendientes.'],
 'Enconchados': [380,160,130,65,'Zona ilustrativa por definir','No se ha confirmado la definición de enconchado en IMACASA. No interpretar este dibujo como un ejemplo validado del defecto.'],
 'Torcido': [430,158,390,100,'Geometría de la hoja','Una vista superior no permite comprobar toda la deformación fuera del plano. Se debe justificar una captura especial o un instrumento.'],
 'Mal pulido': [475,158,160,65,'Acabado de superficie','Comparar textura y reflejos con iluminación controlada. La apariencia visual no equivale a medir rugosidad.'],
 'Hoja ampollada/quemada': [570,157,100,65,'Superficie y apariencia','Separar señales visibles de ampollado o coloración de las propiedades del material. La imagen no certifica el tratamiento térmico.'],
 'Largo fuera de tolerancia':[420,157,520,105,'Longitud de hoja','Se requiere escala calibrada, perspectiva controlada y tolerancia especificada. El esquema no permite medir milímetros.'],
 'Ancho fuera de tolerancia':[600,157,80,100,'Ancho de hoja','Definir dónde medir, calibración y tolerancia. No medir sobre este esquema.'],
 'Espesor fuera de medida':[440,157,190,70,'Espesor no observable aquí','Una vista superior no mide el espesor. Se necesita una captura de perfil adecuada o un instrumento.'],
 'Mal acabado':[450,160,170,70,'Acabado','Señal ilustrativa; requiere ejemplos y criterios aprobados.'],
 'Mal ajuste':[175,163,65,75,'Unión del mango y hoja','Inspeccionar el ajuste desde vistas apropiadas. Este dibujo no representa una medición.'],
 'Mal remachado':[144,162,35,35,'Remache','Inspeccionar posición y apariencia. La integridad de la unión no se certifica con este dibujo.'],
 'Remaches con óxido':[85,165,35,35,'Remache','La marca señala una región de ejemplo; no representa óxido real.'],
 'Desface de cacha':[150,163,80,75,'Alineación de cacha','Conservar la estación de origen: el mismo tipo de defecto puede registrarse en PC10 y PC12.'],
 'Dimensiones fuera de especificación':[120,165,145,70,'Geometría de cacha','Definir dimensiones, referencias y tolerancias antes de proponer medición.'],
 'Mal inyectado':[108,165,95,55,'Superficie de cacha','Investigar huellas, color, humedad y líneas de flujo según ejemplos reales.'],
 'Pollera tapada':[65,165,45,55,'Región pendiente de confirmar','La ubicación exacta de la pollera y su criterio deben confirmarse con la empresa.'],
 'Óxido en hoja':[530,166,110,60,'Superficie de hoja','Explorar variaciones de apariencia con condiciones de iluminación controladas.'],
 'Mal desbarbado':[155,180,65,40,'Borde de cacha','Señal ilustrativa de borde. Se requieren ejemplos reales para definir rebaba y criterio de rechazo.']
 };
 let zoom=1,cx=380,cy=165,angle=0,event=undefined,visible=true,drag=null,zone=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function draw(){cx=clamp(cx,-100,860);cy=clamp(cy,-100,430);svg.setAttribute('viewBox',`${cx-380/zoom} ${cy-165/zoom} ${760/zoom} ${330/zoom}`);object.setAttribute('transform',`translate(380 165) rotate(${angle}) scale(${angle%180===0?1:0.43}) translate(-380 -165)`);el('zoomValue').textContent=Math.round(zoom*100)+' %';el('zoomIn').disabled=zoom>=5;el('zoomOut').disabled=zoom<=1;}
 function reset(){zoom=1;cx=380;cy=165;angle=0;draw();}
 function changeZoom(factor){zoom=clamp(zoom*factor,1,5);if(zoom===1){cx=380;cy=165;}draw();}
 function applyMarker(){marker.toggleAttribute('hidden',!zone||!visible);el('toggleMarker').textContent=visible?'Ocultar zona':'Mostrar zona';el('toggleMarker').setAttribute('aria-pressed',String(visible));}
 function focus(){if(!zone)return;angle=0;[cx,cy]=zone;zoom=clamp(Math.min(600/(zone[2]+80),250/(zone[3]+50)),1,5);visible=true;applyMarker();draw();}
 el('zoomIn').onclick=()=>changeZoom(1.3);el('zoomOut').onclick=()=>changeZoom(1/1.3);el('resetView').onclick=reset;el('focusDefect').onclick=focus;el('rotateView').onclick=()=>{angle=(angle+90)%360;cx=380;cy=165;zoom=1;draw();};el('toggleMarker').onclick=()=>{visible=!visible;applyMarker();};
 svg.addEventListener('wheel',e=>{e.preventDefault();changeZoom(e.deltaY<0?1.15:1/1.15);},{passive:false});
 svg.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,cx,cy};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');});
 svg.addEventListener('pointermove',e=>{if(!drag)return;const scale=Math.min(svg.clientWidth/(760/zoom),svg.clientHeight/(330/zoom));cx=drag.cx-(e.clientX-drag.x)/scale;cy=drag.cy-(e.clientY-drag.y)/scale;draw();});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(name,()=>{drag=null;svg.classList.remove('dragging');});
 svg.addEventListener('keydown',e=>{if(!['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(['+','='].includes(e.key))changeZoom(1.3);else if(e.key==='-')changeZoom(1/1.3);else if(e.key==='0')reset();else{cx+=({'ArrowLeft':-30,'ArrowRight':30}[e.key]||0)/zoom;cy+=({'ArrowUp':-30,'ArrowDown':30}[e.key]||0)/zoom;draw();}});
 window.inspector={applyMarker,update(next){if(event!==undefined&&event?.id===next?.id)return;event=next;zone=next&&next.defect!=='Sin defecto'?guides[next.defect]:null;reset();visible=true;const image=window.syntheticInspectionImage(next);const frame=el('eventImage');frame.toggleAttribute('hidden',!image);el('imageEmpty').toggleAttribute('hidden',!!image);if(image){frame.setAttribute('href',image.url);frame.dataset.eventId=String(next.id);frame.dataset.imageId=image.id;frame.dataset.source=image.source;svg.setAttribute('aria-label',`Imagen simulada ${image.id}; no es una captura real de IMACASA`);}else{frame.removeAttribute('href');delete frame.dataset.eventId;delete frame.dataset.imageId;delete frame.dataset.source;}el('focusDefect').disabled=!zone;el('toggleMarker').disabled=!zone;el('zoneTitle').textContent=zone?zone[4]:'Vista general';el('zoneGuide').textContent=zone?zone[5]:'No hay una zona defectuosa señalada. Puedes ampliar y desplazar la pieza; el veredicto sigue siendo simulado.';if(zone){const [x,y,w,h]=zone;marker.querySelector('rect').setAttribute('x',x-w/2);marker.querySelector('rect').setAttribute('y',y-h/2);marker.querySelector('rect').setAttribute('width',w);marker.querySelector('rect').setAttribute('height',h);marker.querySelector('path').setAttribute('d',`M${x-10} ${y-10}l18 9-11 15`);}applyMarker();}};
 draw();
})();
