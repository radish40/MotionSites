import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/vendor/bootstrap-icons', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('public', 'dist', { recursive: true });
for (const name of ['swiper-bundle.min.css', 'swiper-bundle.min.js']) {
  await cp(`node_modules/swiper/${name}`, `dist/vendor/${name}`);
}
await cp('node_modules/lenis/dist/lenis.min.js', 'dist/vendor/lenis.min.js');
await cp('node_modules/bootstrap-icons/font', 'dist/vendor/bootstrap-icons', { recursive: true });
console.log('Built Neural Interface in dist/ for /motionsites-results/neural-interface/');
