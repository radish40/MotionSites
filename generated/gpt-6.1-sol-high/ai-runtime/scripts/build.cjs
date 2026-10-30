const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(dist, {recursive:true});
for (const file of ['index.html', 'styles.css', 'main.js', 'assets', 'fonts']) {
  fs.cpSync(path.join(root, file), path.join(dist, file), {recursive:true});
}
console.log('Built static site in dist/ for /motionsites-results/ai-runtime/');
