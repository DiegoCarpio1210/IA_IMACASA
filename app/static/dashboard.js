'use strict';
(()=>{
 let account=null,permissions=[],roleData=[],charts={};
 const el=id=>document.getElementById(id);
 window.hasPermission=p=>permissions.includes(p);
 window.resetAccess=()=>{account=null;permissions=[];roleData=[];for(const c of Object.values(charts))c.destroy();charts={};};
 window.configureAccess=data=>{
  account=data.account;permissions=data.permissions;
  el('roleLabel').textContent=data.role_name;
  el('dashboardNav').hidden=!permissions.some(p=>['stats_own','stats_pc08'].includes(p));
  el('adminNav').hidden=!permissions.some(p=>['users','roles','audit','settings'].includes(p));
  el('simulate').hidden=el('auto').hidden=!permissions.includes('simulate');el('export').hidden=!permissions.includes('export');el('generationNote').hidden=permissions.includes('simulate');
  const manager=permissions.includes('stats_pc08');document.querySelectorAll('.manager-only').forEach(e=>e.hidden=!manager);
  el('dashboardTitle').textContent=manager?'Panorama de Enderezado PC08':'Mi jornada en Enderezado PC08';
  el('statsDefect').replaceChildren(option('','Todos'),...['Sin defecto',...data.defects.PC08].map(v=>option(v)));
  for(const id of ['statsOwner','filterOwner'])el(id).replaceChildren(option('','Todos'));
  for(const id of ['statsOwnerLabel','statsRoleLabel','historyOwnerLabel','historyRoleLabel'])el(id).hidden=!permissions.includes('read_pc08');
  if(permissions.includes('read_pc08'))request('/ui/operators').then(rows=>{for(const id of ['statsOwner','filterOwner'])for(const row of rows)el(id).append(option(String(row.id),row.display_name));}).catch(e=>reportError(e));
  // Reset filters and prior role's page when another user signs in.
  for(const id of ['filterOwner','filterRole','filterReview','filterDate','filterFrom','filterTo','statsOwner','statsRole','statsReview','statsFrom','statsTo'])el(id).value='';
  changePage('live');
 };
 function chart(id,type,labels,datasets){if(charts[id])charts[id].destroy();charts[id]=new Chart(el(id),{type,data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:type!=='bar'||datasets.length>1}},scales:type==='pie'?{}:{y:{beginAtZero:true,ticks:{precision:0}}}}});}
 function rows(id,items){el(id).replaceChildren();for(const values of items){const tr=document.createElement('tr');for(const value of values){const td=document.createElement('td');td.textContent=value;tr.append(td);}el(id).append(tr);}}
 window.loadDashboard=async()=>{
  const epoch=accessEpoch;
  const q=new URLSearchParams({station:'PC08',date_from:el('statsFrom').value,date_to:el('statsTo').value,defect:el('statsDefect').value,review_status:el('statsReview').value,owner_id:el('statsOwner').value,role:el('statsRole').value});
  const data=await request('/ui/stats?'+q);if(epoch!==accessEpoch)return;el('dashboardScope').textContent=data.scope+' · Solo eventos guardados en SQLite · Simulación';
  el('dashboardMetrics').replaceChildren();
  const metrics=[['Inspecciones',data.total],['Piezas OK',data.ok],['Con defecto',data.defects],['Rechazo simulado',data.rejection_pct===null?'—':data.rejection_pct+' %'],['Por revisar',data.pending],['Jornada de hoy',data.today.total]];
  for(const [label,value] of metrics){const article=document.createElement('article');article.className='card';const span=document.createElement('span');span.textContent=label;const strong=document.createElement('strong');strong.textContent=value;article.append(span,strong);el('dashboardMetrics').append(article);}
  el('statsEmpty').hidden=!!data.total;el('chartsGrid').hidden=!data.total;
  rows('defectRanking',data.by_defect.length?data.by_defect.map(r=>[r.defect,r.count]):[['Sin defectos registrados','—']]);
  el('ownerNote').textContent=data.comparison_note;rows('ownerStats',data.by_owner.length?data.by_owner.map(r=>[r.name,r.total,r.defects]):[['Muestra insuficiente para comparar','—','—']]);
  if(!data.total){for(const c of Object.values(charts))c.destroy();charts={};return;}
  const names=data.by_defect.map(r=>r.defect),counts=data.by_defect.map(r=>r.count),colors=['#b93612','#176a36','#a86400','#176779','#774c91','#53636b','#9d2861','#77731a'];
  chart('barChart','bar',names,[{label:'Eventos sintéticos',data:counts,backgroundColor:'#b93612'}]);
  const days=data.daily.map(r=>r.date);el('trendNote').textContent=days.length<2?'Una sola jornada: no permite inferir tendencia.':'Comparación descriptiva de eventos sintéticos; no mide productividad.';
  chart('lineChart','line',days,[{label:'Inspecciones',data:data.daily.map(r=>r.total),borderColor:'#176a36',backgroundColor:'#176a36'},{label:'Con defecto',data:data.daily.map(r=>r.defects),borderColor:'#a32b38',backgroundColor:'#a32b38'}]);
  if(permissions.includes('stats_pc08')){chart('pieChart','pie',names,[{data:counts,backgroundColor:colors}]);chart('periodChart','bar',days,[{label:'OK',data:data.daily.map(r=>r.total-r.defects),backgroundColor:'#176a36'},{label:'Defecto',data:data.daily.map(r=>r.defects),backgroundColor:'#a32b38'}]);}
 };
 function button(text,fn){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=text;b.onclick=async()=>{try{await fn();message('Cambio guardado');await window.loadAdmin();}catch(e){reportError(e);}};return b;}
 function selectRoles(current){const s=document.createElement('select');for(const r of roleData)s.append(option(r.id,r.name));s.value=current;return s;}
 function showRole(){const r=roleData.find(x=>x.id===el('editRole').value);if(!r)return;el('editRoleName').value=r.name;for(const input of el('permissionChecks').querySelectorAll('input'))input.checked=r.permissions.includes(input.value);}
 window.loadAdmin=async()=>{
  const epoch=accessEpoch;
  for(const [id,permission] of [['usersPanel','users'],['rolesPanel','roles'],['settingsPanel','settings'],['auditPanel','audit']])el(id).hidden=!permissions.includes(permission);
  if(permissions.includes('roles')){const data=await request('/ui/admin/roles');if(epoch!==accessEpoch)return;roleData=data.roles;el('newRole').replaceChildren(...roleData.map(r=>option(r.id,r.name)));el('editRole').replaceChildren(...roleData.map(r=>option(r.id,r.name)));el('permissionChecks').replaceChildren();for(const permission of data.available_permissions){const label=document.createElement('label');label.className='check-label';const input=document.createElement('input');input.type='checkbox';input.value=permission;label.append(input,document.createTextNode(permission));el('permissionChecks').append(label);}showRole();}
  if(permissions.includes('users')){if(!roleData.length)roleData=[{id:'herrero',name:'Herrero provisional'},{id:'pulidor',name:'Pulidor provisional'},{id:'supervisor',name:'Jefe provisional'},{id:'admin',name:'Administrador técnico'}];el('newRole').replaceChildren(...roleData.map(r=>option(r.id,r.name)));const data=await request('/ui/admin/users');if(epoch!==accessEpoch)return;el('usersRows').replaceChildren();for(const user of data){const tr=document.createElement('tr');for(const val of [user.username,user.display_name]){const td=document.createElement('td');td.textContent=val;tr.append(td);}const role=selectRoles(user.role);const tdRole=document.createElement('td');tdRole.append(role,button('Asignar',()=>request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({role:role.value})})));tr.append(tdRole);const active=document.createElement('td');active.textContent=user.active?'Activo':'Inactivo';tr.append(active);const actions=document.createElement('td');const pw=document.createElement('input');pw.type='password';pw.placeholder='Nueva contraseña (12+)';pw.autocomplete='new-password';pw.setAttribute('aria-label','Restablecer contraseña de '+user.username);actions.append(button(user.active?'Desactivar':'Activar',()=>request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({active:!user.active})})),pw,button('Restablecer',async()=>{await request('/ui/admin/users/'+user.id,{method:'POST',body:JSON.stringify({password:pw.value})});pw.value='';}));tr.append(actions);el('usersRows').append(tr);}}
  if(permissions.includes('settings'))el('demoEnabled').checked=(await request('/ui/admin/settings')).demo_enabled;
  if(permissions.includes('audit'))rows('auditRows',(await request('/ui/admin/audit')).map(r=>[timeLabel(r.stamp,true),r.username||'Inicialización local',r.action,r.target||'—']));
 };
 document.addEventListener('DOMContentLoaded',()=>{
  el('statsRefresh').onclick=()=>window.loadDashboard().catch(e=>reportError(e));
  el('showPending').onclick=()=>{el('filterStation').value='PC08';populateDefects();el('filterReview').value='pending';changePage('history');};
  el('editRole').onchange=showRole;
  el('createUserForm').onsubmit=async e=>{e.preventDefault();try{await request('/ui/admin/users',{method:'POST',body:JSON.stringify({username:el('newUsername').value,display_name:el('newDisplayName').value,password:el('newPassword').value,role:el('newRole').value})});el('createUserForm').reset();await window.loadAdmin();message('Cuenta creada');}catch(err){reportError(err);}};
  el('roleForm').onsubmit=async e=>{e.preventDefault();try{await request('/ui/admin/roles/'+el('editRole').value,{method:'POST',body:JSON.stringify({name:el('editRoleName').value,permissions:[...el('permissionChecks').querySelectorAll('input:checked')].map(x=>x.value)})});await window.loadAdmin();message('Permisos guardados');}catch(err){reportError(err);}};
  el('saveSettings').onclick=async()=>{try{await request('/ui/admin/settings',{method:'POST',body:JSON.stringify({demo_enabled:el('demoEnabled').checked})});message('Configuración guardada');}catch(e){reportError(e);}};
 });
})();
