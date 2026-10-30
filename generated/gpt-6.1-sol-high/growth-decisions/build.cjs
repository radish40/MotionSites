const fs = require('node:fs');
fs.mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'main.js']) {
  fs.copyFileSync(file, `dist/${file}`);
}
console.log('Built static site in dist/ for /motionsites-results/growth-decisions/');
