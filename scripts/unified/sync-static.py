"""Copy a verified build into the checked-in static site without publishing development files."""
from pathlib import Path
import shutil,subprocess,sys
root=Path(__file__).resolve().parents[2]
subprocess.run([sys.executable,str(root/'scripts/unified/verify-data.py')],check=True)
for name in ('assets','data','licenses'):
    shutil.copytree(root/'dist'/name,root/name,dirs_exist_ok=True)
for name in ('index.html','ms_script.js','skeleton.js','entry.js'):
    shutil.copy2(root/'dist'/name,root/name)
shutil.copy2(root/'dist/merge-report.json',root/'docs/merge-report.json')
print('Updated checked-in static files and merge report')
