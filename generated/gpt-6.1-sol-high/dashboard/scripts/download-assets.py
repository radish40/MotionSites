from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen, Request
from pathlib import Path
import json, subprocess
root = Path('public/assets')
assets = {f'{u}.jpg':f'https://i.pravatar.cc/100?u={u}' for u in ['current_user','meeting_host',*map(str,range(1,15)),*['m'+str(i) for i in range(1,6)],'large1','large2','alice_av','speaker','p1','p2','p3',*['c'+str(i) for i in range(1,5)]]}
assets.update({f'screen{i}.jpg':f'https://picsum.photos/seed/screen{i}/300/200' for i in range(1,5)})
assets.update({'light.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_103318_2aa26b55-df1a-43a6-903d-941e718c9366.mp4','dark.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4'})
def download(item):
    name,url=item
    try:
        data=subprocess.check_output(['curl','-fLsS','--max-time','35','--retry','2',url])
        (root/name).write_bytes(data)
        return {'file':name,'source':url,'bytes':len(data),'status':'ok'}
    except Exception as e: return {'file':name,'source':url,'status':'failed','error':str(e)}
with ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(download,assets.items()))
Path('asset-manifest.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
