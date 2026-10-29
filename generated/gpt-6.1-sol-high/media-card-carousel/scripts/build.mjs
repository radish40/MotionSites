import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'styles.css', 'assets']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Built Media Card Carousel into dist/ (relative assets support /motionsites-results/media-card-carousel/).');
