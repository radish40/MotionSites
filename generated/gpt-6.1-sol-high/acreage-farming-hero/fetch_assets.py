from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request,urlopen
import json, pathlib
assets={'hero.mp4':'https://cdn.pixabay.com/video/2025/01/22/254016_large.mp4','about.jpg':'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80','wheat.jpg':'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80','crop.jpg':'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80','field.jpg':'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80','yield.jpg':'https://images.unsplash.com/photo-1472141521881-95d0e87e2e76?w=600&q=80','portfolio1.jpg':'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80','portfolio2.jpg':'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80','portfolio3.jpg':'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80','event.jpg':'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80','blog1.jpg':'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&q=80','blog2.jpg':'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80','blog4.jpg':'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80','landscape.jpg':'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80'}
def fetch(item):
 name,url=item
 try:
  with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=90) as r: data=r.read()
  pathlib.Path('public/assets/'+name).write_bytes(data)
  return {'file':name,'url':url,'bytes':len(data),'status':'ok'}
 except Exception as e:return {'file':name,'url':url,'status':'failed','error':str(e)}
with ThreadPoolExecutor(max_workers=8) as ex: results=list(ex.map(fetch,assets.items()))
pathlib.Path('asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
