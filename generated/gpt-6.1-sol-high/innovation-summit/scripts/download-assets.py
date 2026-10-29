from pathlib import Path
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
import re, subprocess
root=Path('public/assets')
assets={
'home.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260704_080218_722465a5-cef1-4c6b-976a-948823474a8b.mp4',
'dimitris.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260704_082140_91d42552-7cae-4b03-9a4d-f36a29ae93dc.png&w=1280&q=85',
'fiona.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260704_082107_663b204f-717a-49cf-9e97-7632b85a1cfd.png&w=1280&q=85'}
def download(item):
 name,url=item
 try:
  data=subprocess.check_output(['curl','-fsSL','--retry','2','--max-time','90',url])
  (root/name).write_bytes(data)
  print(name,len(data),flush=True)
 except Exception as e: print(name,'FAILED',str(e),flush=True)
with ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(download,assets.items()))
css=[]
for family,url in [('general','https://api.fontshare.com/v2/css?f[]=general-sans@600&display=swap'),('satoshi','https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap'),('google','https://fonts.googleapis.com/css2?family=Archivo:wght@400;500&family=Inter:wght@400;500;600;700&family=Michroma&family=Poppins:wght@500&display=swap')]:
 raw=subprocess.check_output(['curl','-fsSL','--max-time','30',url]).decode()
 for i,block in enumerate(re.findall(r'@font-face\s*\{[^}]+\}',raw)):
  src=re.search(r'url\([\'\"]?([^\)\'\"]+)',block).group(1)
  if src.startswith('//'): src='https:'+src
  ext=src.split('.')[-1]
  name=f'{family}-{i}.{ext}'
  download((name,src))
  block=re.sub(r'src:.*?;',f'src: url("./{name}") format("'+('woff2' if ext=='woff2' else 'truetype')+'");',block,flags=re.S)
  css.append(block)
(root/'fonts.css').write_text('\n'.join(css))
