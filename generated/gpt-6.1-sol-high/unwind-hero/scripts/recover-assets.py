"""Reproduce this project's local asset downloads and embedded font CSS."""
from pathlib import Path
import base64
import hashlib
import json
import urllib.request

root = Path(__file__).resolve().parents[1]
assets = root / 'public' / 'assets'
assets.mkdir(parents=True, exist_ok=True)
sources = {
    'evergreen.mp4': 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260620_140846_aef8cb19-5ec8-4b45-974b-020aed20f297.mp4',
    'PPMori-Regular.woff2': 'https://aesthetic.computer/assets/fonts/PPMori-Regular.woff2',
    'PPMori-SemiBold.woff2': 'https://aesthetic.computer/assets/fonts/PPMori-SemiBold.woff2',
}
manifest = []
for filename, url in sources.items():
    target = assets / filename
    if not target.exists():
        with urllib.request.urlopen(url, timeout=60) as response:
            target.write_bytes(response.read())
    manifest.append({'file': f'public/assets/{filename}', 'source': url, 'bytes': target.stat().st_size, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
css = ''
for weight, name in [(400, 'Regular'), (600, 'SemiBold')]:
    encoded = base64.b64encode((assets / f'PPMori-{name}.woff2').read_bytes()).decode()
    css += f"@font-face{{font-family:'PP Mori';src:url(data:font/woff2;base64,{encoded}) format('woff2');font-weight:{weight};font-style:normal;font-display:swap;}}\n"
(root / 'src/styles/fonts.css').write_text(css)
(root / 'asset-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
