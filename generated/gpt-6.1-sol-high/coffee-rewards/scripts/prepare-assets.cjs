// Recreates missing decorative local assets. Original product images and video are unmodified.
const fs = require('fs');
const { chromium } = require('/app/node_modules/playwright-core');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page = await browser.newPage();
 const assets = await page.evaluate(() => {
  const out = {};
  function canvas(w,h,draw){const c=document.createElement('canvas');c.width=w*3;c.height=h*3;const x=c.getContext('2d');x.scale(3,3);x.strokeStyle=x.fillStyle='#ede4d8';draw(x);return c.toDataURL('image/png').split(',')[1];}
  for(const side of ['left','right']) out[`laurel-${side}.png`] = canvas(38,73,x=>{
   if(side==='right'){x.translate(38,0);x.scale(-1,1);}
   x.lineWidth=.9;x.beginPath();x.moveTo(33,71);x.bezierCurveTo(8,58,5,29,22,3);x.stroke();
   for(let i=0;i<10;i++){
    const t=.12+i*.083, y=(1-t)*(1-t)*71+2*(1-t)*t*41+t*t*3, sx=(1-t)*(1-t)*34-4*(1-t)*t+t*t*22;
    x.save();x.translate(sx,y);x.rotate(-.7+t*.8);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-9,-1,-13,-8,-11,-12);x.bezierCurveTo(-4,-11,0,-5,0,0);x.fill();x.restore();
    if(i<9){x.save();x.translate(sx+1,y-2);x.rotate(-.35+t*.5);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(8,-2,12,-8,10,-12);x.bezierCurveTo(3,-10,0,-4,0,0);x.fill();x.restore();}
   }
  });
  out['icon-trophy.png']=canvas(18,18,x=>{x.lineWidth=1.4;x.lineJoin='round';x.beginPath();x.moveTo(5,2);x.lineTo(13,2);x.lineTo(12,9);x.quadraticCurveTo(9,14,6,9);x.closePath();x.stroke();x.beginPath();x.moveTo(5,3);x.lineTo(2,3);x.lineTo(2,6);x.quadraticCurveTo(2,9,6,9);x.moveTo(13,3);x.lineTo(16,3);x.lineTo(16,6);x.quadraticCurveTo(16,9,12,9);x.moveTo(9,12);x.lineTo(9,16);x.moveTo(5,16);x.lineTo(13,16);x.stroke();});
  out['icon-shuffle.png']=canvas(19,19,x=>{x.lineWidth=1.5;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(2,5);x.lineTo(5,5);x.bezierCurveTo(8,5,11,14,14,14);x.lineTo(17,14);x.moveTo(14,11);x.lineTo(17,14);x.lineTo(14,17);x.moveTo(2,14);x.lineTo(5,14);x.bezierCurveTo(8,14,11,5,14,5);x.lineTo(17,5);x.moveTo(14,2);x.lineTo(17,5);x.lineTo(14,8);x.stroke();});
  return out;
 });
 for(const [name,data] of Object.entries(assets)) fs.writeFileSync(`public/assets/images/${name}`,Buffer.from(data,'base64'));
 await browser.close();
})();
