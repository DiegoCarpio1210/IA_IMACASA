import secrets, sqlite3, json
import pytest
from fastapi.testclient import TestClient
from app import store,rbac
from app.ui import app
H={'X-Demo-Request':'1'}
@pytest.fixture
def setup(tmp_path,monkeypatch):
 monkeypatch.setattr(store,'DB',tmp_path/'events.sqlite3');monkeypatch.delenv('UI_PASSWORD',raising=False);rbac.attempts.clear();store.migrate()
 accounts={}
 with store.connect() as db:
  for role in ['herrero','pulidor','supervisor','admin']:
   password=secrets.token_urlsafe(20);uid=store.create_user(db,role,role,password,role);accounts[role]=(uid,password)
 return accounts
def client_for(role,accounts):
 c=TestClient(app);r=c.post('/ui/login',json={'username':role,'password':accounts[role][1]},headers=H);assert r.status_code==200;return c
def event(c,defect='Golpes',**kw):return c.post('/ui/simulate',json={'station':'PC08','defect':defect,**kw},headers=H)
def test_hash_login_logout_and_sessions(setup):
 with store.connect() as db:
  for r in db.execute('SELECT password_hash FROM users'):assert r[0].startswith('$argon2id$')
 c=client_for('herrero',setup)
 assert c.get('/ui/session').json()['account']['role']=='herrero'
 assert c.post('/ui/login',json={'username':'herrero','password':'invalid'},headers=H).status_code==401
 assert c.post('/ui/logout',headers=H).status_code==200
 assert c.get('/ui/session').status_code==401
def test_isolation_permissions_and_stats(setup):
 worker=client_for('herrero',setup);other=client_for('pulidor',setup);chief=client_for('supervisor',setup);admin=client_for('admin',setup)
 first=event(worker).json();event(worker,'Sin defecto');event(other,'Poros')
 assert worker.get('/ui/events').json()['summary']['total']==2
 assert other.get('/ui/events').json()['summary']['total']==1
 for role,c in [('herrero',worker),('pulidor',other),('supervisor',chief)]:
  for path in ['/ui/admin/users','/ui/admin/roles','/ui/admin/audit','/ui/admin/settings']:assert c.get(path).status_code==403
 assert admin.get('/ui/stats').status_code==403
 assert worker.get('/ui/events',params={'owner_id':setup['pulidor'][0]}).status_code==403
 assert event(worker,owner_id=setup['pulidor'][0]).status_code==403
 assert worker.post(f"/ui/events/{first['id']}/review",json={'status':'confirmed'},headers=H).status_code==403
 assert chief.post(f"/ui/events/{first['id']}/review",json={'status':'confirmed'},headers=H).status_code==200
 stats=chief.get('/ui/stats').json();assert (stats['total'],stats['ok'],stats['defects'],stats['pending'])==(3,1,2,2)
 assert stats['rejection_pct']==66.7 and len(stats['by_owner'])==2
 assert worker.get('/ui/stats').json()['total']==2
 assert worker.get('/ui/stats').json()['by_owner']==[]
 assert admin.get('/ui/admin/users').status_code==200
 assert all('password_hash' not in u for u in admin.get('/ui/admin/users').json())
def test_filters_csv_and_secondary_scope(setup):
 c=client_for('herrero',setup);chief=client_for('supervisor',setup)
 one=event(c).json();event(c,'Poros');event(c,station='PC10',defect='Mal ajuste')
 params={'station':'PC08','date':one['stamp'][:10],'defect':'Golpes','review_status':'pending'}
 data=c.get('/ui/events',params=params).json();assert [r['id'] for r in data['events']]==[one['id']]
 assert c.get('/ui/stats').json()['total']==2
 assert c.get('/ui/stats?station=PC10').status_code==422
 assert c.get('/ui/events?date_from=2026-11-12&date_to=2026-11-01').status_code==422
 r=c.get('/ui/export',params=params);assert r.status_code==200 and 'Golpes' in r.text and 'Poros' not in r.text and 'SIMULADO' in r.text
 assert chief.get('/ui/events?station=PC10').json()['summary']['total']==0
def test_admin_lifecycle_and_audit(setup):
 admin=client_for('admin',setup);worker=client_for('herrero',setup)
 assert admin.post('/ui/admin/users',json={'username':'nuevo','display_name':'Nuevo','password':secrets.token_urlsafe(20),'role':'pulidor'},headers=H).status_code==200
 assert admin.post(f"/ui/admin/users/{setup['herrero'][0]}",json={'active':False},headers=H).status_code==200
 assert worker.get('/ui/events').status_code==401
 assert admin.post(f"/ui/admin/users/{setup['admin'][0]}",json={'active':False},headers=H).status_code==409
 permissions=['read_own','stats_own','export']
 assert admin.post('/ui/admin/roles/pulidor',json={'name':'Operario provisional','permissions':permissions},headers=H).status_code==200
 assert event(client_for('pulidor',setup)).status_code==403
 assert admin.post('/ui/admin/settings',json={'demo_enabled':False},headers=H).status_code==200
 assert event(client_for('supervisor',setup)).status_code==403
 assert any(r['action']=='user.active' for r in admin.get('/ui/admin/audit').json())
def test_migration_preserves_history_and_restart(tmp_path,monkeypatch):
 path=tmp_path/'old.sqlite3';monkeypatch.setattr(store,'DB',path);monkeypatch.setenv('UI_USER','legacy');pw=secrets.token_urlsafe(18);monkeypatch.setenv('UI_PASSWORD',pw)
 with sqlite3.connect(path) as db:
  db.execute('CREATE TABLE events(id INTEGER PRIMARY KEY,station TEXT,defect TEXT,verdict TEXT,confidence REAL,stamp TEXT)')
  for id,station in [(32,'PC08'),(33,'PC10')]:db.execute('INSERT INTO events VALUES(?,?,?,?,?,?)',(id,station,'Golpes','Defecto',90,'2026-11-09T12:00:00-06:00'))
 with TestClient(app) as c:
  assert c.post('/ui/login',json={'username':'legacy','password':pw},headers=H).status_code==200
  cookie=c.cookies.get('session');assert c.get('/ui/events').json()['events'][0]['id']==32
 with TestClient(app) as c:
  c.cookies.set('session',cookie);assert c.get('/ui/session').status_code==200
  assert c.get('/ui/events').json()['summary']['total']==1
 with store.connect() as db:
  assert db.execute('SELECT COUNT(*) FROM events').fetchone()[0]==2
  r=db.execute('SELECT legacy,owner_id FROM events WHERE id=33').fetchone();assert tuple(r)==(1,None)
 assert len(list((tmp_path/'backups').glob('*.sqlite3')))==1
