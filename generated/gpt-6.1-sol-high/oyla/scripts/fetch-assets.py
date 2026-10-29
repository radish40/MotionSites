from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess
import re
root=Path(__file__).resolve().parent.parent/'public/assets'
base='https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/'
assets={
'hero.mp4':base+'hf_20260627_212146_743b92b3-40a3-46cb-988d-7bf716564ec3.mp4',
'craft.mp4':base+'hf_20260628_122130_8b16d300-75cb-49f5-82ce-afd6b79c2d79.mp4',
'obsidian.webp':base+'hf_20260628_144408_92b74dc4-ca69-412a-acfd-304f9b29eb5e_min.webp',
'void.webp':base+'hf_20260628_145142_ed02063b-d983-47d2-b60b-4b4a5a3448bd_min.webp',
'onyx.webp':base+'hf_20260628_144747_f21bc119-e460-45be-a071-851291bd71c5_min.webp',
'shadow.webp':base+'hf_20260627_215521_100b78bd-d24a-4225-b2e8-5bb30d44af73_min.webp',
'gsap.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
'ScrollTrigger.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'}
css=(root/'fonts-google.css').read_text()
for url in set(re.findall(r'https://[^)]+',css)):
    assets[url.rsplit('/',1)[-1]]=url
    css=css.replace(url,'./'+url.rsplit('/',1)[-1])
(root/'fonts.css').write_text(css)
def fetch(pair):
    name,url=pair
    subprocess.run(['curl','-fsSL','--retry','2','--max-time','45',url,'-o',str(root/name)],check=True)
    return name,(root/name).stat().st_size
with ThreadPoolExecutor(max_workers=8) as pool:
    for entry in pool.map(fetch,assets.items()): print(*entry)
