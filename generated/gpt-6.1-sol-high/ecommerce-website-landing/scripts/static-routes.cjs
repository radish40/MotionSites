const fs = require('node:fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
for (const handle of ['semaglutide','tirzepatide','metformin','nad','sermorelin','hair-growth']) {
 const dir = `dist/product/${handle}`;
 fs.mkdirSync(dir, {recursive: true});
 fs.writeFileSync(`${dir}/index.html`, html);
}
console.log('Generated six static product route entries.');
