const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/waitlist-hero/';
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.webp':'image/webp','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
 const url = decodeURIComponent(req.url.split('?')[0]);
 if (!url.startsWith(base)) { res.writeHead(404); return res.end(); }
 const filename = path.join('/work/dist', url.slice(base.length) || 'index.html');
 if (!fs.existsSync(filename)) {res.writeHead(404);return res.end();}
 const stat = fs.statSync(filename);
 res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
 const range = req.headers.range;
 if(range){const [start,end] = range.replace('bytes=','').split('-');const s=Number(start),e=end?Number(end):stat.size-1;res.writeHead(206,{'Content-Range':`bytes ${s}-${e}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':e-s+1});fs.createReadStream(filename,{start:s,end:e}).pipe(res);}
 else{res.setHeader('Content-Length',stat.size);fs.createReadStream(filename).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
  page.on('request',r=>requests.push(r.url()));
  await page.goto('http://127.0.0.1:4173'+base);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('.page').dataset.playback==='boomerang',{},{timeout:60000});
  const initial=await page.evaluate(()=>({frame:document.querySelector('canvas').dataset.frame,duration:document.querySelector('video').duration}));
  await page.waitForFunction(()=>document.querySelector('canvas').dataset.direction==='-1',{},{timeout:30000});
  const reverseA=await page.locator('canvas').first().getAttribute('data-frame');
  await page.waitForTimeout(180);
  const reverseB=await page.locator('canvas').first().getAttribute('data-frame');
  const buttons=[];
  for(const button of await page.getByRole('button').all()){
   await button.focus();const focused=await button.evaluate(e=>document.activeElement===e);
   await button.hover();await page.waitForTimeout(220);
   const hover=await button.evaluate(e=>({opacity:getComputedStyle(e).opacity,color:getComputedStyle(e).color}));
   await page.mouse.down();await page.waitForTimeout(220);
   const active=await button.evaluate(e=>getComputedStyle(e).transform);
   await page.mouse.up();buttons.push({text:await button.textContent(),focused,hover,active});
  }
  await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur());
  await page.waitForTimeout(220);
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,visibleCanvases:[...document.querySelectorAll('canvas')].filter(e=>e.clientWidth>0).length,frames:Number(document.querySelector('.page').dataset.frames),font:getComputedStyle(document.body).fontFamily,fontLoaded:document.fonts.check('600 24px Inter'),portraitLoaded:document.querySelector('img').naturalWidth>0,canvasPixel:[...document.querySelector('canvas').getContext('2d').getImageData(10,10,1,1).data],heading:document.querySelector('h1').getBoundingClientRect().toJSON()}));
  results.push({viewport:name,layout,initial,reverseA,reverseB,buttons,errors,failed,externalRequests:requests.filter(u=>!u.startsWith('http://127.0.0.1:4173'))});
  await page.close();
 }
 await browser.close();server.close();server.closeAllConnections();
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length||r.failed.length||r.layout.scrollWidth>r.layout.width||r.layout.scrollHeight>r.layout.height||Number(r.reverseB)>=Number(r.reverseA)))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exit(1)});
