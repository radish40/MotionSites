const fs=require('fs');
const {chromium}=require('/app/node_modules/playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage();
 const uri='data:video/mp4;base64,'+fs.readFileSync('public/assets/hero.mp4').toString('base64');
 const data=await page.evaluate(async src=>{const v=document.createElement('video');v.muted=true;v.src=src;await new Promise((r,j)=>{v.onloadeddata=r;v.onerror=j;});v.currentTime=1;await new Promise(r=>v.onseeked=r);const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',.92).split(',')[1];},uri);
 fs.writeFileSync('public/assets/hero-poster.jpg',Buffer.from(data,'base64'));await browser.close();
})();
