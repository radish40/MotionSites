const fs=require('node:fs');
const {chromium}=require('/app/node_modules/playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 const http=require('node:http');const server=http.createServer((q,r)=>r.end('<html></html>')).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 await page.goto('http://127.0.0.1:'+server.address().port);
 const frames=await page.evaluate(async encoded=>{
  const decoder=new ImageDecoder({data:Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)),type:'image/webp'});await decoder.tracks.ready;
  const frames=[];
  for(let i=0;i<decoder.tracks.selectedTrack.frameCount;i++){
   const {image}=await decoder.decode({frameIndex:i});const c=document.createElement('canvas');c.width=image.displayWidth;c.height=image.displayHeight;c.getContext('2d').drawImage(image,0,0);image.close();frames.push(c.toDataURL().split(',')[1]);
  }return frames;
 },fs.readFileSync('scripts/repair/original-preview.webp').toString('base64'));
 fs.mkdirSync('scripts/repair/frames',{recursive:true});frames.forEach((f,i)=>fs.writeFileSync(`scripts/repair/frames/${i}.png`,Buffer.from(f,'base64')));
 console.log('Decoded',frames.length,'frames');await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
