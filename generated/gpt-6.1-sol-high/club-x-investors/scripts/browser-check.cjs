const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/club-x-investors/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf','.jpg':'image/jpeg','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
 const raw=decodeURIComponent(req.url.split('?')[0]);
 if(!raw.startsWith(base)){res.writeHead(404);return res.end();}
 const file=path.join(process.cwd(),'dist',raw.slice(base.length)||'index.html');
 if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
 const size=fs.statSync(file).size;
 if(req.headers.range){const [a,b]=req.headers.range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
 else {res.setHeader('Content-Length',size);fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results={};
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  const visual=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),font:document.fonts.check('700 16px Inter'),video:{ready:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,width:document.querySelector('video').videoWidth,time:document.querySelector('video').currentTime}}));
  assert.equal(visual.overflow,false,'horizontal overflow');
  assert(visual.images.every(i=>i.loaded),'all images loaded');
  assert(visual.font,'Inter loaded');
  assert(visual.video.ready>=2 && visual.video.playing,'video autoplay');
  await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  await page.locator('.hero-cta').click();
  await assert.equal(await page.locator('#journey-dialog').evaluate(d=>d.open),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#journey-dialog').evaluate(d=>d.open),false);
  await page.locator('.nav-cta').click();
  await page.locator('#journey-dialog .dialog-close').click();
  if(name==='desktop'){
   for(const key of ['studio','about','journal','contact']){
    await page.locator(`[data-panel="${key}"]`).click();
    assert.equal(await page.locator('#info-dialog').evaluate(d=>d.open),true);
    await page.keyboard.press('Escape');
   }
   await page.locator('[data-panel="contact"]').click();
   await page.locator('.dialog-journey').click();
   assert.equal(await page.locator('#journey-dialog').evaluate(d=>d.open),true);
   await page.keyboard.press('Escape');
  }else assert.equal(await page.locator('.nav-links').isVisible(),false);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  results[name]={viewport:{width,height},...visual,scriptErrors:errors,failedRequests:failed,interactions:'passed',screenshot:`screenshots/${name}.png`};
  await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});
 await reduced.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
 results.reducedMotion=await reduced.evaluate(()=>({videoPaused:document.querySelector('video').paused,animation:getComputedStyle(document.querySelector('h1')).animationName}));
 assert.equal(results.reducedMotion.videoPaused,true);assert.equal(results.reducedMotion.animation,'none');
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
