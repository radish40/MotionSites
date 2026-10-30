// Isolated thumbnail only; the reference page is never used as a page asset.
const fs = require('node:fs');
const {chromium} = require('/app/node_modules/playwright-core');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage();
 const data=fs.readFileSync(process.argv[2] || '/reference.webp').toString('base64');
 const result=await page.evaluate(async(data)=>{
  const img=new Image(); img.src='data:image/webp;base64,'+data; await img.decode();
  const canvas=document.createElement('canvas');canvas.width=160;canvas.height=160;
  const ctx=canvas.getContext('2d');ctx.drawImage(img,1052,658,160,160,0,0,160,160);
  // Remove screenshot's baked-in play control with feathered surrounding smoke.
  const pixels=ctx.getImageData(0,0,160,160), src=new Uint8ClampedArray(pixels.data);
  for(let y=0;y<160;y++)for(let x=0;x<160;x++){
   const dx=x-80,dy=y-80,r=Math.hypot(dx,dy);
   if(r<28){const a=Math.min(1,(28-r)/5); const sx=x-40,sy=y-15;
    for(let c=0;c<3;c++){const i=(y*160+x)*4+c;pixels.data[i]=src[i]*(1-a)+src[(sy*160+Math.max(0,sx))*4+c]*a;}
   }
  }
  ctx.putImageData(pixels,0,0);return canvas.toDataURL('image/png').split(',')[1];
 },data);
 fs.writeFileSync('assets/watch-demo-thumbnail.png',Buffer.from(result,'base64'));
 await browser.close();
})();
