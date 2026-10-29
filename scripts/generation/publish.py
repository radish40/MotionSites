#!/usr/bin/env python3
"""Publish only generated static files, using atomic per-project symlinks."""
import argparse
import fcntl
import hashlib
import os
from pathlib import Path
import re
import shutil
import tempfile

DEST = Path('/opt/nginx-gateway/www/motionsites-results')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('name', help='design id, or index')
    p.add_argument('source', type=Path)
    args = p.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', args.name):
        p.error('Invalid design id')
    source = args.source.resolve()
    if not source.is_dir() or not (source / 'index.html').is_file():
        p.error('A complete static directory is required')
    files = sorted(source.rglob('*'))
    for file in files:
        relative = file.relative_to(source)
        # Expo's static export includes this public routing metadata file.
        expo_routes = relative.as_posix() == '_expo/.routes.json' and file.is_file()
        if file.is_symlink() or (not expo_routes and any(part.startswith('.') for part in relative.parts)):
            p.error('Hidden files and symlinks are not public artifacts')
        # Expo preserves dependency paths for exported images and fonts.
        expo_asset = relative.parts[:2] == ('assets', 'node_modules') and (
            file.is_dir() or file.suffix.lower() in (
                '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.ico',
                '.ttf', '.otf', '.woff', '.woff2', '.mp4', '.webm', '.mp3', '.wav',
            )
        )
        if file.name in ('TASK.md', 'PROMPT.md', 'package.json') or ('node_modules' in relative.parts and not expo_asset):
            p.error('Source directory passed instead of static build')
    DEST.mkdir(parents=True, exist_ok=True)
    with (DEST / '.publish.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if args.name == 'index':
            # Index is small. Publish its data first and HTML last.
            for file in sorted((f for f in files if f.is_file()), key=lambda f: f.name == 'index.html'):
                target = DEST / file.relative_to(source)
                target.parent.mkdir(parents=True, exist_ok=True)
                temporary = target.with_name(target.name + '.next')
                shutil.copyfile(file, temporary)
                temporary.chmod(0o644)
                os.replace(temporary, target)
            print('Published index')
            return
        digest = hashlib.sha256()
        for file in files:
            if file.is_file():
                digest.update(str(file.relative_to(source)).encode())
                digest.update(file.read_bytes())
        release = DEST / '.releases' / args.name / digest.hexdigest()[:16]
        if not release.exists():
            release.parent.mkdir(parents=True, exist_ok=True)
            temporary = Path(tempfile.mkdtemp(prefix='stage-', dir=release.parent))
            shutil.copytree(source, temporary, dirs_exist_ok=True)
            for file in temporary.rglob('*'):
                file.chmod(0o755 if file.is_dir() else 0o644)
            temporary.chmod(0o755)
            os.replace(temporary, release)
        link = DEST / (args.name + '.next')
        link.unlink(missing_ok=True)
        link.symlink_to(release.relative_to(DEST))
        os.replace(link, DEST / args.name)
        print('Published', args.name, release.name)


if __name__ == '__main__':
    main()
