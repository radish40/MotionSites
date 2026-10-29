from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import re,json,subprocess
p=Path('PROMPT.md').read_text()
urls=list(dict.fromkeys(re.findall(r'https://(?:image\.mux\.com|i\.ibb\.co|pbs\.twimg\.com)/[^"\s]+',p)))
def fetch(item):
 i,url=item
 name=f'portfolio-{i+1:02d}'+('.webp' if 'mux.com' in url else '.jpg')
 if 'twimg' in url:name='viktor-oddy.jpg'
 dest=Path('public/assets',name)
 r=subprocess.run(['curl','-fL','--retry','1','--max-time','45','-sS',url,'-o',str(dest)],capture_output=True,text=True)
 return {'url':url,'local':name,'status':'ok' if r.returncode==0 else 'failed','bytes':dest.stat().st_size if dest.exists() else 0,'error':r.stderr.strip()}
with ThreadPoolExecutor(max_workers=10) as pool: results=list(pool.map(fetch,enumerate(urls)))
js=Path('src/App.jsx').read_text()
for r in results:
 if r['status']=='ok':
  expr='import.meta.env.BASE_URL + "assets/'+r['local']+'"'
  js=js.replace('src="'+r['url']+'"','src={'+expr+'}').replace('"'+r['url']+'"',expr)
Path('src/App.jsx').write_text(js)
fonturl='https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900&family=Fraunces:ital,opsz,wght@1,9..144,100..900&display=swap'
r=subprocess.run(['curl','-fLsS','--max-time','30',fonturl],capture_output=True,text=True)
if r.returncode==0:
 css=r.stdout
 for i,url in enumerate(dict.fromkeys(re.findall(r'https://[^)]+',css))):
  name=f'font-{i}.woff2' if '.woff2' in url else f'font-{i}.ttf'
  fr=subprocess.run(['curl','-fLsS','--max-time','30',url,'-o','public/assets/'+name],capture_output=True,text=True)
  if fr.returncode:raise RuntimeError(fr.stderr)
  css=css.replace(url,'./'+name)
 Path('public/assets/fonts.css').write_text(css)
 results.append({'url':fonturl,'status':'ok','local':'fonts.css'})
else:results.append({'url':fonturl,'status':'failed','error':r.stderr})
Path('asset-report.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
