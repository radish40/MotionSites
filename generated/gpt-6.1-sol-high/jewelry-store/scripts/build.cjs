const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
console.log('Built native HTML/CSS/JavaScript site in dist/');
