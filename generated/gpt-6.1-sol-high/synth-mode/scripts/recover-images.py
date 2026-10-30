"""Recover the two original prompt assets without modifying their contents."""
from pathlib import Path
import subprocess, json
root=Path(__file__).resolve().parents[1]
prefix='https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F'
sources={
 'base.webp':prefix+'hf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85',
 'reveal.webp':prefix+'hf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85',
}
for name,url in sources.items():
 subprocess.run(['curl','-fL','--max-time','45','-A','Mozilla/5.0',url,'-o',str(root/'public/assets'/name)],check=True)
(root/'public/assets/sources.json').write_text(json.dumps({'images':sources,'method':'Original WebP response, recovered using Mozilla/5.0 user agent. No extraction, cropping or generated replacements.'},indent=2)+'\n')
