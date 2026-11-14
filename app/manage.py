"""Interactive account setup: no password command-line arguments."""
import argparse,getpass,sqlite3
from . import store
def main():
 p=argparse.ArgumentParser();p.add_argument('command',choices=['init','create-user','reset-password']);p.add_argument('--username');p.add_argument('--name');p.add_argument('--role',choices=list(store.ROLES),default='admin');a=p.parse_args()
 store.migrate()
 if a.command=='init':print('Esquema inicializado; historial conservado.');return
 if not a.username:p.error('--username es obligatorio')
 password=getpass.getpass('Contraseña local (mínimo 12 caracteres): ')
 if password!=getpass.getpass('Repetir contraseña: '):p.error('Las contraseñas no coinciden')
 try:
  with store.connect() as db:
   if a.command=='create-user':store.create_user(db,a.username,a.name or a.username,password,a.role)
   else:
    if not 12<=len(password)<=200:raise ValueError('Longitud inválida')
    row=db.execute('SELECT id FROM users WHERE username=?',(a.username,)).fetchone()
    if not row:raise ValueError('Usuario no encontrado')
    db.execute('UPDATE users SET password_hash=? WHERE id=?',(store.PH.hash(password),row['id']));db.execute('DELETE FROM sessions WHERE user_id=?',(row['id'],));store.audit(db,None,'cli.password_reset',row['id'])
 except (ValueError,sqlite3.IntegrityError) as e:p.error(str(e))
 print('Cuenta actualizada; contraseña no registrada en logs.')
if __name__=='__main__':main()
