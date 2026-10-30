"""Re-embed the recovered Google Fonts variable font in the standalone HTML."""
import base64
import re
from pathlib import Path
root = Path(__file__).resolve().parent.parent
font = base64.b64encode((root / 'recovery/figtree-latin-variable.woff2').read_bytes()).decode()
page = root / 'index.html'
html = page.read_text()
html, count = re.subn(r'data:font/woff2;base64,[A-Za-z0-9+/=]+', 'data:font/woff2;base64,' + font, html)
assert count == 1
page.write_text(html)
