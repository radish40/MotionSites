import { mkdir, copyFile } from 'node:fs/promises';
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await copyFile(new URL('../index.html', import.meta.url), new URL('../dist/index.html', import.meta.url));
console.log('Built dist/index.html (standalone HTML, compatible with /motionsites-results/keep-ahead-features/).');
