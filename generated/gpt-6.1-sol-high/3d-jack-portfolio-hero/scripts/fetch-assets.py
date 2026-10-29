import re,json,urllib.request,concurrent.futures,pathlib,urllib.parse,subprocess
root=pathlib.Path(__file__).resolve().parents[1]
urls=list(dict.fromkeys([u.rstrip('.') for u in re.findall(r'https://[^\s]+', (root/'PROMPT.md').read_text())]))
def fetch(pair):
 i,url=pair
 ext='.gif' if '.gif' in url else '.webp' if 'higgs.ai' in url else '.png'
 name=f'asset-{i:02d}{ext}'
 try:
  dest=root/'public/assets'/name
  subprocess.run(['curl','-fLsS','--max-time','45','--retry','1',url,'-o',str(dest)],check=True,capture_output=True)
  data=dest.read_bytes()
  if not data.startswith((b'GIF8',b'\x89PNG',b'RIFF',b'\xff\xd8')): raise Exception('Not a supported image')
  return {'url':url,'path':'assets/'+name,'bytes':len(data),'status':'ok'}
 except Exception as e: return {'url':url,'path':None,'status':'failed','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(fetch,enumerate(urls)))
(root/'asset-manifest.json').write_text(json.dumps(results,indent=2))
(root/'src/assets.json').write_text(json.dumps([r['path'] or ('assets/celestia-unavailable.svg' if 'celestia' in r['url'] else r['url']) for r in results],indent=2))
print(json.dumps(results,indent=2))
