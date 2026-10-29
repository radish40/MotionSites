import pathlib,re,subprocess
p=pathlib.Path('public/assets/google-fonts.css');css=p.read_text()
for i,url in enumerate(dict.fromkeys(re.findall(r'https://[^)]+',css))):
 name=f'font-{i}.ttf'
 subprocess.run(['curl','-fLsS','--max-time','25',url,'-o','public/assets/'+name],check=True)
 css=css.replace(url,'./'+name)
p.write_text(css)
s=pathlib.Path('src/index.css');s.write_text(s.read_text().replace("@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Michroma&display=swap');","@import url('../public/assets/google-fonts.css');"))
