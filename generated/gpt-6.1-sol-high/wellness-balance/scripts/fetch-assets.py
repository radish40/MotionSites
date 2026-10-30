import re,subprocess,concurrent.futures,json
urls=list(dict.fromkeys(re.findall(r'https://[^\s`]+',open('PROMPT.md').read())))
names=['background.webp','avatar.png','capsule.png','product.png','botanical.png','community.png']
def fetch(p):
 n,u=p
 r=subprocess.run(['curl','-L','--fail','--retry','2','--max-time','60',u,'-o','public/assets/'+n],capture_output=True)
 return {'file':n,'source':u,'success':r.returncode==0,'error':r.stderr.decode()[-500:] if r.returncode else None}
r=list(concurrent.futures.ThreadPoolExecutor().map(fetch,zip(names,urls)))
open('asset-sources.json','w').write(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
