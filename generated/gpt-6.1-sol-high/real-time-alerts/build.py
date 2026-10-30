"""Package the native HTML page; no compilation or dependencies required."""
from pathlib import Path
import shutil
root=Path(__file__).parent
dist=root/'dist'
(dist/'assets').mkdir(parents=True,exist_ok=True)
shutil.copy2(root/'index.html',dist/'index.html')
for name in ['falcon.mp4','Manrope-OFL.txt','FreeSans-COPYING.txt']:
    shutil.copy2(root/'assets'/name,dist/'assets'/name)
assert (dist/'index.html').stat().st_size>100000
print('Built dist/index.html and local video assets.')
