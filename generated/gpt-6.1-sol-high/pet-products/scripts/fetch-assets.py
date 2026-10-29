from pathlib import Path
import re, urllib.request, urllib.parse, json, concurrent.futures, subprocess
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
urls=list(dict.fromkeys(re.findall(r'(?:src|href)="(https:[^"]+)"',html)))
urls=[u for u in urls if 'fonts.google' not in u and 'fonts.gstatic' not in u]
names=['avatar.png','dachshund.png','pets.mp4','retriever.png','cat.png','sunset-bowl.webp','mint-bowl.webp','cat-toy.webp','cat-bed.webp']
def fetch(pair):
 url,name=pair
 try:
  result=subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','45',url,'-o',str(root/'assets'/name)],capture_output=True,text=True)
  if result.returncode: raise ValueError(result.stderr)
  data=(root/'assets'/name).read_bytes()
  content='downloaded via curl'
  return {'url':url,'local':'assets/'+name,'status':'ok','bytes':len(data),'content_type':content}
 except Exception as e: return {'url':url,'local':'assets/'+name,'status':'failed','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=9) as pool: results=list(pool.map(fetch,zip(urls,names)))
for r in results:
 print(r)
 if r['status']=='ok': html=html.replace(r['url'],r['local'])
(root/'index.html').write_text(html)
(root/'assets'/'manifest.json').write_text(json.dumps(results,indent=2))
