from pathlib import Path
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parent.parent
urls={
'profile.jpg':'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600',
'account.jpg':'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80',
'hardware.jpg':'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=120',
'avatar-1.jpg':'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60',
'avatar-2.jpg':'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=60',
'avatar-3.jpg':'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
'font-source.css':'https://db.onlinewebfonts.com/c/060e116a70e3096c52db16f61aaab194?family=Sofia+Pro+Regular'}
def get(item):
 name,url=item
 try:
  data=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read()
  (root/'public/assets'/name).write_bytes(data)
  return {'file':name,'url':url,'bytes':len(data),'status':'ok'}
 except Exception as e: return {'file':name,'url':url,'status':'failed','error':str(e)}
results=list(ThreadPoolExecutor(7).map(get,urls.items()))
(root/'asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
