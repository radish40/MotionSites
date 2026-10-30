"""Fingerprint only the authorized NOVA catalog movie and this project's asset."""
import hashlib
import json
from pathlib import Path
reference = Path('/home/opc/motionsites/assets/library/videos/NOVA_Space_Systems_1.mp4')
local = Path('public/assets/engineering.mp4')
def fingerprint(path):
    return {'path': str(path), 'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
a, b = fingerprint(reference), fingerprint(local)
evidence = {
    'reference': a, 'science_asset': b, 'byte_identical': a['sha256'] == b['sha256'],
    'metadata': json.loads(Path('reference-inspection/metadata.json').read_text()),
    'visually_inspected_seconds': [0, 1, 2, 4, 6, 8, 10],
    'observations': [
        'Full-frame square star field, coastal launch site, and ascending light trail. No navbar, headings, buttons, or other page UI in inspected frames.',
        'The reference is byte-identical to the exact top-right science-section video URL in PROMPT.md. It is not a page recording with an extractable hero region.',
        'The catalog filename alone cannot establish that this is the unavailable hero video; the independently available science asset provides an exact identity match.',
        'The original hero URL was retried and returned HTTP 403 AccessDenied. Response evidence is saved alongside this report.',
        'No clean recovery of the distinct requested hero is supported by the supplied evidence. Retain the clearly identified launch.mp4 approximation.'
    ],
    'site_content_policy': 'Inspection images remain outside public/ and dist/. The catalog movie was not copied into the site. All page text, layout, and controls remain real DOM.'
}
Path('reference-inspection/evidence.json').write_text(json.dumps(evidence, indent=2) + '\n')
print(json.dumps(evidence, indent=2))
