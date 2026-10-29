import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'interactions.js', 'enhancements.css', 'assets']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Built Pet Products in dist/ for /motionsites-results/pet-products/');
