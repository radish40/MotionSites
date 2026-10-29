import subprocess,concurrent.futures
base='https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/'
items=[('hero.mp4',base+'202606021731-e_hqa6sn.mp4'),('drum.mp4',base+'2026060218225-v_kcy5rl.mp4')]+[(x+'.svg','https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/'+x+'-logo-svg-150px.svg') for x in ['voiceflow','zendesk','pendo','glide','canva']]
def get(v):
 name,url=v
 r=subprocess.run(['curl','-fL','--retry','2','--max-time','45',url,'-o','public/assets/'+name],capture_output=True)
 return name,r.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as e:
 for r in e.map(get,items):print(r)
