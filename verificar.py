"""Prueba la API local o pública; nunca imprime el token."""
import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime

def check(base, path, token=None):
    request = urllib.request.Request(base.rstrip('/')+path)
    if token:
        request.add_header('Authorization', 'Bearer '+token)
    try:
        response = urllib.request.urlopen(request, timeout=20)
    except urllib.error.HTTPError as e:
        response = e
    with response:
        raw = response.read().decode()
        print(f'GET {path} | HTTP {response.status}\n{raw}\n')
        return response.status, json.loads(raw)

parser = argparse.ArgumentParser()
parser.add_argument('url', nargs='?', default='http://localhost:8080')
args = parser.parse_args()
token = os.environ.get('API_TOKEN', '')
env = Path(__file__).with_name('.env')
if not token and env.exists():
    token = next((line.split('=',1)[1] for line in env.read_text().splitlines() if line.startswith('API_TOKEN=')), '')
if not token:
    sys.exit('Falta API_TOKEN. Ejecuta preparar.ps1 o configura la variable de entorno.')
code, body = check(args.url, '/health')
assert code == 200 and body == {'status':'ok'}
assert check(args.url, '/info')[0] == 401
assert check(args.url, '/info', 'token-incorrecto')[0] == 401
code, body = check(args.url, '/info', token)
assert code == 200 and {'equipo','estacion','version','timestamp'} <= body.keys()
assert body['estacion'] == 'PC08'
assert datetime.fromisoformat(body['timestamp']).tzinfo is not None
print('APROBADO: health 200, info sin token 401, token incorrecto 401, token valido 200.')
