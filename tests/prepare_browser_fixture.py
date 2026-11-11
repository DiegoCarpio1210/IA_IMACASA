"""Explicit isolated browser-test fixture. Never targets the operational database."""
import argparse,os,secrets,json,sys
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--directory',required=True);args=parser.parse_args()
folder=Path(args.directory).resolve();folder.mkdir(parents=True,exist_ok=True)
dbpath=folder/'browser-test.sqlite3';accountsfile=folder/'browser-accounts.json'
if dbpath.exists() or accountsfile.exists():parser.error('Choose a NEW empty directory; no existing database is overwritten')
os.environ.pop('UI_PASSWORD',None);os.environ['DB_PATH']=str(dbpath)
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import store
store.migrate();accounts={}
with store.connect() as db:
 for role in store.ROLES:
  password=secrets.token_urlsafe(24);uid=store.create_user(db,role,role.title()+' de demo',password,role);accounts[role]={'id':uid,'password':password}
 for day in ['2026-11-08','2026-11-09','2026-11-10']:
  for role in ['herrero','pulidor']:
   for n,defect in enumerate(['Sin defecto','Golpes','Poros']):
    c=db.execute('INSERT INTO events(station,defect,verdict,confidence,stamp,owner_id,origin,review_status) VALUES(?,?,?,?,?,?,?,?)',('PC08',defect,'OK' if n==0 else 'Defecto',90+n,day+'T08:00:00-06:00',accounts[role]['id'],'SIMULADO','pending'))
    db.execute('UPDATE events SET image_id=? WHERE id=?',(f'SIM-{c.lastrowid:04d}',c.lastrowid))
accountsfile.write_text(json.dumps(accounts),encoding='utf8')
try:accountsfile.chmod(0o600)
except OSError:pass
print('Created isolated fixture: 18 synthetic events. Private credentials file must not be committed.')
