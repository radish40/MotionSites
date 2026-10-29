import re,subprocess,concurrent.futures,pathlib,json
s=pathlib.Path('PROMPT.md').read_text(); urls=re.findall(r'`(https://[^`]+)`',s)
def download(pair):
 i,u=pair; name=('left.mp4' if i==0 else 'right.mp4') if i<2 else f'gallery-{i-1:02}.webp'; target='public/assets/'+name
 r=subprocess.run(['curl','-fL','--retry','2','--max-time','45','-o',target,u],capture_output=True)
 return {'file':name,'url':u,'status':'ok' if r.returncode==0 else 'failed','bytes':pathlib.Path(target).stat().st_size if pathlib.Path(target).exists() else 0,'error':r.stderr.decode()[-300:] if r.returncode else None}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as p: results=list(p.map(download,enumerate(urls)))
pathlib.Path('asset-report.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
