import concurrent.futures, urllib.request, json, subprocess
from pathlib import Path
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
files={
'hero.mp4':'hf_20260511_142713_322c5ac5-8a5d-413b-be68-4a0e82014264.mp4',
'sweet.mp4':'hf_20260511_151802_1bbf9a81-a7cb-4be1-b858-f1cd92b62b96.mp4',
'wild.mp4':'hf_20260511_151818_65bb22c5-33ae-4e23-85ea-0a3dd89957c2.mp4',
'fresh.webp':'hf_20260511_143221_81001e13-b71c-4a90-b2d7-abf4e2ec08ff.png',
'sweet.webp':'hf_20260511_151640_5b4a7bf8-4eb2-4a49-aa63-17a9bb642b88.png',
'wild.webp':'hf_20260511_151621_4fba6892-ed21-4c2e-8cb3-0bd2ec2abefa.png'}
def fetch(item):
 name,remote=item
 url=base+remote
 if name.endswith('webp'): url='https://images.higgs.ai/?default=1&output=webp&url='+urllib.parse.quote(url,safe='')+'&w=1280&q=85'
 try:
  subprocess.run(['curl','-fL','--retry','2','--max-time','90',url,'-o','public/assets/'+name],check=True,capture_output=True)
  data=Path('public/assets/'+name).read_bytes()
  return dict(file=name,url=url,bytes=len(data),status='ok')
 except Exception as e: return dict(file=name,url=url,status='failed',error=str(e))
import urllib.parse
results=list(concurrent.futures.ThreadPoolExecutor().map(fetch,files.items()))
Path('asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
