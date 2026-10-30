"""Download the exact prompt assets with curl. All outputs stay in this project."""
from pathlib import Path
import subprocess, concurrent.futures, re, json
base=Path(__file__).resolve().parent.parent/'public'/'assets'
urls={
'spanish-course.jpg':'https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
'french-course.jpg':'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
'avatar-1.jpg':'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
'emoji-source.css':'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&text=%F0%9F%94%A5',
'logo.svg':'https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg',
'spanish.svg':'https://d35aaqx5ub95lt.cloudfront.net/vendor/59a90a2cedd48b751a8fd22014768fd7.svg',
'french.svg':'https://d35aaqx5ub95lt.cloudfront.net/vendor/482fda142ee4abd728ebf4ccce5d3307.svg',
'german.svg':'https://d35aaqx5ub95lt.cloudfront.net/vendor/c71db846ffab7e0a74bc6971e34ad82e.svg',
'japanese.svg':'https://d35aaqx5ub95lt.cloudfront.net/vendor/edea4fa18ff3e7d8c0282de3f102aaed.svg',
'nunito-source.css':'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap',
'feather-source.css':'https://db.onlinewebfonts.com/c/14936bb7a4b6575fd2eee80a3ab52cc2?family=Feather+Bold',
'avatar-2.jpg':'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
'avatar-3.jpg':'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'}
def fetch(item):
 name,url=item
 p=subprocess.run(['curl','--compressed','-fL','--retry','2','--max-time','25','-A','Mozilla/5.0',url,'-o',str(base/name)],capture_output=True)
 return {'name':name,'url':url,'ok':p.returncode==0,'bytes':(base/name).stat().st_size if (base/name).exists() else 0,'error':p.stderr.decode()[-300:] if p.returncode else None}
results=list(concurrent.futures.ThreadPoolExecutor(8).map(fetch,urls.items()))
font_urls={}
for weight,url in re.findall(r'font-weight: (\d+);.*?url\((.*?)\)',(base/'nunito-source.css').read_text(),re.S):
 font_urls[f'nunito-{weight}.ttf']=url
font_urls['feather.woff2']='https://db.onlinewebfonts.com/t/14936bb7a4b6575fd2eee80a3ab52cc2.woff2'
font_urls['fire-emoji.ttf']=re.search(r'url\((.*?)\)',(base/'emoji-source.css').read_text()).group(1)
results.extend(concurrent.futures.ThreadPoolExecutor(8).map(fetch,font_urls.items()))
print(json.dumps(results,indent=2))
(base/'download-report.json').write_text(json.dumps(results,indent=2))
