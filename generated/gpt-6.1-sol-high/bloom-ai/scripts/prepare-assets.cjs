const { chromium } = require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('file:///work/scripts/assets.html');
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 await page.evaluate(()=>new Promise(resolve=>{let v=document.querySelector('video');v.onseeked=resolve;v.currentTime=2;}));
 for(const name of ['poster','hero-flowers','logo']){
 const data=await page.evaluate(name=>{
 const c=document.createElement('canvas'),x=c.getContext('2d'),v=document.querySelector('video');
 if(name==='logo'){
 c.width=c.height=240;x.translate(120,120);x.fillStyle='white';
 for(let i=0;i<8;i++){x.save();x.rotate(i*Math.PI/4);x.beginPath();x.ellipse(0,-49,21,48,0,0,Math.PI*2);x.fill();x.restore();}
 x.beginPath();x.arc(0,0,23,0,Math.PI*2);x.fill();
 }else if(name==='poster'){c.width=v.videoWidth;c.height=v.videoHeight;x.drawImage(v,0,0);}
 else{
 c.width=768;c.height=512;const bg=x.createLinearGradient(0,0,768,512);bg.addColorStop(0,'#696969');bg.addColorStop(1,'#151515');x.fillStyle=bg;x.fillRect(0,0,768,512);
 x.translate(394,272);x.rotate(-.2);
 for(let ring=0;ring<4;ring++){
 const n=15-ring*2,len=192-ring*39,width=49-ring*9;
 for(let i=0;i<n;i++){
 x.save();x.rotate(i*Math.PI*2/n+ring*.3);x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=12;x.shadowOffsetX=4;
 const g=x.createLinearGradient(-width,0,width,-len);g.addColorStop(0,'#565656');g.addColorStop(.47,'#bdbdbd');g.addColorStop(.8,'#f4f4f4');g.addColorStop(1,'#b5b5b5');x.fillStyle=g;x.beginPath();x.moveTo(0,14);x.bezierCurveTo(-width*1.5,-len*.3,-width,-len*.9,0,-len);x.bezierCurveTo(width,-len*.9,width*1.5,-len*.3,0,14);x.fill();x.restore();
 }
 }
 const core=x.createRadialGradient(-4,-4,1,0,0,20);core.addColorStop(0,'#fff');core.addColorStop(1,'#777');x.fillStyle=core;x.beginPath();x.arc(0,0,17,0,Math.PI*2);x.fill();
 }
 return c.toDataURL('image/png').split(',')[1];},name);
 fs.writeFileSync(name==='logo'?'/work/public/logo.png':`/work/public/assets/${name}.png`,Buffer.from(data,'base64'));
 }
 console.log(await page.evaluate(()=>({width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight,duration:document.querySelector('video').duration})));
 await browser.close();
})();
