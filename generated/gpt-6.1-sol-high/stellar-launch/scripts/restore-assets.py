import pathlib, subprocess, concurrent.futures, json, re
root=pathlib.Path(__file__).resolve().parent.parent
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
files={'hero.mp4':'hf_20260511_151648_2bdfbd1c-6bde-4f5d-a967-f57cbced97f6.mp4','submissions.mp4':'hf_20260514_154120_b89bfedd-530d-4ebb-9eb7-42eeafe08667.mp4','stat-1.png':'hf_20260514_154203_6c6f94dc-a07e-4ba5-8688-106f01ccd2c8.png','stat-2.png':'hf_20260514_154151_45c62c60-3bcc-4f21-8f9d-03722ebb5df8.png','stat-3.png':'hf_20260514_152238_24ec8db4-d728-4739-bb30-e985533e9637.png'}
urls={k:base+v for k,v in files.items()}
urls['firs.woff2']='https://db.onlinewebfonts.com/t/69f2576e7ca287875bf8d089130e292c.woff2'
css=(root/'public/assets/inter.css').read_text()
for weight,url in re.findall(r'font-weight: (\d+);.*?url\((.*?)\)',css,re.S):urls['inter-'+weight+'.ttf']=url

def fetch(item):
 name,url=item; dest=root/'public/assets'/name
 p=subprocess.run(['curl','-fL','--max-time','90','--retry','2','-sS',url,'-o',str(dest)],capture_output=True,text=True)
 return {'file':name,'source':url,'status':'downloaded' if p.returncode==0 else 'failed','bytes':dest.stat().st_size if dest.exists() else 0,'error':p.stderr}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:r=list(pool.map(fetch,urls.items()))
(root/'asset-report.json').write_text(json.dumps(r,indent=2)); print(json.dumps(r,indent=2))
