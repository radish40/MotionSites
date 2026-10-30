import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
await copyFile('index.html','dist/index.html');
for(const name of ['front.webp','reveal.webp','arimo-OFL.txt','tinos-OFL.txt']) await copyFile('assets/'+name,'dist/assets/'+name);
console.log('Built dist/index.html — native HTML/CSS/JS, relative assets support /motionsites-results/orbit-flora/');
