const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/buzzentic-agency/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf','.svg':'image/svg+xml'};
const server = http.createServer((req,res)=>{
  const url = decodeURIComponent(req.url.split('?')[0]);
  if(!url.startsWith(base)){res.writeHead(404).end();return;}
  const file = path.join(process.cwd(),'dist',url.slice(base.length)||'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  const size=fs.statSync(file).size;
  const range=req.headers.range;
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  if(range){const parts=range.replace('bytes=','').split('-');const start=Number(parts[0]);const end=parts[1]?Math.min(Number(parts[1]),size-1):size-1;res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.writeHead(200,{'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const errors=[],failed=[]; const results={};
 try{
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,acceptDownloads:true,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
  const metrics=await page.evaluate(()=>{const v=document.querySelector('video'); const h=document.querySelector('.hero'); return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,video:{playing:!v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,inline:v.playsInline,filter:getComputedStyle(v).filter},paddingBottom:getComputedStyle(h).paddingBottom,fonts:document.fonts.check('300 64px Barlow')&&document.fonts.check('italic 64px "Instrument Serif"'),corners:[...document.querySelectorAll('.corner')].map(e=>({width:e.offsetWidth,height:e.offsetHeight}))};});
  assert.equal(metrics.scrollWidth,width); assert.equal(metrics.scrollHeight,height); assert(metrics.video.playing); assert(metrics.fonts);assert.equal(metrics.paddingBottom,'250px');assert(metrics.corners.every(x=>x.width===7&&x.height===7));
  await page.evaluate(async()=>{const v=document.querySelector('video'); v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  if(name==='mobile') {await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('button',{name:'What we do',exact:true}).click();assert(await page.locator('dialog').isVisible());await page.getByRole('button',{name:'Close dialog'}).click();assert.equal(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');}
  else {for(const label of ['About us','What we do','Our approach']){await page.getByRole('button',{name:label,exact:true}).click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog').isVisible()));}
    const cta=page.getByRole('button',{name:'Let’s create a buzz'});await cta.hover();await page.waitForTimeout(300);assert.equal(await cta.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
  }
  await page.getByRole('button',{name:'About the Featured in Fortune badge'}).click();assert(await page.locator('dialog').isVisible());await page.getByRole('button',{name:'Close dialog'}).click();
  await page.getByRole('button',{name:'Let’s create a buzz'}).click();
  await page.getByLabel('Your name').fill('Test Creator');await page.getByLabel('Email address').fill('creator@example.com');await page.getByLabel('What are you dreaming up?').fill('A series of brand storytelling reels.');
  const downloadPromise=page.waitForEvent('download'); await page.getByRole('button',{name:'Save project brief'}).click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'buzzentic-project-brief.txt');assert(await page.getByRole('status').textContent().then(t=>t.includes('No information has been sent')));await page.getByRole('button',{name:'Close dialog'}).click();
  results[name]={...metrics,interactions:'passed',screenshot:`screenshots/${name}.png`};
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify({results,scriptErrors:errors,failedResponses:failed},null,2));
 console.log(JSON.stringify({results,scriptErrors:errors,failedResponses:failed},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
