"""Check a CLEAN publication directory; never prints matched secret values.
Requires pypdf only when scanning PDFs. Review screenshots visually as well.
"""
import argparse,re,json,zipfile,xml.etree.ElementTree as ET
from pathlib import Path

def inspect(root,secrets=()):
 findings=[];count=0
 for p in sorted(root.rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(root).as_posix();count+=1
  forbidden=(p.name=='.env' or (p.name.startswith('.env.') and p.name!='.env.example') or any(x in p.parts for x in ['.git','__pycache__','node_modules','private','backups','.venv','datos-locales']) or re.search(r'\.(sqlite3?|db)(-|$)',p.name) or p.name.endswith(('-wal','-shm','.pyc','.log')) or p.name=='browser-accounts.json')
  if forbidden:findings.append({'path':rel,'reason':'forbidden file'})
  blobs=[p.read_bytes()]
  if p.suffix=='.docx':
   with zipfile.ZipFile(p) as z:
    for name in z.namelist():
     b=z.read(name);blobs.append(b)
     if name.endswith('.xml'):
      try:blobs.append(''.join(ET.fromstring(b).itertext()).encode())
      except ET.ParseError:pass
  elif p.suffix=='.pdf':
   from pypdf import PdfReader
   doc=PdfReader(p);blobs.append('\n'.join(page.extract_text() or '' for page in doc.pages).encode());blobs.append(str(doc.metadata).encode())
  for b in blobs:
   if any(s and s.encode() in b for s in secrets):findings.append({'path':rel,'reason':'known local secret'});break
   if re.search(rb'gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----',b):findings.append({'path':rel,'reason':'credential pattern'});break
 return {'files_checked':count,'findings':findings}

def main():
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path);p.add_argument('--private-env',type=Path);a=p.parse_args();secrets=[]
 if a.private_env:
  for line in a.private_env.read_text().splitlines():
   if '=' in line:
    key,value=line.split('=',1)
    if any(x in key for x in ['TOKEN','PASSWORD','SECRET']) and value:secrets.append(value)
 result=inspect(a.directory,secrets);print(json.dumps(result,indent=2));raise SystemExit(bool(result['findings']))
if __name__=='__main__':main()
