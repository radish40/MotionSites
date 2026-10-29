from pathlib import Path
import re,subprocess
p=Path('public/assets/font.css')
s=p.read_text()
for weight,url in re.findall(r'font-weight: (\d+);.*?url\(([^)]+)\)',s,re.S):
 name='space-grotesk-'+weight+'.ttf'
 subprocess.run(['curl','-fLsS','--max-time','30','-o',str(p.parent/name),url],check=True)
 s=s.replace(url,'./'+name)
p.write_text(s)
