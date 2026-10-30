import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await copyFile('component2.html', 'dist/index.html');
await copyFile('component2.html', 'dist/component2.html');
await cp('assets', 'dist/assets', { recursive: true });
console.log('Built standalone pricing section in dist/');
