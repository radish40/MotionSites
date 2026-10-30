"""Cache Google Fonts and replacement portraits locally; run from project root."""
import concurrent.futures, pathlib, re, urllib.request
assets=pathlib.Path('public/assets')
css=(assets/'google-fonts.css').read_text()
fonts=re.findall(r'https://[^)]+',css)
jobs=[]
for i,url in enumerate(fonts):
 name=f'font-{i}.ttf'
 jobs.append((name,url))
 css=css.replace(url,f'./{name}')
(assets/'fonts.css').write_text(css)
portraits=['photo-1580489944761-15a19d654956','photo-1500648767791-00dcc994a43e','photo-1534528741775-53994a69daeb','photo-1506794778202-cad84cf45f1d','photo-1506794778202-cad84cf45f1d']
portraits[4]='photo-1531123897727-8f129e1688ce'
for i,photo in enumerate(portraits):
 jobs.append((f'avatar-{i+1}.jpg',f'https://images.unsplash.com/{photo}?auto=format&fit=crop&w=96&h=96&q=85'))
def get(job):
 name,url=job
 try:
  data=urllib.request.urlopen(url,timeout=40).read();(assets/name).write_bytes(data);return name,len(data)
 except Exception as e:return name,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 for result in pool.map(get,jobs):print(result,flush=True)
