from pathlib import Path
import re,json,subprocess,concurrent.futures
s=Path('PROMPT.md').read_text()
urls=list(dict.fromkeys(re.findall(r'https://[^\s\'"<>]+(?:\.mp4|\.svg)',s)))
def fetch(u):
 name=u.rsplit('/',1)[1]; dest=Path('public/assets',name)
 r=subprocess.run(['curl','-fLsS','--connect-timeout','10','--max-time','120',u,'-o',str(dest)],capture_output=True,text=True)
 return {'url':u,'file':name,'bytes':dest.stat().st_size if dest.exists() else 0,'error':r.stderr if r.returncode else None}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(fetch,urls))
Path('asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2),flush=True)
for r in results:
 if not r['error']:
  p=Path('src/app.tsx'); p.write_text(p.read_text().replace(r['url'],'./assets/'+r['file']))
u='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@300;400;500;600;700;800&family=Mr+Dafoe&display=swap'
r=subprocess.run(['curl','-fLsS','--max-time','30',u],capture_output=True,text=True)
if r.returncode: print(r.stderr); raise SystemExit(1)
css=r.stdout
for i,u in enumerate(dict.fromkeys(re.findall(r'url\((https://[^)]+)\)',css))):
 name='font-'+str(i)+'.'+u.split('.')[-1]
 subprocess.run(['curl','-fLsS','--max-time','30',u,'-o','public/assets/'+name],check=True)
 css=css.replace(u,'./'+name)
Path('public/assets/fonts.css').write_text(css)
p=Path('src/index.html'); h=p.read_text()
h=re.sub(r'<link rel="preconnect"[^>]*>\s*','',h)
h=re.sub(r'<link href="https://fonts.googleapis.com/[^>]+>','<link rel="stylesheet" href="./assets/fonts.css">',h)
p.write_text(h)
print('Fonts bundled',flush=True)
