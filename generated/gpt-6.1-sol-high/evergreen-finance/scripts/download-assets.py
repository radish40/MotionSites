import concurrent.futures, subprocess, json, urllib.parse
from pathlib import Path
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
items={'hero.mp4':base+'hf_20260517_070729_32a7eb4e-d6e2-4571-badc-91b4dab1ecbe.mp4','testimonial.mp4':base+'hf_20260517_074029_c7a854bd-2d6e-4b62-96b3-ae8c16311e44.mp4'}
for name,file in [('budget','hf_20260517_061249_f20dfeda-1033-45ce-a3ee-070965599cbf.png'),('security','hf_20260517_061305_db631f5f-185f-4fda-a7a8-1dd7359ef2ea.png'),('wealth','hf_20260517_061316_50e651f8-02d0-4add-9ddb-7d81d15ac02e.png')]:
 items[name+'.webp']='https://images.higgs.ai/?default=1&output=webp&url='+urllib.parse.quote(base+file,safe='')+'&w=1280&q=85'
for name,h in [('light','53077f9a3eee9c479d37d6af20394ded'),('medium','5ade3423145f3b9f7031574333ca0b73')]:
 items['cooper-'+name+'.woff2']='https://db.onlinewebfonts.com/t/'+h+'.woff2'
def fetch(item):
 name,url=item
 proc=subprocess.run(['curl','-fLsS','--max-time','120','--retry','2','-o','public/assets/'+name,url],capture_output=True,text=True)
 return {'file':name,'url':url,'status':'ok' if proc.returncode==0 else proc.stderr,'bytes':Path('public/assets/'+name).stat().st_size if Path('public/assets/'+name).exists() else 0}
results=list(concurrent.futures.ThreadPoolExecutor().map(fetch,items.items()))
Path('asset-report.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
