const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('<title>SpaceEdu') || (html.match(/<style>/g) || []).length !== 1 || html.includes('<script src=')) throw new Error('Invalid single-file page');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
console.log('Built dist/index.html (' + Buffer.byteLength(html) + ' bytes). No runtime dependencies.');
