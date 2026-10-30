const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/terra-geo-map/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.ttf':'font/ttf', '.svg':'image/svg+xml' };
const server = http.createServer((req,res)=>{
  let name = decodeURIComponent(req.url.split('?')[0]);
  if(!name.startsWith(base)) {res.writeHead(404).end();return;}
  const file = path.join('/work/dist', name.slice(base.length) || 'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size;
  const headers={'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if(req.headers.range){const [a,b]=req.headers.range.replace('bytes=','').split('-');const start=Number(a); const end=b?Number(b):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors=[],failedRequests=[],checks=[];
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=3 && v.currentTime>0});
  const metrics=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,fontLoaded:document.fonts.check('500 72px Inter'),video:{width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight,paused:document.querySelector('video').paused,currentTime:document.querySelector('video').currentTime,muted:document.querySelector('video').muted},headingSpacing:getComputedStyle(document.querySelector('h1')).letterSpacing}));
  assert.equal(metrics.documentWidth,width);assert(metrics.fontLoaded);assert(!metrics.video.paused);assert(metrics.video.muted);
  await page.evaluate(async()=>{const v=document.querySelector('video');v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  await page.screenshot({path:`/work/screenshots/${name}-full.png`,fullPage:true});
  if(name==='desktop'){
   await page.getByRole('button',{name:'Product',exact:true}).click();await page.getByRole('button',{name:'Map builder',exact:false}).waitFor();
   await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-Product').count(),0);
   await page.getByRole('button',{name:'Login',exact:true}).click();assert(await page.getByRole('dialog').isVisible());
   await page.locator('#email').fill('tester@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('heading',{name:'Explore your next map'}).waitFor();await page.getByRole('button',{name:'Close',exact:true}).click();
   await page.getByRole('button',{name:'Sign Up',exact:true}).click();await page.getByRole('heading',{name:'Your world, mapped.'}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  }else{
   await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).waitFor();
   await page.getByRole('button',{name:'Solutions',exact:true}).click();await page.getByRole('button',{name:'For teams',exact:false}).waitFor();
   await page.getByRole('button',{name:'Close menu'}).click();assert.equal(await page.locator('#mobile-navigation').count(),0);
   await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Sign Up',exact:true}).click();assert.equal(await page.locator('#mobile-navigation').count(),0);await page.getByRole('button',{name:'Close',exact:true}).click();
  }
  await page.getByRole('button',{name:'Get started for free',exact:true}).click();assert(await page.locator('video').evaluate(v=>v.controls));
  checks.push({name,viewport:`${width}x${height}`,metrics,interactions:'passed',screenshot:`screenshots/${name}.png`});
  await page.close();
 }
 assert.deepEqual(errors,[]); assert.deepEqual(failedRequests,[]);
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify({status:'passed',checks,errors,failedRequests},null,2));
 console.log(JSON.stringify({status:'passed',checks,errors,failedRequests},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
