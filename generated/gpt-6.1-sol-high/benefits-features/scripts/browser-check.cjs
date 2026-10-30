const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('node:assert/strict');
const http = require('http');
const path = require('path');
const base = '/motionsites-results/benefits-features/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(base,''));
  const target = req.url.split('?')[0] === base ? '/work/dist/index.html' : file;
  fs.readFile(target,(err,data) => {res.writeHead(err?404:200, {'Content-Type': types[path.extname(target)] || 'application/octet-stream'});res.end(err?'Not found':data);});
});
(async () => {
 await new Promise(r=>server.listen(4173,r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--no-proxy-server']});
 const results=[];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failedRequests=[],httpErrors=[],consoleErrors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push({text:m.text(),location:m.location()});});
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
  // Observe the real rendered text before viewport entry; do not mock clocks or triggers.
  await page.addInitScript(() => {
   window.counterSamples=[];
   const sample=source=>{
    const el=document.querySelector('[data-testid="counter"]');
    if(el)window.counterSamples.push({timeMs:performance.now(),text:el.textContent,value:Number(el.textContent.replace('%','')),source});
   };
   const observer=new MutationObserver(()=>{
    if(document.querySelector('[data-testid="counter"]')){sample('initial DOM');observer.disconnect();}
   });
   observer.observe(document,{subtree:true,childList:true});
   window.counterSampleTimer=setInterval(()=>sample('25ms interval'),25);
  });
  await page.goto('http://localhost:4173'+base,{waitUntil:'domcontentloaded'});
  await page.locator('[data-testid="counter"]').waitFor({state:'attached'});
  if(name==='mobile'){
   assert.equal(await page.locator('[data-testid="counter"]').textContent(),'0%');
  }
  // Native scrolling makes Motion's actual onViewportEnter fire on mobile.
  await page.locator('[data-testid="counter"]').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('[data-testid="counter"]').textContent==='86%');
  await page.waitForTimeout(750);
  const counterSamples=await page.evaluate(()=>{clearInterval(window.counterSampleTimer);return window.counterSamples;});
  assert.equal(counterSamples[0].text,'0%');
  assert.equal(counterSamples.at(-1).text,'86%');
  assert.ok(counterSamples.some(s=>s.value>0 && s.value<86),'must observe intermediate positive values');
  assert.ok(counterSamples.at(-1).timeMs-counterSamples.find(s=>s.value>0).timeMs>=2000,'sampling must continue beyond the full two-second animation');
  assert.ok(counterSamples.every((s,i)=>Number.isInteger(s.value) && s.value>=0 && s.value<=86 && (i===0 || s.value>=counterSamples[i-1].value)),'all samples must be bounded and nondecreasing');
  await page.evaluate(()=>document.fonts.ready);
  const defaultExpanded = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded');
  await page.getByRole('button',{name:'Sport Pacakge'}).click();
  await page.waitForTimeout(500);
  const sportExpanded = await page.getByRole('region',{name:'Sport Pacakge'}).isVisible();
  const connectionCollapsed = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded') === 'false';
  await page.getByRole('button',{name:'Connections'}).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const keyboardExpanded = await page.getByRole('button',{name:'Connections'}).getAttribute('aria-expanded') === 'true';
  await page.locator('video').scrollIntoViewIfNeeded();
  // Loop boundaries can briefly report readyState 1. Wait for actual decoded frames.
  const decodedFrames=await page.evaluate(()=>new Promise((resolve,reject)=>{
   const video=document.querySelector('video');
   const frames=[];
   const timeout=setTimeout(()=>reject(new Error('No two decoded visible video frames within 20 seconds')),20000);
   const collect=(now,metadata)=>{
    const rect=video.getBoundingClientRect();
    if(video.readyState>=2 && !video.paused && rect.bottom>0 && rect.top<innerHeight){
     frames.push({timeMs:now,mediaTime:metadata.mediaTime,presentedFrames:metadata.presentedFrames,width:metadata.width,height:metadata.height,readyState:video.readyState});
    }
    if(frames.length===2){clearTimeout(timeout);resolve(frames);}else video.requestVideoFrameCallback(collect);
   };
   video.requestVideoFrameCallback(collect);
  }));
  assert.ok(decodedFrames[1].presentedFrames>decodedFrames[0].presentedFrames);
  assert.ok(decodedFrames.every(f=>f.width>0 && f.height>0));
  const data=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth,
   font:document.fonts.check('500 18px Inter'),
   video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,currentTime:document.querySelector('video').currentTime,error:document.querySelector('video').error?.message||null},
   counter:document.querySelector('[data-testid="counter"]').textContent,
   fallback:!!document.querySelector('.inline-fallback'),
   cardBounds:document.querySelector('video').parentElement.getBoundingClientRect().toJSON()
  }));
  await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0);});
  await page.mouse.move(0,0);
  await page.waitForTimeout(500);
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  assert.equal(defaultExpanded,'true');
  assert.ok(sportExpanded && connectionCollapsed && keyboardExpanded);
  assert.equal(data.overflow,false);
  assert.ok(data.font && !data.video.paused && data.video.error===null);
  assert.equal(data.counter,'86%');
  assert.deepEqual(errors,[]);
  results.push({name,viewport:{width,height},defaultExpanded,sportExpanded,connectionCollapsed,keyboardExpanded,...data,counterSampling:{intervalMs:25,first:counterSamples[0].value,final:counterSamples.at(-1).value,hasIntermediatePositive:true,allInRange:true,nondecreasing:true,samples:counterSamples},decodedFrames,errors,failedRequests,httpErrors,consoleErrors});
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(({counterSampling,...r})=>({...r,counterSampling:{...counterSampling,samples:counterSampling.samples.length}})),null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
