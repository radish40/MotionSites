#!/usr/bin/env python3
"""Run Glitch Pulse's original production Express server without changing its source."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

ROOT=Path(__file__).resolve().parents[2]
PROJECT=ROOT/'generated/gpt-6.1-sol-high/glitch-pulse'
NAME='motionsites-glitch-pulse'


def main():
    files=['package.json','package-lock.json','server.ts','tsconfig.json']
    digest=hashlib.sha256()
    for file in [*(PROJECT/name for name in files),*sorted((PROJECT/'dist').rglob('*'))]:
        if file.is_file():
            digest.update(str(file.relative_to(PROJECT)).encode());digest.update(file.read_bytes())
    tag=f'{NAME}:{digest.hexdigest()[:16]}'
    with tempfile.TemporaryDirectory(prefix='motionsites-glitch-pulse-') as temporary:
        context=Path(temporary)
        for name in files:shutil.copyfile(PROJECT/name,context/name)
        shutil.copytree(PROJECT/'dist',context/'dist')
        subprocess.run(['docker','build','-f',str(ROOT/'scripts/generation/glitch-pulse-runtime.Dockerfile'),'-t',tag,temporary],check=True)
    existing=subprocess.run(['docker','container','inspect',NAME],capture_output=True)
    if existing.returncode==0:subprocess.run(['docker','rm','-f',NAME],check=True)
    subprocess.run(['docker','run','-d','--name',NAME,'--restart','unless-stopped','--network','gateway',
        '--read-only','--tmpfs','/tmp','--cap-drop','ALL','--security-opt','no-new-privileges:true',
        '--memory','512m','--cpus','0.5',tag],check=True)
    for attempt in range(20):
        check=subprocess.run(['docker','exec',NAME,'node','-e',
            "fetch('http://127.0.0.1:3000/motionsites-results/glitch-pulse/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],capture_output=True)
        if check.returncode==0:
            print(json.dumps({'container':NAME,'image':tag,'production_http':200}),flush=True);return
        time.sleep(1)
    raise RuntimeError('Glitch Pulse production server did not become ready')


if __name__=='__main__':main()
