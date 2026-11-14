'use strict';
const $=id=>document.getElementById(id);
const names={PC08:'Enderezado',PC10:'Montaje',PC12:'Inyectado'};
const REVIEW_LABELS={pending:'Pendiente',confirmed:'Confirmada',dismissed:'Descartada'};
const LOGIN_NOTICES={
 expired:'Tu sesión finalizó por inactividad o por seguridad. Ingresa nuevamente para continuar.',
 logout:'Cerraste sesión correctamente.',
 unavailable:'No pudimos conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.'
};
let accessEpoch=0;
let station='PC08',page='live',catalog={},running=false,busy=false,historyRows=[],refreshing=false,messageTimer=null;

// ---------- Mensajes ----------
function message(text='',kind='error'){
 const box=$('message');clearTimeout(messageTimer);
 box.textContent=text;box.className=text?'message-'+kind:'';
 if(text&&kind==='success')messageTimer=setTimeout(()=>{if(box.textContent===text){box.textContent='';box.className='';}},4000);
}
function reportError(error){if(!error.stale&&error.status!==401)message(error.message);}
function friendlyError(status,data){
 if(data&&typeof data.detail==='string')return data.detail;
 if(status===422)return 'Revisa los datos ingresados e inténtalo de nuevo.';
 if(status===429)return 'Demasiados intentos. Espera un minuto antes de reintentar.';
 if(status===403)return 'Tu rol no tiene permiso para esta acción.';
 if(status>=500)return 'El servidor no está disponible en este momento. Intenta de nuevo en unos segundos.';
 return 'No se pudo completar la solicitud.';
}

// ---------- Comunicación con el servidor ----------
async function request(path,options={}){
 const epoch=accessEpoch;let response;
 try{response=await fetch(path,{...options,headers:{'Content-Type':'application/json','X-Demo-Request':'1',...(options.headers||{})}});}
 catch{
  if(epoch!==accessEpoch)throw Object.assign(new Error('Solicitud de una sesión anterior'),{stale:true});
  throw Object.assign(new Error(LOGIN_NOTICES.unavailable),{status:0});
 }
 let data=null;
 try{data=await response.json();}catch{data=null;}
 if(epoch!==accessEpoch)throw Object.assign(new Error('Solicitud de una sesión anterior'),{stale:true});
 if(!response.ok){
  const error=Object.assign(new Error(friendlyError(response.status,data)),{status:response.status});
  if(response.status===401&&path!=='/ui/login')handleUnauthorized();
  throw error;
 }
 if(data===null)throw Object.assign(new Error('El servidor respondió en un formato inesperado. Intenta de nuevo.'),{status:response.status});
 return data;
}

// ---------- Acceso ----------
function setLoginError(text=''){const box=$('loginError');box.textContent=text;box.hidden=!text;}
function resetLoginForm(){$('loginForm').reset();$('password').type='password';$('togglePassword').textContent='Mostrar';$('togglePassword').setAttribute('aria-pressed','false');}
function setLoginNotice(kind=''){const notice=$('loginNotice');notice.textContent=LOGIN_NOTICES[kind]||'';notice.hidden=!notice.textContent;}
function handleUnauthorized(){showLogin($('workspace').hidden?'':'expired');}
function showLogin(kind=''){
 message();setLoginError();setLoginNotice(kind);
 accessEpoch++;refreshing=false;running=false;updateAuto();window.resetAccess?.();
 $('workspace').hidden=true;$('loginView').hidden=false;
 // Al salir no queda ningún dato del usuario anterior en el formulario.
 resetLoginForm();$('username').focus();
}
function initials(name){return String(name||'?').trim().split(/[\s._-]+/).filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('')||'?';}
function showWorkspace(data){
 message();setLoginError();setLoginNotice();resetLoginForm();accessEpoch++;refreshing=false;catalog=data.defects;
 const display=data.account?.display_name||data.user;
 $('userLabel').textContent=display;$('userLabel').title=data.user;$('avatar').textContent=initials(display);
 $('workspace').hidden=false;$('loginView').hidden=true;
 window.configureAccess(data);setStation(station);populateDefects();
}

// ---------- Utilidades de interfaz ----------
function option(value,label=value){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
function eventCode(id){return 'SIM-'+String(id).padStart(4,'0');}
function setStation(value){
 station=value;message();
 document.querySelectorAll('[data-station]').forEach(b=>{const active=b.dataset.station===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('scenario').replaceChildren(...['Sin defecto',...catalog[value]].map(x=>option(x)));
 $('frameStation').textContent=value+' · '+names[value].toUpperCase();$('resultStation').textContent=value;refresh();
}
function populateDefects(){const s=$('filterStation').value;const previous=$('filterDefect').value;const values=['Sin defecto',...new Set(s?catalog[s]:Object.values(catalog).flat())];$('filterDefect').replaceChildren(option('','Todos los defectos'),...values.map(x=>option(x)));if(values.includes(previous))$('filterDefect').value=previous;}
function timeLabel(stamp,full=false){return new Intl.DateTimeFormat('es-SV',{timeZone:'America/El_Salvador',...(full?{year:'numeric',month:'2-digit',day:'2-digit'}:{}),hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(stamp));}
function verdictTag(value){const tag=document.createElement('span');tag.className='tag'+(value==='Defecto'?' bad':'');tag.textContent=value;return tag;}

function reviewControl(row){
 const select=document.createElement('select');
 for(const [v,l] of Object.entries(REVIEW_LABELS))select.append(option(v,l));
 select.value=row.review_status;select.className='review-select '+row.review_status;
 select.setAttribute('aria-label','Revisión del evento '+eventCode(row.id));
 select.onchange=async()=>{
  const previous=row.review_status;select.disabled=true;
  try{
   await request('/ui/events/'+row.id+'/review',{method:'POST',body:JSON.stringify({status:select.value})});
   row.review_status=select.value;select.className='review-select '+select.value;
   message(`Revisión de ${eventCode(row.id)} guardada como «${REVIEW_LABELS[select.value]}».`,'success');
   await loadHistory();
  }catch(e){select.value=previous;reportError(e);}
  finally{select.disabled=false;}
 };
 return select;
}
function renderRows(target,rows,full){
 const body=$(target);body.replaceChildren();
 if(!rows.length){const tr=body.insertRow(),td=tr.insertCell();td.colSpan=full?8:5;td.className='empty';td.textContent=full?'No hay inspecciones con estos filtros.':'Aún no hay inspecciones en esta estación.';return;}
 for(const row of rows){
  const tr=body.insertRow();
  const values=full
   ?[eventCode(row.id),timeLabel(row.stamp,true),row.station,row.verdict,row.defect,row.confidence.toFixed(1)+' %']
   :[eventCode(row.id),timeLabel(row.stamp),row.verdict,row.defect,row.confidence.toFixed(1)+' %'];
  for(const value of values){const td=tr.insertCell();if(value==='OK'||value==='Defecto')td.append(verdictTag(value));else td.textContent=value;}
  if(full){
   tr.insertCell().textContent=row.owner_name||'Sin asignación (registro anterior)';
   const cell=tr.insertCell();
   if(window.hasPermission('review')&&row.station==='PC08')cell.append(reviewControl(row));
   else cell.textContent=REVIEW_LABELS[row.review_status]||'Pendiente';
  }
 }
}
function renderEvent(event){
 window.inspector.update(event);
 if(!event){
  $('verdictBadge').textContent='Sin inspecciones';$('verdictBadge').className='verdict-badge waiting';
  $('defectName').textContent='Esperando la primera inspección';$('confidence').textContent='—';$('confidenceBar').style.width='0%';
  $('eventNumber').textContent='—';$('captureId').textContent=station+' / EN ESPERA';$('frameTime').textContent='Genera un caso para ver el resultado aquí';
  $('reviewStatus').textContent='—';$('defectMarker').setAttribute('hidden','');return;
 }
 const bad=event.verdict==='Defecto';
 $('verdictBadge').textContent=bad?'Defecto detectado':'Pieza OK';$('verdictBadge').className='verdict-badge'+(bad?' bad':'');
 $('defectName').textContent=event.defect;$('confidence').textContent=event.confidence.toFixed(1)+' %';$('confidenceBar').style.width=event.confidence+'%';
 $('eventNumber').textContent=eventCode(event.id);$('captureId').textContent=event.station+' / '+eventCode(event.id);$('frameTime').textContent=timeLabel(event.stamp,true);
 $('reviewStatus').textContent=REVIEW_LABELS[event.review_status]||'Pendiente';
 window.inspector.applyMarker();
}
async function refresh(){
 if(refreshing||$('workspace').hidden)return;refreshing=true;const selected=station,epoch=accessEpoch;
 try{
  const data=await request('/ui/events?station='+selected);if(epoch!==accessEpoch)return;
  if(selected===station){$('statTotal').textContent=data.summary.total;$('statOK').textContent=data.summary.ok;$('statDefect').textContent=data.summary.defects;renderRows('recentRows',data.events.slice(0,5),false);renderEvent(data.events[0]);}
  if(page==='history')await loadHistory();
 }catch(e){reportError(e);}finally{if(epoch===accessEpoch)refreshing=false;}
}

// ---------- Historial ----------
function historyQuery(){return new URLSearchParams({station:$('filterStation').value||'PC08',date:$('filterDate').value,defect:$('filterDefect').value,date_from:$('filterFrom').value,date_to:$('filterTo').value,review_status:$('filterReview').value,owner_id:$('filterOwner').value,role:$('filterRole').value});}
function rangeIsValid(from,to){if(from&&to&&from>to){message('La fecha «Desde» no puede ser posterior a «Hasta». Corrige el rango para ver resultados.');return false;}return true;}
async function loadHistory(){
 if(!rangeIsValid($('filterFrom').value,$('filterTo').value))return;
 const epoch=accessEpoch,q=historyQuery();const data=await request('/ui/events?'+q);
 if(epoch!==accessEpoch||q.toString()!==historyQuery().toString())return;
 historyRows=data.events;renderRows('historyRows',historyRows,true);
 const total=data.summary.total,shown=historyRows.length;
 $('historyCount').textContent=`${total} ${total===1?'inspección encontrada':'inspecciones encontradas'}`+(total>shown?` · se muestran las ${shown} más recientes (descarga el CSV para verlas todas)`:'');
}

// ---------- Navegación ----------
const PAGE_TITLES={live:'Inspección en vivo',history:'Historial',system:'Sistema y equipo',dashboard:'Indicadores PC08',admin:'Administración técnica'};
function changePage(value){
 page=value;message();
 document.querySelectorAll('[data-page]').forEach(b=>{const active=b.dataset.page===value;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 for(const p of ['live','history','system','dashboard','admin'])$(p+'Page').hidden=p!==value;
 $('pageTitle').textContent=PAGE_TITLES[value];
 if(value==='history')loadHistory().catch(e=>reportError(e));
 if(value==='dashboard')window.loadDashboard().catch(e=>reportError(e));
 if(value==='admin')window.loadAdmin().catch(e=>reportError(e));
}

// ---------- Generación de casos ----------
function randomDefect(){const list=catalog[station]||[];return Math.random()<0.45||!list.length?'Sin defecto':list[Math.floor(Math.random()*list.length)];}
async function simulate(automatic=false){
 if(busy)return;busy=true;$('simulate').disabled=true;
 try{await request('/ui/simulate',{method:'POST',body:JSON.stringify({station,defect:automatic?randomDefect():$('scenario').value})});await refresh();}
 catch(e){running=false;updateAuto();reportError(e);}
 finally{busy=false;$('simulate').disabled=false;}
}
function updateAuto(){
 $('auto').textContent=running?'Detener secuencia':'Secuencia automática';
 $('auto').setAttribute('aria-pressed',String(running));$('auto').classList.toggle('running',running);
 $('autoState').textContent=running?'· secuencia activa: un caso aleatorio cada 3 s':'· secuencia detenida';
}

// ---------- Eventos de la página ----------
$('loginForm').addEventListener('submit',async e=>{
 e.preventDefault();accessEpoch++;setLoginError();setLoginNotice();
 const button=$('loginButton');button.disabled=true;$('loginLabel').textContent='Verificando…';
 try{
  await request('/ui/login',{method:'POST',body:JSON.stringify({username:$('username').value.trim(),password:$('password').value})});
  $('password').value='';showWorkspace(await request('/ui/session'));updateAuto();
 }catch(err){
  if(!err.stale){setLoginError(err.status===401?'Usuario o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.':err.message);$('password').value='';$('password').focus();}
 }finally{button.disabled=false;$('loginLabel').textContent='Ingresar al panel';}
});
for(const id of ['username','password'])$(id).addEventListener('input',()=>setLoginError());
$('togglePassword').onclick=()=>{const field=$('password'),show=field.type==='password';field.type=show?'text':'password';$('togglePassword').textContent=show?'Ocultar':'Mostrar';$('togglePassword').setAttribute('aria-pressed',String(show));field.focus();};
$('logout').onclick=async()=>{try{await request('/ui/logout',{method:'POST'});showLogin('logout');}catch(e){reportError(e);}};
document.querySelectorAll('[data-station]').forEach(b=>b.onclick=()=>setStation(b.dataset.station));
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>changePage(b.dataset.page));
$('viewHistory').onclick=()=>{$('filterStation').value=station;populateDefects();changePage('history');};
$('simulate').onclick=()=>simulate(false);
$('auto').onclick=()=>{running=!running;updateAuto();if(running)simulate(true);};
for(const id of ['filterStation','filterDate','filterDefect','filterFrom','filterTo','filterReview','filterOwner','filterRole'])$(id).onchange=()=>{
 message();
 if(id==='filterStation'){populateDefects();if($('filterStation').value!=='PC08'){$('filterOwner').value='';$('filterRole').value='';}}
 // Un día exacto y un rango son excluyentes: el último que se elige manda.
 if(id==='filterDate'&&$('filterDate').value){$('filterFrom').value='';$('filterTo').value='';}
 if((id==='filterFrom'||id==='filterTo')&&$(id).value)$('filterDate').value='';
 loadHistory().catch(e=>reportError(e));
};
$('clearFilters').onclick=()=>{message();$('filterStation').value='PC08';for(const id of ['filterDate','filterFrom','filterTo','filterReview','filterOwner','filterRole'])$(id).value='';populateDefects();$('filterDefect').value='';loadHistory().catch(e=>reportError(e));};
$('export').onclick=async()=>{
 if(!rangeIsValid($('filterFrom').value,$('filterTo').value))return;
 try{
  const r=await fetch('/ui/export?'+historyQuery());
  if(r.status===401){handleUnauthorized();return;}
  if(!r.ok)throw new Error('No se pudo generar el CSV. Revisa los filtros e inténtalo de nuevo.');
  const url=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=url;
  a.download=`pimientero-historial-${$('filterStation').value||'PC08'}-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  message('Descarga del CSV iniciada.','success');
 }catch(e){reportError(e);}
};
$('checkHealth').onclick=async()=>{
 $('healthResult').textContent='Comprobando…';
 try{const r=await fetch('/health');const body=await r.json();$('healthResult').textContent=(r.ok?'✔ Servicio disponible':'✖ Servicio con problemas')+' · HTTP '+r.status+'\n'+JSON.stringify(body,null,2);}
 catch{$('healthResult').textContent='✖ No se pudo conectar con la API.';}
};
setInterval(()=>{$('clock').textContent=timeLabel(new Date().toISOString(),true);},1000);
setInterval(()=>{if(!$('workspace').hidden){if(running)simulate(true);else refresh();}},3000);
request('/ui/session').then(showWorkspace).catch(e=>{if(!e.stale&&e.status!==401)showLogin('unavailable');});
