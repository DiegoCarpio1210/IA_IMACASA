'use strict';
// Deterministic demo artwork, not camera input or a prediction. No server/state changes.
window.syntheticInspectionImage = function(event) {
 if (!event || !Number.isSafeInteger(event.id) || event.id < 1) return null;
 const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const id = `SIM-${String(event.id).padStart(4, '0')}`;
 let seed = event.id;
 const random = () => {seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296;};
 // Each event has different visible surface strokes, including repeated OK events.
 const texture = Array.from({length:18}, () => {
  const x = 210 + random()*370, y = 145 + random()*32, length = 8 + random()*25;
  return `<path d="M${x.toFixed(2)} ${y.toFixed(2)}l${length.toFixed(2)} -2" stroke="#435e65" opacity=".28"/>`;
 }).join('');
 const handle = event.station === 'PC08' ? '' : '<path d="M57 145 Q49 163 58 187 L177 183 L170 140Z" fill="#79543c" stroke="#bd9470" stroke-width="2"/><circle cx="85" cy="165" r="5" fill="#c9c8bf"/><circle cx="144" cy="162" r="5" fill="#c9c8bf"/>';
 const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="330" viewBox="0 0 760 330"><title>Imagen simulada ${id}; no es una captura real de IMACASA</title><defs><linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d6e1e2"/><stop offset=".45" stop-color="#81989e"/><stop offset=".52" stop-color="#c2ced1"/><stop offset="1" stop-color="#5a727b"/></linearGradient></defs><path d="M160 142 L604 108 Q659 104 690 140 Q660 199 597 204 L166 184Z" fill="url(#steel)" stroke="#d6e1e2" stroke-width="2"/>${texture}${handle}<text x="200" y="222" fill="#a5bdc2" font-family="sans-serif" font-size="11">${id} · ${escape(event.station)} · IMAGEN SIMULADA</text></svg>`;
 return {id, source:'SIMULADA', url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)};
};
