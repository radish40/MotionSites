import { rm, mkdir, copyFile, cp } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js']) await copyFile(file, `dist/${file}`);
await cp('public/assets', 'dist/assets', { recursive: true });
console.log('Built Place Saver → dist/ (relative assets support /motionsites-results/place-saver/)');
