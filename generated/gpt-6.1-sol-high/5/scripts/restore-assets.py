"""Restore isolated logo symbols and compose approximate wordmarks. Run from project root.
Original Tailus links redirected away on 2026-10-30; no reference image was available.
"""
from pathlib import Path
import subprocess
for name, label in {'openai':'OpenAI','nvidia':'NVIDIA','github':'GitHub','vercel':'Vercel','linear':'Linear'}.items():
    target = Path(f'public/logos/{name}-symbol.svg')
    if not target.exists():
        subprocess.run(['curl','-fLsS','--max-time','20',f'https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/{name}.svg','-o',str(target)],check=True)
    symbol = target.read_text()
    inner = symbol[symbol.index('>')+1:symbol.rfind('</svg>')]
    Path(f'public/logos/{name}.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 32"><svg x="0" y="3" width="26" height="26" viewBox="0 0 24 24">{inner}</svg><text x="34" y="23" fill="black" font-family="Arial,Helvetica,sans-serif" font-size="23" font-weight="600" letter-spacing="-.8">{label}</text></svg>')
