from pathlib import Path
import re, base64
root=Path(__file__).resolve().parent.parent
text=(root/'src.html').read_text()
for alias,file in [('SG','SpaceGrotesk.woff2'),('JB','JetBrainsMono-Regular.woff2')]:
    text=text.replace('{{'+alias+'}}',base64.b64encode((root/'assets'/file).read_bytes()).decode())
prompt=(root/'PROMPT.md').read_text()
filters=re.findall(r'<filter id="grade[\s\S]*?</filter>',prompt)
assert len(filters)==2
text=text.replace('{{FILTERS}}','\n'.join(filters))
text=text.replace('{{VIDEO}}','https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4')
(root/'index.html').write_text(text)
