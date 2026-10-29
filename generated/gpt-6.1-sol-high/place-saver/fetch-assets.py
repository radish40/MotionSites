from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess,re,json
assets={
'hero.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260710_114906_ad7cee37-9e56-434f-99bc-92d5bdc4f9fe.mp4',
'pro.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260710_115050_a1ba47d0-aedf-413c-9dea-14509599d3dd.mp4',
'logo.png':'https://polo-pecan-73837341.figma.site/_assets/v11/b1ddc82509144261f1999a0c4d92be5ce6689c0f.png',
'monthly.png':'https://polo-pecan-73837341.figma.site/_assets/v11/ef4533e6536f2495088e56e0f98036b5ff15446d.png',
'garamond-light.woff2':'https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-LtNarrow_i2zcip.woff2',
'garamond-book.woff2':'https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrow_xjfoc0.woff2',
'garamond-italic.woff2':'https://res.cloudinary.com/dgupuutfn/raw/upload/v1783596334/ITCGaramondStd-BkNarrowIta_hiy9ld.woff2'}
def get(item):
 n,u=item;p=Path('public/assets/'+n)
 if p.exists():return {'file':n,'status':'present','bytes':p.stat().st_size}
 r=subprocess.run(['curl','-fL','--connect-timeout','15','--max-time','90','--retry','1',u,'-o',str(p)],capture_output=True)
 return {'file':n,'url':u,'exit_code':r.returncode,'bytes':p.stat().st_size if p.exists() else 0,'error':r.stderr.decode()[-250:] if r.returncode else None}
with ThreadPoolExecutor(max_workers=7) as pool:
 results=list(pool.map(get,assets.items()))
for r in results:print(r,flush=True)
url='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap'
css=subprocess.check_output(['curl','-fL','--max-time','30',url],stderr=subprocess.DEVNULL).decode()
for i,u in enumerate(dict.fromkeys(re.findall(r'url\((https[^)]+)\)',css))):
 n='google-'+str(i)+'.woff2';r=get((n,u));results.append(r);css=css.replace(u,'./'+n)
Path('public/assets/google-fonts.css').write_text(css)
Path('asset-report.json').write_text(json.dumps(results,indent=2))
print('Google fonts downloaded',flush=True)
