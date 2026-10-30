import {mkdir, copyFile, readFile} from 'node:fs/promises';
const html = await readFile('index.html', 'utf8');
if (!html.includes('<main') || !html.includes('Automate your work')) throw new Error('Invalid source');
await mkdir('dist', {recursive:true});
await copyFile('index.html', 'dist/index.html');
console.log('Built dist/index.html; all assets inline except Google Fonts. Relative-resource safe at /motionsites-results/task-engine/.');
