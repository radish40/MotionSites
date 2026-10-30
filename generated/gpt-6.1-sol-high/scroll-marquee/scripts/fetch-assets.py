"""Download only the image URLs in this project's PROMPT.md."""
from pathlib import Path
import re
import subprocess
import concurrent.futures
import json
import shutil

root = Path(__file__).resolve().parents[1]
urls = re.findall(r'https://motionsites.ai/assets/[^\s`]+\.gif', (root / 'PROMPT.md').read_text())

def fetch(url):
    path = root / 'public/assets' / url.rsplit('/', 1)[1]
    result = {'url': url, 'local': str(path.relative_to(root))}
    try:
        subprocess.run(['curl', '-sS', '-L', '--fail', '--retry', '2', '--max-time', '120', url, '-o', str(path)], check=True)
        data = path.read_bytes()
        if data[:6] in (b'GIF87a', b'GIF89a'):
            image_format = 'GIF'
        elif data.startswith(b'\x89PNG'):
            image_format = 'PNG served by source at GIF URL'
        else:
            raise ValueError('Not a supported image')
        result.update(status='ok', bytes=len(data), format=image_format)
    except Exception as error:
        result.update(status='failed', error=str(error))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    results = list(executor.map(fetch, urls))

# Explicit, documented approximation for the single unavailable source image.
for result in results:
    if 'hero-celestia-' in result['url'] and result['status'] == 'failed':
        fallback = root / 'public/assets/hero-planet-orbit-preview-DWAP8Z1P.gif'
        if fallback.exists():
            shutil.copyfile(fallback, root / result['local'])
            result.update(status='fallback', fallback_source=fallback.name,
                          limitation='Provided Planet Orbit animation substitutes for unavailable Celestia; not an exact visual recovery.')
(root / 'asset-manifest.json').write_text(json.dumps(results, indent=2) + '\n')
for result in results:
    print(result)
