"""Retry the unavailable prompt asset, then reuse this design's landscape."""
import json
import pathlib
import shutil
from urllib.request import Request, urlopen

root = pathlib.Path(__file__).resolve().parent
urls = [
    'https://images.unsplash.com/photo-1472141521881-95d0e87e2e76?w=600&q=80',
    'https://images.unsplash.com/photo-1472141521881-95d0e87e2e76',
    'https://images.unsplash.com/photo-1472141521881-95d0e87e2e76?auto=format&fit=crop&w=600&q=80',
]
attempts = []
recovered = False
for url in urls:
    try:
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=8) as response:
            data = response.read()
        (root / 'public/assets/yield.jpg').write_bytes(data)
        attempts.append({'url': url, 'result': 'recovered'})
        recovered = True
        break
    except Exception as error:
        attempts.append({'url': url, 'result': str(error)})
if not recovered:
    shutil.copyfile(root / 'public/assets/landscape.jpg', root / 'public/assets/yield.jpg')
report = {'asset': 'Yield Analysis image', 'original': urls[0], 'attempts': attempts,
          'fallback': None if recovered else 'Reused the prompt CTA landscape photo-1500382017468-9049fed747ef. CSS object-fit crops the local yield.jpg into its card.',
          'reference': 'Optional project reference absent; no reference extraction used.',
          'limitation': None if recovered else 'The unavailable original photograph cannot be matched.'}
(root / 'asset-recovery.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
