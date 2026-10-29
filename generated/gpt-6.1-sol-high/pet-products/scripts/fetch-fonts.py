from pathlib import Path
import urllib.request,re,json,subprocess
root=Path(__file__).resolve().parent.parent
url='https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600;700&display=swap'
req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
try:
 css=subprocess.check_output(['curl','--fail','--silent','--show-error','--location','--max-time','30',url]).decode()
 for i,u in enumerate(dict.fromkeys(re.findall(r'url\((https:[^)]+)\)',css))):
  name='font-'+str(i)+'.'+u.split('.')[-1]
  data=subprocess.check_output(['curl','--fail','--silent','--show-error','--location','--max-time','30',u])
  (root/'assets'/name).write_bytes(data)
  css=css.replace(u,name)
 (root/'assets/fonts.css').write_text(css)
 html=(root/'index.html').read_text()
 html=re.sub(r'<link rel="preconnect"[^>]+>\n','',html)
 html=re.sub(r'<link href="https://fonts.googleapis.com[^>]+>', '<link rel="stylesheet" href="assets/fonts.css">',html)
 (root/'index.html').write_text(html)
 print('Fonts saved locally')
except Exception as e: print('FONT ERROR',str(e))
