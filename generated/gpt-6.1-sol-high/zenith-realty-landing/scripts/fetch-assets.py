"""Download only the original Zenith assets, using the supplied image proxy."""
import concurrent.futures, subprocess, urllib.parse
from pathlib import Path
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
files={'aether.webp':'hf_20260503_145701_de344c15-5eac-4c64-8bd6-19a2811bba4a.png','azure.webp':'hf_20260503_145923_c1a9880c-0fab-4a76-8289-bd650d5e5dce.png','summit.webp':'hf_20260503_150022_cdda0eaa-1c17-4f59-8188-4f98b328619f.png','collection.webp':'hf_20260503_150112_2b0e700f-7af4-4459-b326-7d9e2f468daa.png'}
def fetch(item):
 name,remote=item
 url='https://images.higgs.ai/?default=1&output=webp&url='+urllib.parse.quote(base+remote,safe='')+'&w=1280&q=85'
 result=subprocess.run(['curl','-fL','--retry','2','--max-time','60',url,'-o',str(Path('public/assets')/name)],capture_output=True,text=True)
 return name,result.returncode,result.stderr[-200:]
with concurrent.futures.ThreadPoolExecutor() as pool:
 for result in pool.map(fetch,files.items()):print(result,flush=True)
