'use strict';
(()=>{
 let account=null,permissions=[],roleData=[],userData=[],charts={};
 const el=id=>document.getElementById(id);
 const PERMISSION_LABELS={
  read_own:'Ver sus propias inspecciones',read_pc08:'Ver todas las inspecciones de PC08',simulate:'Generar casos de demostración',
  export:'Descargar historial en CSV',stats_own:'Ver sus indicadores',stats_pc08:'Ver indicadores globales de PC08',
  review:'Revisar inspecciones',users:'Gestionar cuentas',roles:'Configurar roles y permisos',audit:'Consultar auditoría',settings:'Cambiar parámetros del demo'
 };
 const AUDIT_LABELS={
  login:'Inició sesión',logout:'Cerró sesión','event.simulate':'Generó una inspección','events.export':'Descargó CSV del historial',
  'event.review.confirmed':'Confirmó una inspección','event.review.dismissed':'Descartó una inspección','event.review.pending':'Devolvió una inspección a pendiente',
  'user.create':'Creó una cuenta','user.role':'Cambió el rol de una cuenta','user.active':'Activó o desactivó una cuenta',
  'user.password_reset':'Restableció una contraseña','cli.password_reset':'Restableció una contraseña (terminal)',
  'role.update':'Actualizó permisos de un rol','settings.demo_enabled':'Cambió parámetros del demo','migration.legacy_login_hashed':'Migró el acceso anterior'
 };
 const COLORS={ok:'#176a36',bad:'#a32b38',brand:'#b93612'};
 window.hasPermission=p=>permissions.includes(p);
 window.resetAccess=()=>{account=null;permissions=[];roleData=[];userData=[];for(const c of Object.values(charts))c.destroy();charts={};};
 window.configureAccess=data=>{
  account=data.account;permissions=data.permissions;
  el('roleLabel').textContent=data.role_name;
  el('dashboardNav').hidden=!permissions.some(p=>['stats_own','stats_pc08'].includes(p));
  el('adminNav').hidden=!permissions.some(p=>['users','roles','audit','settings'].includes(p));
  el('simulate').hidden=el('auto').hidden=!permissions.includes('simulate');el('export').hidden=!permissions.includes('export');el('generationNote').hidden=permissions.includes('simulate');
  const manager=permissions.includes('stats_pc08');document.querySelectorAll('.manager-only').forEach(e=>e.hidden=!manager);
  el('showPending').hidden=!permissions.includes('review');
  el('dashboardTitle').textContent=manager?'Panorama de Enderezado PC08':'Mi jornada en Enderezado PC08';
  el('statsDefect').replaceChildren(option('','Todos'),...['Sin defecto',...data.defects.PC08].map(v=>option(v)));
  for(const id of ['statsOwner','filterOwner'])el(id).replaceChildren(option('','Todos'));
  for(const id of ['statsOwnerLabel','statsRoleLabel','historyOwnerLabel','historyRoleLabel'])el(id).hidden=!permissions.includes('read_pc08');
  if(permissions.includes('read_pc08'))request('/ui/operators').then(rows=>{for(const id of ['statsOwner','filterOwner'])for(const row of rows)el(id).append(option(String(row.id),row.display_name));}).catch(e=>reportError(e));
  // Al cambiar de cuenta se limpian filtros y se vuelve a la pantalla inicial.
  for(const id of ['filterOwner','filterRole','filterReview','filterDate','filterFrom','filterTo','statsOwner','statsRole','statsReview','statsFrom','statsTo'])el(id).value='';
  changePage('live');
 };

 // ---------- Indicadores ----------
 function chart(id,type,labels,datasets,extra={}){
  if(charts[id])charts[id].destroy();
  const round=type==='doughnut'||type==='pie',stacked=!!extra.stacked,horizontal=extra.indexAxis==='y';
  const valueAxis={beginAtZero:true,stacked,ticks:{precision:0}},categoryAxis={stacked,ticks:{autoSkip:!horizontal,maxRotation:0}};
  const scales=round?{}:(horizontal?{x:valueAxis,y:categoryAxis}:{x:categoryAxis,y:valueAxis});
  charts[id]=new Chart(el(id),{type,data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,animation:false,indexAxis:horizontal?'y':'x',
   plugins:{legend:{display:round||datasets.length>1,position:'bottom'}},scales}});
 }
 function rows(id,items){el(id).replaceChildren();for(const values of items){const tr=document.createElement('tr');for(const value of values){const td=document.createElement('td');td.textContent=value;tr.append(td);}el(id).append(tr);}}
 window.loadDashboard=async()=>{
  const from=el('statsFrom').value,to=el('statsTo').value;
  if(from&&to&&from>to){message('La fecha «Desde» no puede ser posterior a «Hasta». Corrige el rango para ver los indicadores.');return;}
  const epoch=accessEpoch;
  const q=new URLSearchParams({station:'PC08',date_from:from,date_to:to,defect:el('statsDefect').value,review_status:el('statsReview').value,owner_id:el('statsOwner').value,role:el('statsRole').value});
  const data=await request('/ui/stats?'+q);if(epoch!==accessEpoch)return;
  const manager=permissions.includes('stats_pc08');
  el('dashboardScope').textContent=(manager?'Todas las inspecciones de PC08':'Solo tus inspecciones de PC08')+' · Datos de demostración';
  el('dashboardMetrics').replaceChildren();
  const metrics=[['Inspecciones',data.total],['Piezas OK',data.ok],['Con defecto',data.defects],['% con defecto',data.rejection_pct===null?'—':data.rejection_pct+' %'],['Inspecciones de hoy',data.today.total]];
  if(permissions.includes('review'))metrics.splice(4,0,['Por revisar',data.pending]);
  for(const [label,value] of metrics){const article=document.createElement('article');article.className='card';const span=document.createElement('span');span.textContent=label;const strong=document.createElement('strong');strong.textContent=value;article.append(span,strong);el('dashboardMetrics').append(article);}
  el('statsEmpty').hidden=!!data.total;el('chartsGrid').hidden=!data.total;
  rows('defectRanking',data.by_defect.length?data.by_defect.map(r=>[r.defect,r.count,data.defects?Math.round(100*r.count/data.defects)+' %':'—']):[['Sin defectos registrados','—','—']]);
  el('ownerNote').textContent=data.comparison_note;rows('ownerStats',data.by_owner.length?data.by_owner.map(r=>[r.name,r.total,r.defects]):[['Se necesitan registros de al menos dos usuarios para comparar','—','—']]);
  if(!data.total){for(const c of Object.values(charts))c.destroy();charts={};return;}
  // Defectos más frecuentes: barras horizontales para que los nombres largos se lean completos.
  const names=data.by_defect.map(r=>r.defect),counts=data.by_defect.map(r=>r.count);
  el('barEmpty').hidden=!!names.length;el('barChart').parentElement.hidden=!names.length;
  if(names.length)chart('barChart','bar',names,[{label:'Inspecciones con este defecto',data:counts,backgroundColor:COLORS.brand,borderRadius:4}],{indexAxis:'y'});
  // Inspecciones por día: con una sola jornada se muestra como barras, no como una línea de un punto.
  const days=data.daily.map(r=>r.date),single=days.length<2;
  el('trendNote').textContent=single?'Hay datos de una sola jornada; la tendencia aparecerá cuando existan registros de más días.':'Inspecciones totales y con defecto por día.';
  chart('lineChart',single?'bar':'line',days,[
   {label:'Inspecciones',data:data.daily.map(r=>r.total),borderColor:COLORS.ok,backgroundColor:COLORS.ok,tension:0},
   {label:'Con defecto',data:data.daily.map(r=>r.defects),borderColor:COLORS.bad,backgroundColor:COLORS.bad,tension:0}]);
  if(manager){
   chart('pieChart','doughnut',['Piezas OK','Con defecto'],[{data:[data.ok,data.defects],backgroundColor:[COLORS.ok,COLORS.bad]}]);
   el('periodNote').textContent=single?'La comparación aparecerá cuando existan registros de al menos dos jornadas.':'Resultado OK y con defecto de cada jornada.';
   el('periodChart').parentElement.hidden=single;
   if(!single)chart('periodChart','bar',days,[{label:'OK',data:data.daily.map(r=>r.total-r.defects),backgroundColor:COLORS.ok},{label:'Con defecto',data:data.daily.map(r=>r.defects),backgroundColor:COLORS.bad}],{stacked:true});
  }
 };

 // ---------- Administración ----------
 function actionButton(text,fn,success,kind='secondary'){
  const b=document.createElement('button');b.type='button';b.className=kind;b.textContent=text;
  b.onclick=async()=>{b.disabled=true;try{const ok=await fn();if(ok===false)return;await window.loadAdmin();message(success,'success');}catch(e){reportError(e);}finally{b.disabled=false;}};
  return b;
 }
 function selectRoles(current){const s=document.createElement('select');for(const r of roleData)s.append(option(r.id,r.name));s.value=current;return s;}
 function showRole(){const r=roleData.find(x=>x.id===el('editRole').value);if(!r)return;el('editRoleName').value=r.name;for(const input of el('permissionChecks').querySelectorAll('input'))input.checked=r.permissions.includes(input.value);}
 function auditTarget(row){
  if(!row.target)return '—';
  if(row.action.startsWith('event.'))return 'SIM-'+String(row.target).padStart(4,'0');
  if(row.action.startsWith('user.')||row.action.startsWith('cli.')||row.action.startsWith('migration.')){const u=userData.find(x=>String(x.id)===String(row.target));return u?u.username:'Cuenta #'+row.target;}
  if(row.action==='role.update'){const r=roleData.find(x=>x.id===row.target);return r?r.name:row.target;}
  return row.target;
 }
 function renderUsers(){
  el('usersRows').replaceChildren();
  for(const user of userData){
   const tr=document.createElement('tr');
   const tdUser=document.createElement('td');tdUser.textContent=user.username;
   if(account&&user.id===account.id){const me=document.createElement('small');me.className='you';me.textContent=' (tu cuenta)';tdUser.append(me);}
   const tdName=document.createElement('td');tdName.textContent=user.display_name;
   const role=selectRoles(user.role);role.setAttribute('aria-label','Rol de '+user.username);
   const assign=actionButton('Guardar rol',()=>request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({role:role.value})}),`Rol de ${user.username} actualizado.`);
   assign.disabled=true;role.onchange=()=>{assign.disabled=role.value===user.role;};
   const roleBox=document.createElement('div');roleBox.className='inline-control';roleBox.append(role,assign);
   const tdRole=document.createElement('td');tdRole.append(roleBox);
   const tdState=document.createElement('td');const state=document.createElement('span');state.className='tag'+(user.active?'':' muted-tag');state.textContent=user.active?'Activa':'Inactiva';tdState.append(state);
   const pw=document.createElement('input');pw.type='password';pw.placeholder='Nueva contraseña (12+ caracteres)';pw.autocomplete='new-password';pw.setAttribute('aria-label','Nueva contraseña para '+user.username);
   const reset=actionButton('Restablecer',async()=>{
    if(pw.value.length<12){message('Escribe una nueva contraseña de al menos 12 caracteres para '+user.username+'.');pw.focus();return false;}
    await request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({password:pw.value})});pw.value='';
   },`Contraseña de ${user.username} restablecida. Sus sesiones abiertas se cerraron.`);
   const toggle=actionButton(user.active?'Desactivar':'Activar',()=>request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({active:!user.active})}),`Cuenta ${user.username} ${user.active?'desactivada':'activada'}.`);
   const pwBox=document.createElement('div');pwBox.className='inline-control';pwBox.append(pw,reset);
   const tdActions=document.createElement('td');tdActions.append(pwBox,toggle);
   tr.append(tdUser,tdName,tdRole,tdState,tdActions);el('usersRows').append(tr);
  }
 }
 window.loadAdmin=async()=>{
  const epoch=accessEpoch;
  for(const [id,permission] of [['usersPanel','users'],['rolesPanel','roles'],['settingsPanel','settings'],['auditPanel','audit']])el(id).hidden=!permissions.includes(permission);
  if(permissions.includes('roles')){
   const data=await request('/ui/admin/roles');if(epoch!==accessEpoch)return;roleData=data.roles;
   const selected=el('editRole').value;
   el('editRole').replaceChildren(...roleData.map(r=>option(r.id,r.name)));if(roleData.some(r=>r.id===selected))el('editRole').value=selected;
   el('permissionChecks').replaceChildren();
   for(const permission of data.available_permissions){
    const label=document.createElement('label');label.className='check-label';const input=document.createElement('input');input.type='checkbox';input.value=permission;
    const text=document.createElement('span');text.textContent=PERMISSION_LABELS[permission]||permission;const code=document.createElement('small');code.textContent=permission;text.append(code);
    label.append(input,text);el('permissionChecks').append(label);
   }
   showRole();
  }
  if(!roleData.length)roleData=[{id:'herrero',name:'Herrero · provisional'},{id:'pulidor',name:'Pulidor · provisional'},{id:'supervisor',name:'Jefe del Área de Cuchillos · provisional'},{id:'admin',name:'Administrador técnico'}];
  if(permissions.includes('users')){
   const current=el('newRole').value;el('newRole').replaceChildren(...roleData.map(r=>option(r.id,r.name)));if(current)el('newRole').value=current;
   userData=await request('/ui/admin/users');if(epoch!==accessEpoch)return;renderUsers();
  }
  if(permissions.includes('settings'))el('demoEnabled').checked=(await request('/ui/admin/settings')).demo_enabled;
  if(permissions.includes('audit'))rows('auditRows',(await request('/ui/admin/audit')).map(r=>[timeLabel(r.stamp,true),r.username||'Sistema',AUDIT_LABELS[r.action]||r.action,auditTarget(r)]));
 };

 document.addEventListener('DOMContentLoaded',()=>{
  const reload=()=>{message();window.loadDashboard().catch(e=>reportError(e));};
  for(const id of ['statsFrom','statsTo','statsDefect','statsReview','statsOwner','statsRole'])el(id).onchange=reload;
  el('statsRefresh').onclick=reload;
  el('statsClear').onclick=()=>{for(const id of ['statsFrom','statsTo','statsDefect','statsReview','statsOwner','statsRole'])el(id).value='';reload();};
  el('showPending').onclick=()=>{el('filterStation').value='PC08';populateDefects();for(const id of ['filterDate','filterFrom','filterTo','filterOwner','filterRole'])el(id).value='';el('filterDefect').value='';el('filterReview').value='pending';changePage('history');};
  el('editRole').onchange=showRole;
  el('createUserForm').onsubmit=async e=>{
   e.preventDefault();
   if(el('newPassword').value.length<12){message('La contraseña debe tener al menos 12 caracteres.');el('newPassword').focus();return;}
   try{
    const username=el('newUsername').value.trim();
    await request('/ui/admin/users',{method:'POST',body:JSON.stringify({username,display_name:el('newDisplayName').value.trim(),password:el('newPassword').value,role:el('newRole').value})});
    el('createUserForm').reset();await window.loadAdmin();message(`Cuenta ${username} creada correctamente.`,'success');
   }catch(err){if(err.status===422)err.message='No se pudo crear la cuenta: el usuario ya existe o tiene caracteres no permitidos (usa letras, números, punto, guion o @).';reportError(err);}
  };
  el('roleForm').onsubmit=async e=>{
   e.preventDefault();
   try{await request('/ui/admin/roles/'+el('editRole').value,{method:'POST',body:JSON.stringify({name:el('editRoleName').value,permissions:[...el('permissionChecks').querySelectorAll('input:checked')].map(x=>x.value)})});await window.loadAdmin();message('Permisos del rol guardados. Se aplican desde la siguiente acción de cada usuario.','success');}
   catch(err){reportError(err);}
  };
  el('saveSettings').onclick=async()=>{try{await request('/ui/admin/settings',{method:'POST',body:JSON.stringify({demo_enabled:el('demoEnabled').checked})});message(el('demoEnabled').checked?'Generación de casos habilitada.':'Generación de casos pausada para todos los usuarios.','success');}catch(e){reportError(e);}};
 });
})();
