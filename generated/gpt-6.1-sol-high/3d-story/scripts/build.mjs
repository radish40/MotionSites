import { cp, mkdir, rm, stat } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('assets', 'dist/assets', { recursive: true });
console.log(`Built 3D Story: dist/index.html (${(await stat('dist/index.html')).size} bytes), with local video and fonts.`);
