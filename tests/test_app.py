import os
import tempfile
from pathlib import Path
os.environ['API_TOKEN'] = 'test-only-token'
os.environ['UI_PASSWORD'] = 'test-only-password'
os.environ['DB_PATH'] = str(Path(tempfile.mkdtemp())/'test.sqlite3')
from fastapi.testclient import TestClient
from app.api import app as api
from app.ui import app as ui

def test_api_contract():
    client=TestClient(api)
    assert {r.path for r in api.routes} == {'/health','/info'}
    assert client.get('/health').json() == {'status':'ok'}
    for headers in ({},{'Authorization':'Bearer wrong'},{'Authorization':'Basic test-only-token'}):
        r=client.get('/info',headers=headers)
        assert r.status_code == 401
        assert r.headers['www-authenticate']=='Bearer'
    r=client.get('/info',headers={'Authorization':'Bearer test-only-token'})
    assert r.status_code==200
    assert set(r.json()) == {'equipo','estacion','version','timestamp'}
    assert r.json()['estacion']=='PC08'
    assert client.get('/docs').status_code==404

def login(client):
    return client.post('/ui/login',json={'username':'pimientero','password':'test-only-password'},headers={'X-Demo-Request':'1'})

def test_ui_access_filters_and_persistence():
    with TestClient(ui) as client:
        assert client.get('/ui/events').status_code==401
        assert client.post('/ui/login',json={'username':'pimientero','password':'incorrecta'},headers={'X-Demo-Request':'1'}).status_code==401
        assert login(client).status_code==200
        assert 'httponly' in login(client).headers['set-cookie'].lower()
        assert client.get('/ui/session').status_code==200
        assert client.post('/ui/simulate',json={'station':'PC08','defect':'Golpes'}).status_code==403
        h={'X-Demo-Request':'1'}
        assert client.post('/ui/simulate',json={'station':'PC08','defect':'Desface de cacha'},headers=h).status_code==422
        event=client.post('/ui/simulate',json={'station':'PC08','defect':'Golpes'},headers=h).json()
        rows=client.get('/ui/events',params={'station':'PC08','defect':'Golpes','date':event['stamp'][:10]}).json()['events']
        assert rows and all(x['station']=='PC08' and x['defect']=='Golpes' for x in rows)
        assert client.get('/ui/events?date=2000-01-01').json()['events']==[]
        for station in ('PC10','PC12'):
            # Explicit demo events; the new app never seeds hidden statistics.
            client.post('/ui/simulate',json={'station':station,'defect':'Desface de cacha'},headers=h)
            rows=client.get('/ui/events',params={'station':station,'defect':'Desface de cacha'}).json()['events']
            assert rows and all(r['station']==station for r in rows)
        assert client.post('/ui/logout',headers=h).status_code==200
        assert client.get('/ui/events').status_code==401
    with TestClient(ui) as client:
        login(client)
        assert any(x['id']==event['id'] for x in client.get('/ui/events?station=PC08').json()['events'])

def test_proxy_preserves_authorization(monkeypatch):
    import httpx
    from app import ui as module
    captured=[]
    class MockClient:
        def __init__(self,**kwargs):pass
        async def __aenter__(self):return self
        async def __aexit__(self,*args):pass
        async def get(self,url,headers):
            captured.append(headers['Authorization'])
            with TestClient(api) as backend:
                return backend.get('/info',headers=headers)
    monkeypatch.setattr(module.httpx,'AsyncClient',MockClient)
    with TestClient(ui) as client:
        assert client.get('/info').status_code==401
        assert client.get('/info',headers={'Authorization':'Bearer test-only-token'}).status_code==200
    assert captured==['','Bearer test-only-token']
