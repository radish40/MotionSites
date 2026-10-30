// Documented approximation: a short camera/light sweep made from fallback photography.
const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:4173/motionsites-results/nike-premium-landing/');
 for(const name of ['hero','innovation']) {
  const encoded=await page.evaluate(async(name)=>{
   const image=new Image(); image.src=`assets/${name}-fallback.jpg`; await image.decode();
   const canvas=document.createElement('canvas'); canvas.width=1280; canvas.height=Math.round(1280*image.height/image.width);
   const ctx=canvas.getContext('2d'); const stream=canvas.captureStream(30);
   const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:3000000});
   const chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);
   const done=new Promise(resolve=>recorder.onstop=async()=>{
    const buffer=await new Blob(chunks).arrayBuffer();
    let data='';const bytes=new Uint8Array(buffer);for(let i=0;i<bytes.length;i+=8192)data+=String.fromCharCode(...bytes.slice(i,i+8192));resolve(btoa(data));
   });
   recorder.start();const start=performance.now();
   await new Promise(resolve=>{
    function draw(now){
     const t=(now-start)/4000;const zoom=1+0.035*Math.sin(t*Math.PI*2);
     const scale=Math.max(canvas.width/image.width,canvas.height/image.height)*zoom;
     const w=image.width*scale,h=image.height*scale;
     ctx.fillStyle='#050505';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,(1280-w)/2,(canvas.height-h)/2,w,h);
     const g=ctx.createLinearGradient(0,0,canvas.width,canvas.height);g.addColorStop(0,'rgba(255,180,140,0.06)');g.addColorStop(1,'rgba(0,0,0,0.08)');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
     if(t<1)requestAnimationFrame(draw);else resolve();
    }requestAnimationFrame(draw);
   });recorder.stop();stream.getTracks().forEach(t=>t.stop());return await done;
  },name);
  fs.writeFileSync(`public/assets/${name}-motion.webm`,Buffer.from(encoded,'base64'));
  console.log(name,'motion generated');
 }
 await browser.close();
})();
