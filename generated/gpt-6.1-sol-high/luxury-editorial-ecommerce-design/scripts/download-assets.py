import concurrent.futures, pathlib, urllib.request, json, subprocess
root=pathlib.Path(__file__).resolve().parents[1]
base='https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
files={
'hero.webp':('hf_20260516_101925_8e509c31-4e75-4ae1-b164-2605265b2d47.png',True),
'cleanser.webp':('hf_20260518_193822_8c95f5ed-b142-454f-ab87-59ad1f09e758.png',True),
'serum.webp':('hf_20260518_194048_278bf3cc-7d1f-43c1-9dc7-73d8fcd9949c.png',True),
'set.webp':('hf_20260518_194058_d89610de-05f8-45e4-8196-0680296c565a.png',True),
'oil.webp':('hf_20260518_194112_1763cbb2-3171-4ad3-9f38-1b738b8f1bb6.png',True),
'hero-1.mp4':('hf_20260516_112022_cddf2487-4ffe-45b6-ba4c-99ab79003cc5.mp4',False),
'hero-2.mp4':('hf_20260518_175400_b46d1cd2-2050-45e2-9d13-b9c0bacb16b3.mp4',False),
'hero-3.mp4':('hf_20260518_182440_671605c8-2ed8-4507-a4cb-a62a8f61316f.mp4',False),
'face.mp4':('hf_20260518_203023_87a26602-2898-4acc-a396-c7a2b5ad84fd.mp4',False),
'beauty-tools.mp4':('hf_20260518_203415_b86e3f19-2aec-46cd-9a86-b64c40118e38.mp4',False),
'body.mp4':('hf_20260518_203051_85fee398-ea01-4aa0-972b-137a74213be5.mp4',False)}
def get(item):
 name,(path,isimage)=item
 url=base+path
 if isimage: url='https://images.higgs.ai/?default=1&output=webp&url='+urllib.parse.quote(url,safe='')+'&w=1280&q=85'
 target=root/'public/assets'/name
 try:
  if not target.exists():
   subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','90','--retry','1',url,'-o',str(target)],check=True)
  return {'file':name,'url':url,'bytes':target.stat().st_size,'status':'ok'}
 except Exception as e: return {'file':name,'url':url,'status':'error','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: results=list(pool.map(get,files.items()))
(root/'asset-manifest.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
