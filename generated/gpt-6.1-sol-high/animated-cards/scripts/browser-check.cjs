const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/animated-cards/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist')+'/') || !fs.existsSync(file)) {res.writeHead(404); return res.end();}
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results = {};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const errors=[], failedRequests=[], httpErrors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle',timeout:60000}).catch(e=>errors.push(e.message));
  await page.waitForTimeout(2500);
  await page.evaluate(()=>document.fonts.ready);
  const before = await page.locator('[style*="backface-visibility: visible"]').first().getAttribute('style');
  await page.mouse.move(width*.85,height*.25);
  await page.waitForTimeout(600);
  const after = await page.locator('[style*="backface-visibility: visible"]').first().getAttribute('style');
  const tilt = await page.evaluate(()=>Array.from(document.querySelectorAll('[style*="backface-visibility: visible"]')).map(e=>e.style.transform));
  await page.mouse.move(width/2,height/2);
  await page.waitForTimeout(800);
  await page.screenshot({path:`screenshots/${name}.png`});
  results[name] = await page.evaluate(()=>({
   viewport:{width:innerWidth,height:innerHeight},
   overflow:document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight,
   background:getComputedStyle(document.body).backgroundColor,
   perspective:document.querySelector('[style*="perspective"]').style.perspective,
   cardCount:document.querySelectorAll('[style*="backface-visibility: visible"]').length,
   videos:Array.from(document.querySelectorAll('video')).map(v=>({url:v.currentSrc,readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,error:v.error?.message||null,width:v.videoWidth,height:v.videoHeight})),
   fontLoaded:document.fonts.check('500 12px "JetBrains Mono"'),
   fontFaces:Array.from(document.fonts).map(f=>({family:f.family,weight:f.weight,status:f.status})),
  }));
  Object.assign(results[name],{scriptErrors:errors,failedRequests,httpErrors,animationChangesTransform:before!==after,tiltTransforms:tilt});
  await page.close();
 }
 const controlled = await browser.newPage({viewport:{width:1440,height:1000}});
 await controlled.addInitScript(()=>{
  let nextId=0;
  const callbacks=new Map();
  window.requestAnimationFrame=cb=>{callbacks.set(++nextId,cb);return nextId};
  window.cancelAnimationFrame=id=>callbacks.delete(id);
  window.advanceFrames=count=>{for(let i=0;i<count;i++){const batch=[...callbacks.values()];callbacks.clear();batch.forEach(cb=>cb(i*1000/60));}};
 });
 await controlled.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
 results.cycle = await controlled.evaluate(()=>{
  const cards=()=>[...document.querySelectorAll('[style*="backface-visibility: visible"]')];
  const transforms=()=>cards().map(c=>c.style.transform);
  window.advanceFrames(1);
  const initial=transforms();
  const checkpoints=[];
  for(let i=0;i<5;i++){window.advanceFrames(625);checkpoints.push(transforms());}
  const wrapped=transforms();
  window.dispatchEvent(new MouseEvent('mousemove',{clientX:1440,clientY:0}));
  window.advanceFrames(45);
  const tilted=transforms();
  document.dispatchEvent(new MouseEvent('mouseleave'));
  window.advanceFrames(120);
  const returned=transforms();
  return {framesAdvanced:3291,initial,checkpoints,wrapped,fullWrapMatchesStart:JSON.stringify(initial)===JSON.stringify(wrapped),tilted,returned,
    allTransformsFinite:checkpoints.flat().every(t=>!t.includes('NaN')&&!t.includes('Infinity')),
    tiltResponds:tilted.some(t=>/rotateY\((?!0deg)/.test(t)),
    tiltReturnsToCenter:returned.every(t=>/rotateY\(-?0(?:\.00)?deg\)/.test(t))};
 });
 await controlled.close();
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
