import concurrent.futures, subprocess, json
assets={
'hero.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260326_073936_8dd07fdb-4f6b-4220-a3f0-9dedfaab0c88.mp4',
'nova.gif':'https://motionsites.ai/assets/hero-grow-ai-preview-BlQ8tAQ-.gif',
'pulse.gif':'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
'drift.gif':'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
'arc.gif':'https://motionsites.ai/assets/hero-neuralyn-preview-Br4FRDQA.gif',
'showcase.mp4':'https://media.cleanshot.cloud/media/21620/nKosRonaEKSufJVJ4VtouFhOPkqgJ3dPoQ8ZP52S.mp4',
'avatar1.jpg':'https://i.pravatar.cc/80?img=47','avatar2.jpg':'https://i.pravatar.cc/80?img=12','avatar3.jpg':'https://i.pravatar.cc/80?img=49'}
def fetch(item):
 name,url=item
 p=subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','60','-o','public/assets/'+name,url],capture_output=True,text=True)
 return {'name':name,'url':url,'status':'ok' if p.returncode==0 else 'failed','error':p.stderr.strip()}
with concurrent.futures.ThreadPoolExecutor(max_workers=9) as ex: report=list(ex.map(fetch,assets.items()))
open('asset-report.json','w').write(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
