from check_publication import inspect

def test_publication_rejects_secret_and_database(tmp_path):
    (tmp_path/'README.md').write_text('Public documentation',encoding='utf8')
    assert inspect(tmp_path)['findings']==[]
    secret='example-generated-for-negative-test'
    (tmp_path/'notes.txt').write_text(secret,encoding='utf8')
    (tmp_path/'events.sqlite3').write_bytes(b'not a production database')
    result=inspect(tmp_path,[secret])
    assert {f['reason'] for f in result['findings']}=={'known local secret','forbidden file'}
