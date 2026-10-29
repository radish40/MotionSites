"""Fetch the exact prompt assets; curl handles this host's network proxy."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import re, subprocess
root = Path(__file__).resolve().parents[1]
cdn = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
clips = {
'featured': 'hf_20260507_155500_808e6fdd-761f-4acd-b3be-cb7e6e700def.mp4',
'lighting': 'hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4',
'editing': 'hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4',
'business': 'hf_20260507_154232_f8809bd2-a6c3-4a38-908d-2005e5b3cb3e.mp4'}
def fetch(item):
    url, path = item
    subprocess.run(['curl', '-sS', '-L', '--fail', '--retry', '2', '--max-time', '180', '-o', str(path), url], check=True)
    print(path.name, path.stat().st_size, flush=True)
css = (root / 'public/fonts/google-fonts.css').read_text()
files = []
for family, weight, url in re.findall(r"font-family: '([^']+)';.*?font-weight: (\d+);.*?url\(([^)]+)\)", css, re.S):
    files.append((url, root / 'public/fonts' / f'{family.lower()}-{weight}.ttf'))
files += [(cdn + clip, root / 'public/videos' / f'{name}.mp4') for name, clip in clips.items()]
with ThreadPoolExecutor(max_workers=9) as pool:
    list(pool.map(fetch, files))
