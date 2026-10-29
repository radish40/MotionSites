#!/usr/bin/env python3
"""Deploy OYLA's original Express production server, including its video API."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
PROJECT = ROOT / 'generated/gpt-6.1-sol-high/oyla'
NAME = 'motionsites-oyla'


def run(*args, **kwargs):
    return subprocess.run(args, check=True, text=True, **kwargs)


def main():
    digest = hashlib.sha256()
    for file in [PROJECT/'package.json', PROJECT/'package-lock.json', *sorted((PROJECT/'dist').rglob('*'))]:
        if file.is_file():
            digest.update(str(file.relative_to(PROJECT)).encode())
            digest.update(file.read_bytes())
    tag = f'{NAME}:{digest.hexdigest()[:16]}'
    with tempfile.TemporaryDirectory(prefix='motionsites-oyla-') as temporary:
        context = Path(temporary)
        for name in ('package.json', 'package-lock.json'):
            shutil.copyfile(PROJECT/name, context/name)
        shutil.copytree(PROJECT/'dist', context/'dist')
        run('docker', 'build', '-f', str(ROOT/'scripts/generation/oyla-runtime.Dockerfile'), '-t', tag, temporary)
    existing = subprocess.run(['docker', 'container', 'inspect', NAME], capture_output=True, text=True)
    if existing.returncode == 0:
        run('docker', 'rm', '-f', NAME)
    run('docker', 'run', '-d', '--name', NAME, '--restart', 'unless-stopped',
        '--network', 'gateway', '--read-only', '--tmpfs', '/tmp', '--cap-drop', 'ALL',
        '--security-opt', 'no-new-privileges:true', '--memory', '256m', '--cpus', '0.5', tag)
    for attempt in range(20):
        check = subprocess.run(['docker', 'exec', NAME, 'node', '-e',
            "fetch('http://127.0.0.1:3000/motionsites-results/oyla/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],
            capture_output=True)
        if check.returncode == 0:
            print(json.dumps({'container': NAME, 'image': tag, 'production_http': 200}), flush=True)
            return
        time.sleep(1)
    raise RuntimeError('OYLA production server did not become ready')


if __name__ == '__main__':
    main()
