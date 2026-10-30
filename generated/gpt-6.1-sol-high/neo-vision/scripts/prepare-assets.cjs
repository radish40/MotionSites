// Replacement imagery uses only frames from the supplied original videos.
const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
const http=require('http');
const path=require('path');
const root='/work/public';
const server=http.createServer((req,res)=>{const p=path.join(root,req.url);if(req.url==='/'||!fs.existsSync(p)){res.end('');return;}res.setHeader('Content-Type',p.endsWith('.mp4')?'video/mp4':'text/html');res.end(fs.readFileSync(p));}).listen(4174,'0.0.0.0');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const page=await browser.newPage();await page.goto('http://localhost:4174/');
const logo=await page.evaluate(()=>{let c=document.createElement('canvas');c.width=520;c.height=96;let x=c.getContext('2d');x.fillStyle='#171717';x.beginPath();x.moveTo(3,76);x.lineTo(3,20);x.lineTo(21,20);x.lineTo(54,65);x.lineTo(54,20);x.lineTo(68,20);x.lineTo(68,76);x.lineTo(50,76);x.lineTo(17,31);x.lineTo(17,76);x.fill();x.font='500 55px sans-serif';x.fillText('NeoVision',87,69);return c.toDataURL('image/png').split(',')[1];});fs.writeFileSync(root+'/image.png',Buffer.from(logo,'base64'));
for(const [name,file,time] of [['Mask_group.jpg','about.mp4',2],['Mask_group-1.jpg','hero.mp4',4],['Mask_group-2.jpg','about.mp4',6]]){
const data=await page.evaluate(async({file,time})=>{let v=document.createElement('video');v.muted=true;v.src='/assets/'+file;await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=()=>j(new Error('video loading failed'));});v.currentTime=Math.min(time,v.duration-.1);await new Promise(r=>v.onseeked=r);let c=document.createElement('canvas');c.width=1200;c.height=900;let x=c.getContext('2d');let scale=Math.max(1200/v.videoWidth,900/v.videoHeight);let w=v.videoWidth*scale,h=v.videoHeight*scale;x.drawImage(v,(1200-w)/2,(900-h)/2,w,h);return c.toDataURL('image/jpeg',.94).split(',')[1];},{file,time});fs.writeFileSync(root+'/'+name,Buffer.from(data,'base64'));console.log('Prepared '+name);}
await browser.close();server.close();})().catch(e=>{console.error(e);server.close();process.exit(1)});
