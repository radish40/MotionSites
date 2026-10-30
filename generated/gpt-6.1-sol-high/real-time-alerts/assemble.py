from pathlib import Path
import re,base64,zipfile,io
from fontTools.ttLib import TTFont
from fontTools import subset
root=Path(__file__).parent
prompt=(root/'PROMPT.md').read_text()
z=zipfile.ZipFile(root/'assets/freefont.zip')
faces=[]
for name,weight in [('FreeSans.ttf','400'),('FreeSansBold.ttf','700')]:
    entry=next(x for x in z.namelist() if x.endswith('/'+name))
    font=TTFont(io.BytesIO(z.read(entry)))
    options=subset.Options();options.flavor='woff2'
    ss=subset.Subsetter(options=options);ss.populate(unicodes=list(range(32,256))+[0x2019]);ss.subset(font)
    font.flavor='woff2';out=io.BytesIO();font.save(out)
    faces.append("@font-face{font-family:'FreeSans';font-style:normal;font-weight:"+weight+";font-display:block;src:url(data:font/woff2;base64,"+base64.b64encode(out.getvalue()).decode()+") format('woff2');}")
font=TTFont(root/'assets/Manrope.ttf');ss=subset.Subsetter();ss.populate(unicodes=list(range(32,256))+[0x2019]);ss.subset(font);font.flavor='woff2';out=io.BytesIO();font.save(out)
faces.append("@font-face{font-family:'Eloquia';font-style:normal;font-weight:200 800;font-display:block;src:url(data:font/woff2;base64,"+base64.b64encode(out.getvalue()).decode()+") format('woff2-variations');}")
tokens='\n'.join(m for m in re.findall(r'```[^\n]*\n(.*?)\n```',prompt,re.S) if m.startswith('--'))
glyph=re.search(r'M449\.0.*?Z(?=\s*```)',prompt,re.S).group(0)
html=(root/'template.html').read_text().replace('__FONTS__','\n'.join(faces)).replace('__TOKENS__',tokens).replace('__GLYPH__',glyph).replace('__POSTER__','data:image/webp;base64,'+base64.b64encode((root/'assets/poster.webp').read_bytes()).decode())
(root/'index.html').write_text(html)
for n in z.namelist():
    if n.endswith('/COPYING'): (root/'assets/FreeSans-COPYING.txt').write_bytes(z.read(n))
print('Assembled single-file HTML:',len(html),'bytes')
