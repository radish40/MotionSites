from pathlib import Path
import subprocess, concurrent.futures, json, re
root=Path(__file__).resolve().parents[1]
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
files={'hero.mp4':'hf_20260322_013248_a74099a8-be2b-4164-a823-eddd5e149fa1.mp4','about.mp4':'hf_20260322_011532_86f9b93a-2ffc-42fd-8735-12a4c55ab536.mp4','security.png':'hf_20260322_015134_c80a3c98-609e-4526-b79e-94dc96cd34e8.png','building.png':'hf_20260322_014934_6e2804d7-d219-461d-98d5-36140fc90c4c.png','integration.png':'hf_20260322_014626_97cccc38-534a-4c9d-a801-68a449da9d0c.png','support.png':'hf_20260322_014849_570d4eeb-9613-4b19-a084-46c7a2665243.png'}
def download(url,path):
 subprocess.run(['curl','-4','-fLsS','--connect-timeout','10','--max-time','90','--retry','2',url,'-o',str(path)],check=True)
def get(item):
 name,tail=item;url=base+tail;path=root/'public/assets'/name
 try:
  download(url,path);return dict(file=name,url=url,status='downloaded',bytes=path.stat().st_size)
 except Exception as e:return dict(file=name,url=url,status='failed',error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: results=list(ex.map(get,files.items()))
try:
 url='https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'
 path=root/'public/assets/sora.css';download(url,path);css=path.read_text()
 for i,u in enumerate(dict.fromkeys(re.findall(r'url\((.*?)\)',css))):
  name='sora-'+str(i)+('.ttf' if '.ttf' in u else '.woff2');download(u,root/'public/assets'/name);css=css.replace(u,'./'+name)
 path.write_text(css);results.append(dict(file='sora.css',status='downloaded',url=url))
except Exception as e:results.append(dict(file='sora.css',status='failed',error=str(e)))
(root/'asset-report.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
