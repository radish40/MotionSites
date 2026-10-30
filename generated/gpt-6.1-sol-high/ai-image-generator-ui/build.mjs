import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css']) await cp(file, `dist/${file}`);
await cp('public/assets', 'dist/assets', { recursive: true });
console.log('Built static site in dist/ for /motionsites-results/ai-image-generator-ui/');
