import re, pathlib, subprocess, concurrent.futures, json
root=pathlib.Path(__file__).resolve().parents[1]
css=(root/'font-source.css').read_text()
urls=re.findall(r'https://[^)]+',css)
def font(item):
 i,url=item
 name=f'font-{i}.ttf'
 subprocess.run(['curl','-sS','--fail','-L','--max-time','45',url,'-o',str(root/'public/assets'/name)],check=True)
 return url,name
for url,name in concurrent.futures.ThreadPoolExecutor().map(font,enumerate(urls)):
 css=css.replace(url,'./'+name)
(root/'public/assets/fonts.css').write_text(css)
photos={'automotive':'photo-1503376780353-7e6692767b70','architecture':'photo-1487958449943-2429e8be8625','human':'photo-1534528741775-53994a69daeb','brand':'photo-1602143407151-7111542de6e8','sculpture':'photo-1579783902614-a3fb3927b6a5','landscape':'photo-1464822759023-fed622ff2c3b','space':'photo-1462331940025-496dfbfc7564','interior':'photo-1600210492486-724fe5c67fb0'}
def photo(item):
 name,pid=item
 url=f'https://images.unsplash.com/{pid}?auto=format&fit=crop&w=1400&q=85'
 subprocess.run(['curl','-sS','--fail','-L','--max-time','45',url,'-o',str(root/f'public/assets/{name}.jpg')],check=True)
 return {'file':f'{name}.jpg','source':url}
assets=list(concurrent.futures.ThreadPoolExecutor().map(photo,photos.items()))
(root/'public/assets/sources.json').write_text(json.dumps(assets,indent=2))
