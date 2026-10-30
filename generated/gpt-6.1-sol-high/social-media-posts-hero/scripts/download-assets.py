from pathlib import Path
import re,subprocess,concurrent.futures,json
urls=re.findall(r'https://\S+',Path('PROMPT.md').read_text())
def get(pair):
 i,u=pair; dest='public/bg.jpeg' if '.jpeg' in u else f'public/media/card-{i}.mp4'
 result=subprocess.run(['curl','-fL','--retry','2','--connect-timeout','15','--max-time','120','-o',dest,u],capture_output=True,text=True)
 return dict(url=u,path=dest,ok=result.returncode==0,bytes=Path(dest).stat().st_size if Path(dest).exists() else 0,error=result.stderr[-400:] if result.returncode else None)
r=list(concurrent.futures.ThreadPoolExecutor(7).map(get,enumerate(urls)))
Path('asset-report.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
