import csv,io,json,random,secrets,time,sqlite3
from datetime import datetime,timezone,timedelta,date
from urllib.parse import urlparse
from fastapi import APIRouter,Request,HTTPException
from fastapi.responses import JSONResponse,Response,FileResponse
from pydantic import BaseModel,Field
from pathlib import Path
from . import store
from .catalog import DEFECTS

router=APIRouter();attempts={};TZ=timezone(timedelta(hours=-6))
def mutation(request):
 if request.headers.get('x-demo-request')!='1':raise HTTPException(403,'Petición no permitida')
 origin=request.headers.get('origin')
 if origin and urlparse(origin).netloc.lower()!=request.headers.get('host','').lower():raise HTTPException(403,'Origen no permitido')
def auth(request,permission=None):
 if request.method not in ('GET','HEAD'):mutation(request)
 with store.connect() as db:
  row=db.execute('SELECT u.*,r.permissions,r.name role_name FROM sessions s JOIN users u ON u.id=s.user_id JOIN roles r ON r.id=u.role WHERE s.token_hash=? AND s.expires>? AND u.active=1',(store.token_hash(request.cookies.get('session','')),time.time())).fetchone()
 if not row:raise HTTPException(401,'Inicia sesión para continuar')
 user=dict(row);user['permissions']=json.loads(user['permissions'])
 if permission and permission not in user['permissions']:raise HTTPException(403,'No tienes permiso para esta acción')
 return user
class Login(BaseModel):
 username:str=Field(max_length=100)
 password:str=Field(max_length=200)
class Event(BaseModel):
 station:str='PC08'
 defect:str
 owner_id:int|None=None
class UserCreate(BaseModel):
 username:str=Field(min_length=1,max_length=80)
 display_name:str=Field(min_length=1,max_length=100)
 password:str=Field(min_length=12,max_length=200)
 role:str
class UserUpdate(BaseModel):
 role:str|None=None
 active:bool|None=None
 password:str|None=Field(default=None,min_length=12,max_length=200)
class RoleUpdate(BaseModel):
 name:str=Field(min_length=1,max_length=100)
 permissions:list[str]
class Review(BaseModel):
 status:str
class Settings(BaseModel):
 demo_enabled:bool
@router.get('/')
def home():return FileResponse(Path(__file__).parent/'static/index.html')
@router.post('/ui/login')
def login(data:Login,request:Request):
 mutation(request);ip=request.client.host;now=time.time()
 attempts[ip]=[t for t in attempts.get(ip,[]) if now-t<60]
 if len(attempts[ip])>=10:raise HTTPException(429,'Espera un minuto antes de reintentar')
 with store.connect() as db:
  user=db.execute('SELECT * FROM users WHERE username=?',(data.username,)).fetchone()
  if not user or not user['active'] or not store.verify(data.password,user['password_hash']):
   attempts[ip].append(now);raise HTTPException(401,'Usuario o contraseña incorrectos')
  if store.PH.check_needs_rehash(user['password_hash']):db.execute('UPDATE users SET password_hash=? WHERE id=?',(store.PH.hash(data.password),user['id']))
  attempts.pop(ip,None);token=secrets.token_urlsafe(32)
  db.execute('DELETE FROM sessions WHERE expires<?',(now,))
  db.execute('DELETE FROM sessions WHERE token_hash=?',(store.token_hash(request.cookies.get('session','')),))
  db.execute('INSERT INTO sessions VALUES(?,?,?)',(store.token_hash(token),user['id'],now+8*3600));store.audit(db,user['id'],'login')
 response=JSONResponse({'user':user['username']})
 response.set_cookie('session',token,httponly=True,samesite='strict',secure=request.headers.get('x-forwarded-proto',request.url.scheme)=='https',max_age=8*3600)
 return response
@router.post('/ui/logout')
def logout(request:Request):
 user=auth(request)
 with store.connect() as db:
  db.execute('DELETE FROM sessions WHERE token_hash=?',(store.token_hash(request.cookies.get('session','')),));store.audit(db,user['id'],'logout')
 response=JSONResponse({'ok':True});response.delete_cookie('session');return response
@router.get('/ui/session')
def session(request:Request):
 user=auth(request)
 return {'user':user['username'],'account':store.public_user(user),'role_name':user['role_name'],'permissions':user['permissions'],'defects':DEFECTS}
def scope(request,user,pc08=False):
 q=request.query_params;station=q.get('station') or 'PC08'
 if station not in DEFECTS or (pc08 and station!='PC08'):raise HTTPException(422,'Estación fuera del alcance de este recurso')
 if not ({'read_own','read_pc08'} & set(user['permissions'])):raise HTTPException(403,'Sin permiso de lectura')
 clauses=['e.station=?'];args=[station]
 global_scope='read_pc08' in user['permissions'] and station=='PC08'
 if not global_scope:clauses.append('e.owner_id=?');args.append(user['id'])
 owner=q.get('owner_id','');role=q.get('role','')
 if owner:
  try:owner=int(owner)
  except ValueError:raise HTTPException(422,'Usuario inválido')
  if not global_scope and owner!=user['id']:raise HTTPException(403,'Ámbito de usuario no autorizado')
  clauses.append('e.owner_id=?');args.append(owner)
 if role:
  if not global_scope and role!=user['role']:raise HTTPException(403,'Ámbito de puesto no autorizado')
  clauses.append('u.role=?');args.append(role)
 for key,op in [('date','='),('date_from','>='),('date_to','<=')]:
  value=q.get(key,'')
  if value:
   try:date.fromisoformat(value)
   except ValueError:raise HTTPException(422,'Fecha inválida')
   clauses.append('substr(e.stamp,1,10)'+op+'?');args.append(value)
 if q.get('date_from') and q.get('date_to') and q['date_from']>q['date_to']:raise HTTPException(422,'Rango de fechas inválido')
 for key,column,allowed in [('defect','e.defect',['Sin defecto']+DEFECTS[station]),('review_status','e.review_status',['pending','confirmed','dismissed'])]:
  value=q.get(key,'')
  if value:
   if value not in allowed:raise HTTPException(422,'Filtro inválido')
   clauses.append(column+'=?');args.append(value)
 return ' WHERE '+' AND '.join(clauses),args
def query_events(db,where,args,limit=None):
 sql='SELECT e.*,u.display_name owner_name,u.role owner_role FROM events e LEFT JOIN users u ON u.id=e.owner_id'+where+' ORDER BY e.id DESC'
 if limit:sql+=' LIMIT '+str(limit)
 return [dict(r) for r in db.execute(sql,args)]
@router.get('/ui/events')
def events(request:Request):
 user=auth(request);where,args=scope(request,user)
 with store.connect() as db:
  rows=query_events(db,where,args,500)
  summary=dict(db.execute("SELECT COUNT(*) total,COALESCE(SUM(e.verdict='OK'),0) ok,COALESCE(SUM(e.verdict='Defecto'),0) defects FROM events e LEFT JOIN users u ON u.id=e.owner_id"+where,args).fetchone())
 return {'events':rows,'summary':summary,'limit':500}
@router.post('/ui/simulate')
def simulate(data:Event,request:Request):
 user=auth(request,'simulate')
 if data.station not in DEFECTS or data.defect not in ['Sin defecto']+DEFECTS[data.station]:raise HTTPException(422,'Estación o defecto inválido')
 owner=data.owner_id or user['id']
 if owner!=user['id'] and not ('read_pc08' in user['permissions'] and data.station=='PC08'):raise HTTPException(403,'Asignación no autorizada')
 with store.connect() as db:
  if db.execute("SELECT value FROM settings WHERE key='demo_enabled'").fetchone()[0]!='true':raise HTTPException(403,'Generación de demostración pausada por administración')
  if not db.execute('SELECT id FROM users WHERE id=? AND active=1',(owner,)).fetchone():raise HTTPException(422,'Usuario inactivo o inexistente')
  c=db.execute('INSERT INTO events(station,defect,verdict,confidence,stamp,owner_id,origin,review_status,legacy) VALUES(?,?,?,?,?,?,?, ?,0)',(data.station,data.defect,'OK' if data.defect=='Sin defecto' else 'Defecto',random.randint(870,990)/10,datetime.now(TZ).isoformat(timespec='seconds'),owner,'SIMULADO','pending'))
  db.execute('UPDATE events SET image_id=? WHERE id=?',(f'SIM-{c.lastrowid:04d}',c.lastrowid));store.audit(db,user['id'],'event.simulate',c.lastrowid)
  return dict(db.execute('SELECT * FROM events WHERE id=?',(c.lastrowid,)).fetchone())
@router.get('/ui/export')
def export(request:Request):
 user=auth(request,'export');where,args=scope(request,user)
 with store.connect() as db:rows=query_events(db,where,args);store.audit(db,user['id'],'events.export')
 buf=io.StringIO();w=csv.writer(buf);keys=['id','stamp','station','verdict','defect','confidence','image_id','origin','owner_name','review_status']
 w.writerow(keys)
 for row in rows:
  vals=[str(row.get(k) or '') for k in keys];w.writerow(["'"+v if v.startswith(('=','+','-','@','\t','\r')) else v for v in vals])
 return Response('\ufeff'+buf.getvalue(),media_type='text/csv',headers={'Content-Disposition':'attachment; filename="pimientero-simulado.csv"'})
@router.get('/ui/stats')
def stats(request:Request):
 user=auth(request)
 if not ({'stats_own','stats_pc08'} & set(user['permissions'])):raise HTTPException(403,'Sin acceso a estadísticas')
 scope_user=dict(user)
 if 'stats_pc08' not in user['permissions']:scope_user['permissions']=[p for p in user['permissions'] if p!='read_pc08']
 where,args=scope(request,scope_user,pc08=True)
 with store.connect() as db:rows=query_events(db,where,args)
 defects={};days={};owners={};today=datetime.now(TZ).date().isoformat()
 for r in rows:
  day=r['stamp'][:10];d=days.setdefault(day,{'date':day,'total':0,'defects':0});d['total']+=1;d['defects']+=r['verdict']=='Defecto'
  if r['verdict']=='Defecto':defects[r['defect']]=defects.get(r['defect'],0)+1
  if r['owner_id'] is not None:
   o=owners.setdefault(r['owner_id'],{'id':r['owner_id'],'name':r['owner_name'],'total':0,'defects':0});o['total']+=1;o['defects']+=r['verdict']=='Defecto'
 bad=sum(r['verdict']=='Defecto' for r in rows)
 return {'origin':'SIMULADO','scope':'PC08 global' if 'stats_pc08' in user['permissions'] else 'PC08 propio','total':len(rows),'ok':len(rows)-bad,'defects':bad,'rejection_pct':round(100*bad/len(rows),1) if rows else None,'pending':sum(r['review_status']=='pending' for r in rows),'today':days.get(today,{'date':today,'total':0,'defects':0}),'by_defect':[{'defect':k,'count':v} for k,v in sorted(defects.items(),key=lambda x:(-x[1],x[0]))],'daily':[days[k] for k in sorted(days)],'by_owner':list(owners.values()) if 'stats_pc08' in user['permissions'] and len(owners)>=2 else [],'comparison_note':'Comparación de registros sintéticos asignados; no mide productividad. Requiere al menos dos usuarios con datos.'}
@router.get('/ui/operators')
def operators(request:Request):
 user=auth(request,'read_pc08')
 with store.connect() as db:return [dict(r) for r in db.execute('SELECT id,display_name,role FROM users WHERE active=1 ORDER BY display_name')]
@router.post('/ui/events/{event_id}/review')
def review(event_id:int,data:Review,request:Request):
 user=auth(request,'review')
 if data.status not in ('pending','confirmed','dismissed'):raise HTTPException(422,'Estado inválido')
 with store.connect() as db:
  row=db.execute('SELECT station FROM events WHERE id=?',(event_id,)).fetchone()
  if not row:raise HTTPException(404,'Evento inexistente')
  if row['station']!='PC08':raise HTTPException(403,'Solo revisión PC08')
  db.execute('UPDATE events SET review_status=? WHERE id=?',(data.status,event_id));store.audit(db,user['id'],'event.review.'+data.status,event_id)
 return {'ok':True}
@router.get('/ui/admin/users')
def users(request:Request):
 auth(request,'users')
 with store.connect() as db:return [store.public_user(r) for r in db.execute('SELECT * FROM users ORDER BY id')]
@router.post('/ui/admin/users')
def add_user(data:UserCreate,request:Request):
 actor=auth(request,'users')
 try:
  with store.connect() as db:uid=store.create_user(db,data.username,data.display_name,data.password,data.role,actor['id'])
 except (ValueError,sqlite3.IntegrityError):raise HTTPException(422,'Usuario duplicado, rol o datos inválidos')
 return {'id':uid}
@router.post('/ui/admin/users/{uid}')
def update_user(uid:int,data:UserUpdate,request:Request):
 actor=auth(request,'users')
 with store.connect() as db:
  row=db.execute('SELECT * FROM users WHERE id=?',(uid,)).fetchone()
  if not row:raise HTTPException(404,'Usuario inexistente')
  if data.role and not db.execute('SELECT id FROM roles WHERE id=?',(data.role,)).fetchone():raise HTTPException(422,'Rol inválido')
  if row['role']=='admin' and row['active'] and (data.active is False or data.role not in (None,'admin')) and db.execute("SELECT COUNT(*) FROM users WHERE role='admin' AND active=1").fetchone()[0]<=1:raise HTTPException(409,'Conserva al menos un administrador activo')
  if data.role:db.execute('UPDATE users SET role=? WHERE id=?',(data.role,uid));store.audit(db,actor['id'],'user.role',uid)
  if data.active is not None:db.execute('UPDATE users SET active=? WHERE id=?',(int(data.active),uid));store.audit(db,actor['id'],'user.active',uid)
  if data.password:db.execute('UPDATE users SET password_hash=? WHERE id=?',(store.PH.hash(data.password),uid));store.audit(db,actor['id'],'user.password_reset',uid)
  db.execute('DELETE FROM sessions WHERE user_id=?',(uid,))
 return {'ok':True}
@router.get('/ui/admin/roles')
def roles(request:Request):
 auth(request,'roles')
 with store.connect() as db:return {'roles':[{'id':r['id'],'name':r['name'],'permissions':json.loads(r['permissions'])} for r in db.execute('SELECT * FROM roles')],'available_permissions':sorted(store.PERMISSIONS)}
@router.post('/ui/admin/roles/{role}')
def update_role(role:str,data:RoleUpdate,request:Request):
 actor=auth(request,'roles')
 if not set(data.permissions)<=store.PERMISSIONS:raise HTTPException(422,'Permisos inválidos')
 if role=='admin' and not {'users','roles','audit','settings'}<=set(data.permissions):raise HTTPException(409,'No retires capacidades de recuperación al administrador')
 with store.connect() as db:
  if not db.execute('SELECT id FROM roles WHERE id=?',(role,)).fetchone():raise HTTPException(404,'Rol inexistente')
  db.execute('UPDATE roles SET name=?,permissions=? WHERE id=?',(data.name,json.dumps(sorted(set(data.permissions))),role));store.audit(db,actor['id'],'role.update',role)
 return {'ok':True}
@router.get('/ui/admin/audit')
def audit_log(request:Request):
 auth(request,'audit')
 with store.connect() as db:return [dict(r) for r in db.execute('SELECT a.*,u.username FROM audit a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 200')]
@router.get('/ui/admin/settings')
def settings(request:Request):
 auth(request,'settings')
 with store.connect() as db:return {'demo_enabled':db.execute("SELECT value FROM settings WHERE key='demo_enabled'").fetchone()[0]=='true'}
@router.post('/ui/admin/settings')
def set_settings(data:Settings,request:Request):
 user=auth(request,'settings')
 with store.connect() as db:db.execute("UPDATE settings SET value=? WHERE key='demo_enabled'",('true' if data.demo_enabled else 'false',));store.audit(db,user['id'],'settings.demo_enabled')
 return {'ok':True}
