"""Verify a real Compose restart without disclosing credentials or mutating events."""
import json,os,subprocess,time,hashlib
from pathlib import Path
import httpx
root=Path(__file__).resolve().parents[1]
docker=os.environ.get('DOCKER_EXE','docker')
env=dict(line.split('=',1) for line in (root/'.env').read_text().splitlines() if '=' in line and not line.startswith('#'))
base=os.environ.get('TEST_BASE_URL','http://127.0.0.1:8080')
h={'X-Demo-Request':'1'}
def run(*args):
 return subprocess.run([docker,'compose',*args],cwd=root,check=True,capture_output=True,text=True).stdout
script="from app import store; import json,hashlib;\nwith store.connect() as d:\n rows=[dict(r) for r in d.execute('SELECT * FROM events ORDER BY id')];print(json.dumps({'count':len(rows),'digest':hashlib.sha256(json.dumps(rows,sort_keys=True).encode()).hexdigest(),'ids':[r['id'] for r in rows],'hashed_users':all(r[0].startswith('$argon2id$') for r in d.execute('SELECT password_hash FROM users'))}))"
with httpx.Client(base_url=base,timeout=20) as c:
 assert c.post('/ui/login',headers=h,json={'username':env.get('UI_USER','pimientero'),'password':env['UI_PASSWORD']}).status_code==200
 before=json.loads(run('exec','-T','ui','python','-c',script))
 assert before['hashed_users']
 assert c.get('/health').status_code==200 and c.get('/info').status_code==401
 assert c.get('/info',headers={'Authorization':'Bearer '+env['API_TOKEN']}).status_code==200
 filtered=c.get('/ui/events',params={'station':'PC08','date':'2026-11-09','defect':'Golpes'}).json()
 expected=[32,27,26,2]
 assert [r['id'] for r in filtered['events']]==expected
 run('restart','ui')
 for _ in range(30):
  try:
   if c.get('/ui/session').status_code==200:break
  except httpx.HTTPError:pass
  time.sleep(1)
 else:raise AssertionError('Session did not survive restart')
 after=json.loads(run('exec','-T','ui','python','-c',script))
 assert before==after
 assert c.get('/ui/events',params={'station':'PC08','date':'2026-11-09','defect':'Golpes'}).json()==filtered
 c.post('/ui/logout',headers=h)
 print(json.dumps({'result':'PASS','events_preserved':after['count'],'ids_preserved':before['ids']==after['ids'],'all_event_fields_preserved':before['digest']==after['digest'],'session_after_docker_restart':200,'password_hashes':'Argon2id','health':200,'info_anonymous':401,'info_authorized':200,'combined_filter_ids':expected},indent=2))
