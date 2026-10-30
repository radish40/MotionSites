from pathlib import Path
import re,subprocess,json
source='https://stream.mux.com/OD2Ny6q9anbQ9h7Vie3KnqDxFpzHM9sjwfhF029lfd600.m3u8'
def fetch(url):return subprocess.check_output(['curl','-fLsS','--retry','2','--max-time','40',url])
master=fetch(source).decode();variant=[l for l in master.splitlines() if l.startswith('https')][2]
playlist=fetch(variant).decode();urls=re.findall(r'URI="([^"]+)"',playlist)+[l for l in playlist.splitlines() if l.startswith('https')]
Path('public/assets/sailing.mp4').write_bytes(b''.join(fetch(u) for u in urls))
Path('public/assets/video-provenance.json').write_text(json.dumps({'source':source,'rendition':'1280x720','duration_seconds':8.08333,'method':'Concatenated original fMP4 init and two media segments; no transcoding or visual changes.','playlist':playlist},indent=2))
Path('public/assets/video-source.m3u8').unlink(missing_ok=True)
