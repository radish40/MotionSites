import pathlib, re, urllib.parse, subprocess, concurrent.futures, json
root=pathlib.Path(__file__).resolve().parent.parent
urls=re.findall(r'https://images.higgs.ai/[^\s`]+',(root/'PROMPT.md').read_text())
def download(pair):
 i,u=pair
 origin=urllib.parse.parse_qs(urllib.parse.urlparse(u).query)['url'][0]
 target=root/f'public/assets/project-{i+1}.png'
 result=subprocess.run(['curl','-fL','--retry','2','--max-time','40',origin,'-o',str(target)],capture_output=True)
 return {'index':i+1,'specified_url':u,'recovered_from':origin,'method':'download unchanged original PNG from specified proxy URL source','success':result.returncode==0,'bytes':target.stat().st_size if target.exists() else 0,'error':result.stderr.decode()[-300:] if result.returncode else None}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=9).map(download,enumerate(urls)))
(root/'asset-report.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
