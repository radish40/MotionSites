const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/financialfocus/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp4':'video/mp4','.ttf':'font/ttf','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) {res.writeHead(404).end();return;}
  const file = path.join(process.cwd(), 'dist', url.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404).end();return;}
  const stat=fs.statSync(file); const range=req.headers.range;
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};
  if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const report={};
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
   const errors=[],failed=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));
   await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await Promise.all(['Inter','Manrope','JetBrains Mono','Mr Dafoe'].map(f=>document.fonts.load(`16px "${f}"`)));await document.fonts.ready;});
   await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2),{timeout:30000});
   const data=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.getAttribute('src'),readyState:v.readyState,paused:v.paused,time:v.currentTime})),fonts:['Inter','Manrope','JetBrains Mono','Mr Dafoe'].map(f=>({family:f,loaded:document.fonts.check(`16px "${f}"`)}))}));
   assert.equal(data.overflow,false); assert(data.images.every(i=>i.loaded));assert(data.videos.every(v=>!v.paused));
   const card=page.locator('div[style*="backface-visibility: visible"]').first();
   const before=await page.locator('div[style*="backface-visibility: visible"]').evaluateAll(els=>els.map(e=>e.style.transform).join('|')); await page.waitForFunction(before=>[...document.querySelectorAll('div[style*="backface-visibility: visible"]')].map(e=>e.style.transform).join('|')!==before,before,{timeout:20000}); const after=await card.getAttribute('style');
   let parallax=null;
   if(name==='desktop'){await page.mouse.move(1400,100);await page.waitForTimeout(400);parallax=await card.getAttribute('style');assert.notEqual(after,parallax);assert(!parallax.includes('rotateY(0deg)'));await page.mouse.move(720,500);await page.waitForTimeout(300);}
   const order=page.getByRole('button',{name:'Order Card'});const menu=page.getByRole('button',{name:'Menu',exact:true});
   await order.click();await menu.click();
   await order.focus();await page.keyboard.press('Tab');const keyboardFocus=await menu.evaluate(el=>el===document.activeElement);assert(keyboardFocus);assert(data.fonts.every(f=>f.loaded));
   await page.mouse.move(width/2,height/2);
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   console.log(JSON.stringify({name,errors,failed},null,2));assert.equal(errors.length,0);assert.equal(failed.filter(r=>r.error?.errorText!=='net::ERR_ABORTED').length,0);
   report[name]={viewport:{width,height},...data,animation:true,mouseParallax:name==='desktop'?true:'not applicable',buttons:'clickable; prompt supplies hover/active states only',keyboardFocus,errors,failed};
   await page.close();
  }
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.closeAllConnections();server.close();process.exitCode=1;});
