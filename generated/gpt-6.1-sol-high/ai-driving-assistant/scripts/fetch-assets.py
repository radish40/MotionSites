from pathlib import Path
import subprocess,re,json
p=Path('PROMPT.md').read_text()
assets={
'gsap.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
'ScrollTrigger.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
'driving.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260709_102332_2d8c4e02-313c-4362-aaa7-4c907cfc4f79.mp4',
'fonts.css':'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;500;700&display=swap'}
report=[]
def fetch(name,url):
 subprocess.run(['curl','-fsSL','--retry','2','--max-time','60',url,'-o','assets/'+name],check=True)
 report.append({'file':name,'source':url,'bytes':Path('assets/'+name).stat().st_size})
for name,url in assets.items():
 fetch(name,url)
 p=p.replace(url,'./assets/'+name)
css=Path('assets/fonts.css').read_text()
for i,url in enumerate(dict.fromkeys(re.findall(r'https://[^)]+',css))):
 name='font-'+str(i)+'.'+url.split('.')[-1]
 fetch(name,url)
 css=css.replace(url,'./'+name)
Path('assets/fonts.css').write_text(css)
p=re.sub(r'<link rel="preconnect"[^>]+>\n','',p)
p=p.replace('<title>Auren — Your car. Its mind.</title>', '<title>Auren — Your car. Its mind.</title>\n<link rel="icon" type="image/svg+xml" href="./assets/favicon.svg" />')
Path('index.html').write_text(p)
Path('asset-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
