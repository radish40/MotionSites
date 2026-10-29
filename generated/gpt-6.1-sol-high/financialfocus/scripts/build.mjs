import { rm, mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { transformAsync } from '@babel/core';
import { execFileSync } from 'node:child_process';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src/index.html', 'dist/index.html');
for (const name of ['react', 'react-dom']) {
  await cp(`node_modules/${name}/umd/${name}.production.min.js`, `dist/assets/${name}.production.min.js`);
}
const source = await readFile('src/app.tsx', 'utf8');
const { code } = await transformAsync(source, {
  filename: 'app.tsx', presets: ['@babel/preset-typescript', ['@babel/preset-react', { runtime: 'classic' }]],
  comments: false, compact: true
});
await writeFile('dist/assets/app.js', code);
execFileSync('./node_modules/.bin/tailwindcss', ['-i', 'src/styles.css', '-o', 'dist/assets/styles.css', '--minify'], { stdio: 'inherit' });
console.log('Built FinancialFocus in dist/ for /motionsites-results/financialfocus/');
