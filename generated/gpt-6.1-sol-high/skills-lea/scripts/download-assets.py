from pathlib import Path
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
import json, subprocess
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
assets={
'onboarding.mp4':base+'hf_20260706_072800_64c47fd8-8c4a-431c-ab02-d8c84e461474.mp4',
'design.mp4':base+'hf_20260706_092940_b96cc608-4646-48fa-b73d-19be2b96f9c9.mp4',
'programming.mp4':base+'hf_20260706_091634_79fb6336-cd01-4002-b9e5-c20c548c6646.mp4',
'art.mp4':base+'hf_20260706_110013_a8872d8b-6678-48e1-a6ab-db071ac6e5ec.mp4',
'copywriting.mp4':base+'hf_20260706_100911_5fcfc40c-a4be-4900-aca4-82f09b746d51.mp4',
'lesson.mp4':base+'hf_20260706_110653_41933aaf-9ec1-423f-851a-043b3407ef44.mp4',
'background.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260706_013750_18427eb2-0d19-44fd-a5ab-8ee7c40fa18f.png&w=1280&q=85',
'avatar.jpg':'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
'font.css':'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
}
def download(item):
 name,url=item
 try:
  subprocess.run(['curl','-fLsS','--max-time','90','--retry','2','-o',str(Path('public/assets',name)),url],check=True)
  data=Path('public/assets',name).read_bytes()
  return {'name':name,'source':url,'bytes':len(data),'status':'ok'}
 except Exception as e:return {'name':name,'source':url,'status':'failed','error':str(e)}
with ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(download,assets.items()))
Path('asset-manifest.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
