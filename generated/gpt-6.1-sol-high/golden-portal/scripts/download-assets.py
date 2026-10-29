import urllib.request, concurrent.futures, json, pathlib, subprocess
root=pathlib.Path(__file__).resolve().parents[1]
assets={
'hero.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260611_130946_e6793cc7-6b6f-4035-9852-44290b781ae6.mp4',
'cloud.png':'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781584857/top-bg_j88wyu.png',
'dove.png':'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781584853/dove_xpaeub.png',
'bottom.png':'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781584854/bottom_bg_liw6lc.png',
'showcase.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260616_040223_98d314e9-b8b4-4218-bcbd-18ffc38032ac.png&w=1280&q=85',
'quote.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260616_042421_41f4fa0b-770c-4545-a416-73a809366e49.png&w=1280&q=85',
'arsenica.woff2':'https://db.onlinewebfonts.com/t/cbb3cb559d2e4387e139cfb1656e31f5.woff2'
}
def download(item):
 name,url=item
 try:
  dest=root/'public/assets'/name
  result=subprocess.run(['curl','-fL','--max-time','60','--retry','1','-A','Mozilla/5.0','-o',str(dest),url],capture_output=True)
  if result.returncode: return {'file':name,'url':url,'error':result.stderr.decode()}
  return {'file':name,'url':url,'status':200,'bytes':dest.stat().st_size}
 except Exception as e: return {'file':name,'url':url,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool: results=list(pool.map(download,assets.items()))
(root/'asset-report.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2),flush=True)
