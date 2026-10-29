import re,json,concurrent.futures,subprocess,pathlib
s=pathlib.Path('PROMPT.md').read_text()
urls=list(dict.fromkeys(re.findall(r'https://[^`\s<>]+',s)))
urls=[u for u in urls if '.mp4' in u or '.png' in u or 'images.higgs.ai/' in u]
def fetch(pair):
 i,u=pair
 name=('hero.mp4' if '.mp4' in u else u.rsplit('/',1)[-1] if 'figma.site' in u else 'product-'+str(sum('images.higgs.ai' in x for x in urls[:i+1]))+'.webp')
 result=subprocess.run(['curl','-fL','--retry','1','--connect-timeout','15','--max-time','90','-sS',u,'-o','public/assets/'+name],capture_output=True,text=True)
 path=pathlib.Path('public/assets/'+name)
 return dict(url=u,file='assets/'+name,status='ok' if result.returncode==0 else 'failed',bytes=path.stat().st_size if path.exists() else 0,error=result.stderr.strip())
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:results=list(ex.map(fetch,enumerate(urls)))
pathlib.Path('asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
