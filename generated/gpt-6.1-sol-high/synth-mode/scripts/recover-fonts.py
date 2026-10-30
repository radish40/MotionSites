"""Cache the exact requested Google Fonts families for reliable rendering."""
from pathlib import Path
import re, subprocess
root=Path(__file__).resolve().parents[1]
css=(root/'public/assets/google-fonts.css').read_text()
urls=list(dict.fromkeys(re.findall(r'https://[^)]+',css)))
for index,url in enumerate(urls):
    name='font-'+str(index)+'.ttf'
    subprocess.run(['curl','-fL','--max-time','30','-A','Mozilla/5.0',url,'-o',str(root/'public/assets'/name)],check=True,capture_output=True)
    css=css.replace(url,'./'+name)
(root/'public/assets/fonts-local.css').write_text(css)
print('Cached',len(urls),'Google Font files')
