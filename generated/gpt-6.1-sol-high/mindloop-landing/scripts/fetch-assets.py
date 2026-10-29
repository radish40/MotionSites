from concurrent.futures import ThreadPoolExecutor
import subprocess
from pathlib import Path
root=Path('public/assets')
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
assets={'hero.mp4':base+'hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4','mission.mp4':base+'hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4','solution.mp4':base+'hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4','avatar-1.png':'https://i.pravatar.cc/96?img=47','avatar-2.png':'https://i.pravatar.cc/96?img=12','avatar-3.png':'https://i.pravatar.cc/96?img=49','chatgpt.svg':'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/openai.svg','perplexity.svg':'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/perplexity.svg','google.svg':'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/google.svg'}
def fetch(item):
 name,url=item
 try:
  subprocess.run(['curl','-fLsS','--max-time','45','-o',str(root/name),url],check=True);return name,(root/name).stat().st_size
 except Exception as e:return name,str(e)
with ThreadPoolExecutor(max_workers=7) as pool:
 for result in pool.map(fetch,assets.items()):print(result,flush=True)
