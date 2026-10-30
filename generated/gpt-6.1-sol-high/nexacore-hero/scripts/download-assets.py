import concurrent.futures, subprocess, json, pathlib
assets={
'hero.mp4':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4',
 'trusted.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260418_120332_3b24257a-afe6-48ca-875f-78147370f403.png&w=1280&q=85',
 'precision.webp':'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260418_125638_553b96dc-a1fd-4b2b-81a9-ed7daa80006e.png&w=1280&q=85',
 'card.png':'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/682c7cb62b8800a7594c5abd_hover_card_img.png',
 'bullet.svg':'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/683ef70a24657b10be91ef49_bullet-list.svg',
 'cross.svg':'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/686cc0f520a992816d8b15dc_bullet-list-cross.svg',
 'check.svg':'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/686cc068490683bbb3377d04_bullet-list.svg',
 'logo.png':'https://cdn.prod.website-files.com/6720dd1ab6df0da205830ab1/6870f623cf3df417ce45df05_icon%20logo%20eternacloud.png',
 'mazzard-400.woff2':'https://db.onlinewebfonts.com/t/eb5b5ee332420add9a40ee988cb6ac37.woff2',
 'mazzard-500.woff2':'https://db.onlinewebfonts.com/t/875fffdfa62169a0f131e90f37f1faf4.woff2',
 'control.m3u8':'https://stream.mux.com/bnYL6x5cAX6WiJv2pOKpITehZd3NVdXpj3ylJFpX5Lk.m3u8'}
def get(pair):
 name,url=pair
 r=subprocess.run(['curl','-L','--fail','--connect-timeout','15','--max-time','70','-sS',url,'-o','public/assets/'+name],capture_output=True,text=True)
 return {'file':name,'url':url,'status':'downloaded' if r.returncode==0 else 'failed','error':r.stderr,'bytes':pathlib.Path('public/assets/'+name).stat().st_size if pathlib.Path('public/assets/'+name).exists() else 0}
r=list(concurrent.futures.ThreadPoolExecutor(8).map(get,assets.items()))
pathlib.Path('asset-report.json').write_text(json.dumps(r,indent=2));print(json.dumps(r,indent=2))
