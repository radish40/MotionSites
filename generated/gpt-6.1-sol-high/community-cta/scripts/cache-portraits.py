"""Cache approved decorative stock substitutes; never request unavailable originals."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PHOTO_IDS = [
    'photo-1472099645785-5658abf4ff4e',
    'photo-1494790108377-be9c29b29330',
    'photo-1500648767791-00dcc994a43e',
    'photo-1534528741775-53994a69daeb',
]
originals = json.loads((ROOT / 'assets/download-report.json').read_text())[1:]

def cache(item):
    index, photo_id = item
    url = f'https://images.unsplash.com/{photo_id}?w=128&h=128&fit=crop&crop=faces&fm=jpg&q=85'
    relative = f'assets/avatar-{index}.jpeg'
    target = ROOT / relative
    subprocess.run(['curl', '--fail', '--location', '--silent', '--show-error',
                    '--max-time', '45', url, '--output', str(target)], check=True)
    data = target.read_bytes()
    if not data.startswith(b'\xff\xd8\xff'):
        raise ValueError(f'{relative}: not a JPEG')
    return {
        'selector': f'.av{index}',
        'classification': 'Approximate decorative stock portrait; not the original CleanShot asset and not a verified community member.',
        'original_url': originals[index - 1]['url'],
        'original_status': 'HTTP 403 on signed and unsigned URLs; historical attempts in download-report.json; not requested by preview.',
        'replacement_source': 'Unsplash',
        'replacement_url': url,
        'local_file': relative,
        'cached_at': datetime.now(timezone.utc).isoformat(),
        'bytes': len(data),
        'sha256': hashlib.sha256(data).hexdigest(),
    }

with ThreadPoolExecutor(max_workers=4) as executor:
    records = list(executor.map(cache, enumerate(PHOTO_IDS, 1)))
(ROOT / 'assets/portrait-provenance.json').write_text(json.dumps(records, indent=2) + '\n')
for record in records:
    print(record['local_file'], record['bytes'], record['replacement_url'])
