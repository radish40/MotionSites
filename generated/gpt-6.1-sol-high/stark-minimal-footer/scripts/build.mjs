import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
for (const file of ['index.html', 'styles.css']) await cp(file, `dist/${file}`);
await cp('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', 'dist/assets/geist-latin-wght-normal.woff2');
await cp('node_modules/@fontsource-variable/geist/LICENSE', 'dist/assets/Geist-LICENSE.txt');
console.log('Built Stark Minimal Footer in dist/ (relative assets support /motionsites-results/stark-minimal-footer/).');
