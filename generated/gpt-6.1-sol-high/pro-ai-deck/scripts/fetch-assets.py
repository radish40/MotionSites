from pathlib import Path
import re,subprocess,concurrent.futures,json
urls=list(dict.fromkeys(re.findall(r'https://[^\s<>"\)]+\.(?:mp4|m3u8)',Path('PROMPT.md').read_text())))
def fetch(u):
 name=u.rsplit('/',1)[1]; dest=Path('public/assets')/name
 cmd=['curl','-fL','--retry','2','--connect-timeout','15','--max-time','120','-sS',u,'-o',str(dest)]
 p=subprocess.run(cmd,capture_output=True,text=True)
 return {'url':u,'file':str(dest),'ok':p.returncode==0,'bytes':dest.stat().st_size if dest.exists() else 0,'error':p.stderr or None}
results=list(concurrent.futures.ThreadPoolExecutor(9).map(fetch,urls));Path('asset-checks-curl.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
