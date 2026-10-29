import concurrent.futures, json, pathlib, re, subprocess
root=pathlib.Path(__file__).resolve().parent.parent
html=(root/'PROMPT.md').read_text()
urls=sorted(set(re.findall(r'https://[^" <>]+',html)))
urls=[u for u in urls if '.mp4' in u or '.png' in u or 'style.css' in u]
def download(url):
    name=url.rsplit('/',1)[-1]
    if name=='style.css': name='phosphor.css'
    try:
        subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','60',url,'-o',str(root/'assets'/name)],check=True,capture_output=True)
        data=(root/'assets'/name).read_bytes()
        return {'url':url,'local':'assets/'+name,'bytes':len(data),'status':'ok'}
    except Exception as e: return {'url':url,'status':'failed','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=9) as pool: results=list(pool.map(download,urls))
(root/'assets/manifest.json').write_text(json.dumps(results,indent=2))
for r in results: print(json.dumps(r))
