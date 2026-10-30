const fs=require('node:fs');
const files=['index.html','inter.woff2','instrument-serif-italic.woff2','hero-wave.webp','hero-poster.webp'];
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist');
files.forEach(file=>fs.copyFileSync(file,`dist/${file}`));
console.log('Built Agent Wave for /motionsites-results/agent-wave/ (relative assets).');
