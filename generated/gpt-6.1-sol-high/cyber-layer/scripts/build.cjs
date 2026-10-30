const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
if (/\{\{(?:SG|JB|FILTERS|VIDEO)\}\}/.test(html)) throw Error('Unresolved asset placeholder');
fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
console.log('Built dist/index.html ('+Buffer.byteLength(html)+' bytes). No runtime dependencies.');
