// Recover only isolated artwork from this project's supplied reference.
// No page copy, chart, label, or logo is retained in the generated assets.
const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage();
 await page.goto('about:blank');
 const src='data:image/webp;base64,'+fs.readFileSync('/work/scripts/source-reference.webp').toString('base64');
 const results=await page.evaluate(async(src)=>{
  const original=new Image(); original.src=src; await original.decode();
  function extract(path){const c=document.createElement('canvas');c.width=640;c.height=472;const x=c.getContext('2d');x.clip(new Path2D(path));x.drawImage(original,0,0);return c;}
  const rocks=extract('M 104 91 L 114 71 L 155 41 L 185 30 L 225 26 L 266 30 L 295 38 L 305 49 L 299 70 L 273 87 L 267 92 L 135 92 L 134 156 L 119 145 L 109 120 Z M 142 176 L 169 176 L 153 188 Z M 221 415 L 248 380 L 256 348 L 255 317 L 266 279 L 281 242 L 303 216 L 334 188 L 368 164 L 390 166 L 418 183 L 442 229 L 455 260 L 472 290 L 497 276 L 516 231 L 531 237 L 548 264 L 566 270 L 579 268 L 593 276 L 608 290 L 618 314 L 608 346 L 605 374 L 603 393 L 588 419 L 579 437 L 565 430 L 571 405 L 565 379 L 547 361 L 467 358 L 468 380 L 433 382 L 400 378 L 368 389 L 339 405 L 311 417 L 277 426 L 245 422 Z');
  // Align the obscured upper-rock area with the live desktop card.
  const upper=document.createElement('canvas');upper.width=320;upper.height=200;upper.getContext('2d').drawImage(rocks,0,0);rocks.getContext('2d').clearRect(0,0,320,200);rocks.getContext('2d').drawImage(upper,6,11);
  const shoe=extract('M 388 267 L 390 251 L 399 231 L 411 211 L 419 190 L 428 166 L 433 141 L 438 132 L 454 131 L 469 136 L 485 124 L 497 108 L 504 102 L 511 102 L 517 111 L 521 126 L 530 138 L 539 149 L 550 156 L 557 169 L 556 181 L 545 197 L 527 215 L 509 230 L 485 247 L 462 265 L 437 280 L 419 287 L 406 287 L 397 281 Z');
  const base=document.createElement('canvas');base.width=1280;base.height=944;const b=base.getContext('2d');b.scale(2,2);b.fillStyle='#101111';b.fillRect(0,0,640,472);b.drawImage(rocks,0,0);b.drawImage(shoe,0,0);
  // Reconstructed ambient motion, not the unavailable original video.
  const movie=document.createElement('canvas');movie.width=1280;movie.height=944;const m=movie.getContext('2d');
  const stream=movie.captureStream(24);const rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:5000000});const chunks=[];rec.ondataavailable=e=>chunks.push(e.data);const done=new Promise(r=>rec.onstop=r);rec.start();
  const start=performance.now();await new Promise(resolve=>{function frame(now){const t=(now-start)/1000;m.save();m.scale(2,2);m.fillStyle='#101111';m.fillRect(0,0,640,472);m.translate(Math.sin(t*Math.PI/3)*2,Math.sin(t*Math.PI/3)*2);m.drawImage(rocks,0,0);m.save();m.globalCompositeOperation='screen';const g=m.createRadialGradient(471,277,5,471,277,210);g.addColorStop(0,'rgba(218,58,22,'+(0.10+Math.sin(t*Math.PI/3)*.025)+')');g.addColorStop(1,'rgba(218,58,22,0)');m.fillStyle=g;m.fillRect(215,150,405,290);m.restore();m.save();m.translate(0,-Math.sin(t*Math.PI/3)*5);m.drawImage(shoe,0,0);m.restore();m.restore();if(t<6)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});rec.stop();await done;
  const blob=new Blob(chunks,{type:'video/webm'});const vid=await new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result);reader.readAsDataURL(blob)});
  return {overlay:base.toDataURL('image/png'),rocks:rocks.toDataURL('image/png'),shoe:shoe.toDataURL('image/png'),video:vid};
 },src);
 for(const [key,value]of Object.entries(results))fs.writeFileSync('/work/public/assets/'+({overlay:'overlay.png',rocks:'rocks.png',shoe:'shoe.png',video:'reveal.webm'}[key]),Buffer.from(value.split(',')[1],'base64'));
 await browser.close();
})();
