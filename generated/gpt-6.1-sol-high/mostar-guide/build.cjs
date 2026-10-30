const fs = require('node:fs');
fs.mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js']) fs.copyFileSync(file, `dist/${file}`);
fs.cpSync('assets', 'dist/assets', { recursive:true });
console.log('Built dist/index.html, dist/styles.css, dist/script.js');
