"""SQLite migration, password hashes and configurable demo roles."""
import os, json, sqlite3, hashlib, secrets, time
from pathlib import Path
from contextlib import contextmanager
from datetime import datetime, timezone
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerificationError, InvalidHashError

DB = Path(os.environ.get('DB_PATH', 'events.sqlite3'))
PH = PasswordHasher(type=Type.ID)
PERMISSIONS = {'read_own','read_pc08','simulate','export','stats_own','stats_pc08','review','users','roles','audit','settings'}
ROLES = {
 'herrero': ('Herrero · provisional', ['read_own','simulate','export','stats_own']),
 'pulidor': ('Pulidor · provisional', ['read_own','simulate','export','stats_own']),
 'supervisor': ('Jefe del Área de Cuchillos · provisional', ['read_own','read_pc08','simulate','export','stats_pc08','review']),
 'admin': ('Administrador técnico', ['read_own','simulate','export','users','roles','audit','settings'])
}
def now(): return datetime.now(timezone.utc).isoformat()
@contextmanager
def connect():
 db=sqlite3.connect(DB,timeout=20);db.row_factory=sqlite3.Row
 db.execute('PRAGMA foreign_keys=ON');db.execute('PRAGMA busy_timeout=20000')
 try:
  with db: yield db
 finally: db.close()
def audit(db,actor,action,target=None):
 db.execute('INSERT INTO audit(user_id,action,stamp,target) VALUES(?,?,?,?)',(actor,action,now(),str(target) if target is not None else None))
def public_user(row):
 return {k:row[k] for k in ('id','username','display_name','role','active','created_at')}
def verify(password,encoded):
 try: return PH.verify(encoded,password)
 except (VerificationError,InvalidHashError): return False
def create_user(db,username,display_name,password,role,actor=None):
 if role not in [r['id'] for r in db.execute('SELECT id FROM roles')]: raise ValueError('Rol inválido')
 if len(password)<12 or len(password)>200: raise ValueError('Usa entre 12 y 200 caracteres para la contraseña')
 if not username or len(username)>80 or not all(c.isalnum() or c in '._-@' for c in username): raise ValueError('Nombre de usuario inválido')
 c=db.execute('INSERT INTO users(username,display_name,password_hash,role,active,created_at) VALUES(?,?,?,?,1,?)',(username,display_name,PH.hash(password),role,now()))
 audit(db,actor,'user.create',c.lastrowid);return c.lastrowid
def migrate():
 DB.parent.mkdir(parents=True,exist_ok=True)
 if DB.exists():
  with sqlite3.connect(DB) as source:
   cols={r[1] for r in source.execute('PRAGMA table_info(events)')}
   if cols and 'owner_id' not in cols:
    folder=DB.parent/'backups';folder.mkdir(exist_ok=True)
    with sqlite3.connect(folder/('before-rbac-'+datetime.now().strftime('%Y%m%d-%H%M%S')+'-'+secrets.token_hex(3)+'.sqlite3')) as target: source.backup(target)
 with connect() as db:
  db.execute('BEGIN IMMEDIATE')
  for sql in [
   'CREATE TABLE IF NOT EXISTS roles(id TEXT PRIMARY KEY,name TEXT NOT NULL,permissions TEXT NOT NULL)',
   'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,username TEXT NOT NULL UNIQUE COLLATE NOCASE,display_name TEXT NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL REFERENCES roles(id),active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL)',
   'CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY,station TEXT,defect TEXT,verdict TEXT,confidence REAL,stamp TEXT)',
   'CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),expires REAL NOT NULL)',
   'CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,user_id INTEGER,action TEXT NOT NULL,stamp TEXT NOT NULL,target TEXT)',
   'CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL)',
   'CREATE TABLE IF NOT EXISTS schema_version(version INTEGER PRIMARY KEY,applied_at TEXT NOT NULL)']:
   db.execute(sql)
  for role,(name,permissions) in ROLES.items():db.execute('INSERT OR IGNORE INTO roles VALUES(?,?,?)',(role,name,json.dumps(permissions)))
  cols={r['name'] for r in db.execute('PRAGMA table_info(events)')}
  for name,kind in [('owner_id','INTEGER REFERENCES users(id)'),('image_id','TEXT'),('origin',"TEXT NOT NULL DEFAULT 'SIMULADO'"),('review_status',"TEXT NOT NULL DEFAULT 'pending'"),('legacy','INTEGER NOT NULL DEFAULT 0')]:
   if name not in cols:db.execute(f'ALTER TABLE events ADD COLUMN {name} {kind}')
  db.execute("UPDATE events SET image_id=printf('SIM-%04d',id) WHERE image_id IS NULL")
  if 'owner_id' not in cols:db.execute("UPDATE events SET legacy=1 WHERE station IN ('PC10','PC12')")
  db.execute('CREATE INDEX IF NOT EXISTS idx_events_scope ON events(station,owner_id,stamp)')
  db.execute("INSERT OR IGNORE INTO settings VALUES('demo_enabled','true')")
  db.execute('INSERT OR IGNORE INTO schema_version VALUES(2,?)',(now(),))
  # One-time compatibility import: preserve existing login, never rotate or store plaintext.
  if db.execute('SELECT COUNT(*) FROM users').fetchone()[0]==0 and os.environ.get('UI_PASSWORD'):
   username=os.environ.get('UI_USER','pimientero')
   c=db.execute('INSERT INTO users(username,display_name,password_hash,role,active,created_at) VALUES(?,?,?,?,1,?)',(username,username,PH.hash(os.environ['UI_PASSWORD']),'supervisor',now()))
   audit(db,None,'migration.legacy_login_hashed',c.lastrowid)
def token_hash(token):return hashlib.sha256(token.encode()).hexdigest()
