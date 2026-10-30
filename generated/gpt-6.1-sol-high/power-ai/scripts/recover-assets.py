"""Recover this design's original video and Fontshare font files only."""
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent

def download(url, target):
    subprocess.run(['curl', '-sSL', '--fail', '--connect-timeout', '10', '--max-time', '90', url, '-o', str(ROOT / target)], check=True)

(ROOT / 'public/assets').mkdir(parents=True, exist_ok=True)
download('https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4', 'public/assets/power-ai.mp4')
download('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap', 'fontshare.css')
urls = re.findall(r"url\('//([^']+\.woff2)'\)", (ROOT / 'fontshare.css').read_text())
for weight, url in zip([400, 500, 600, 700], urls):
    download('https://' + url, f'public/assets/general-sans-{weight}.woff2')
