const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const prefix = '/motionsites-results/community-cta/';
const types = {'.html':'text/html','.mp4':'video/mp4','.ttf':'font/ttf','.jpeg':'image/jpeg','.css':'text/css'};
const server = http.createServer((req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const file = path.join(root, pathname.slice(prefix.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  const headers = {'Content-Type': types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if (range) {
    const [,a,b] = /bytes=(\d+)-(\d*)/.exec(range);
    const start=Number(a), end=b?Number(b):size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else {
    res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res);
  }
});
(async()=>{
  await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report={url:`http://127.0.0.1:4173${prefix}`,checks:[],viewports:{}};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[],consoleErrors=[],failedRequests=[],httpErrors=[],requests=[];
      page.on('request',r=>requests.push(r.url()));
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
      page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
      page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
      await page.goto(report.url,{waitUntil:'networkidle',timeout:60000});
      await page.evaluate(async ()=>{await document.fonts.load('700 26px \"DM Sans\"');await document.fonts.ready;});
      await page.waitForFunction(()=>document.querySelector('video').readyState>=2,{timeout:30000});
      const t=await page.locator('video').evaluate(v=>v.currentTime);
      await page.waitForTimeout(700);
      const metrics=await page.evaluate(()=>{
        const v=document.querySelector('video'),card=document.querySelector('.cta-wrapper'),h=document.querySelector('h2');
        const r=card.getBoundingClientRect();
        return {viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,card:{x:r.x,y:r.y,width:r.width,height:r.height},font:document.fonts.check('700 26px "DM Sans"'),headingSize:getComputedStyle(h).fontSize,video:{readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,playsInline:v.playsInline},cardShadow:getComputedStyle(card).boxShadow};
      });
      const portraits=await page.locator('.cta-avatars span').evaluateAll(async els=>Promise.all(els.map(async el=>{
        const style=getComputedStyle(el), rect=el.getBoundingClientRect();
        const url=style.backgroundImage.slice(5,-2);
        const image=new Image(); image.src=url; await image.decode();
        return {url,width:rect.width,height:rect.height,imageWidth:image.naturalWidth,imageHeight:image.naturalHeight,borderRadius:style.borderRadius,x:rect.x,y:rect.y,label:el.title};
      })));
      assert.equal(portraits.length,4);
      assert.equal(new Set(portraits.map(p=>p.url)).size,4,'Four distinct portraits');
      for (const portrait of portraits) {
        assert(portrait.imageWidth>0 && portrait.imageHeight>0,'Portrait must decode');
        assert.equal(portrait.width,name==='desktop'?32:28);
        assert.equal(portrait.height,portrait.width);
        assert.equal(portrait.borderRadius,'50%');
        assert(portrait.x>=0 && portrait.x+portrait.width<=width && portrait.y>=0 && portrait.y+portrait.height<=height,'Portrait visible inside viewport');
        assert(portrait.label.includes('Approximate decorative'));
      }
      assert.equal(metrics.scrollWidth,width,'Page must not overflow');
      assert(metrics.font,'DM Sans must load');
      assert(!metrics.video.paused && metrics.video.currentTime>t,'Video must autoplay and advance');
      assert(metrics.video.muted && metrics.video.loop && metrics.video.playsInline);
      assert.equal(metrics.cardShadow,'none');
      assert.equal(metrics.headingSize,name==='desktop'?'26px':'19px');
      const input=page.getByRole('textbox',{name:'Email address'}),button=page.getByRole('button',{name:'Join Now'});
      const before=await input.evaluate(el=>getComputedStyle(el).borderColor);
      await input.focus(); await page.waitForTimeout(250);
      const after=await input.evaluate(el=>getComputedStyle(el).borderColor);
      assert.notEqual(before,after,'Focus border changes');
      await input.fill('member@example.com');
      assert(await input.evaluate(el=>el.validity.valid));
      await input.fill('invalid');
      assert.equal(await input.evaluate(el=>el.validity.valid),false);
      await input.fill('');
      await input.press('Tab'); assert(await button.evaluate(el=>el===document.activeElement));
      await button.hover(); await page.waitForTimeout(250);
      assert.equal(await button.evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, -1)');
      await page.mouse.down(); await page.waitForTimeout(180);
      assert.equal(await button.evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, 0)');
      await page.mouse.up();
      await button.click();
      await button.evaluate(el=>el.blur()); await page.mouse.move(0,0); await page.waitForTimeout(250);
      // Deterministic screenshot frame; playback was verified above. This only pauses the test page.
      await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=1;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));});
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      assert.equal(errors.length,0,'No page script errors');
      assert.equal(consoleErrors.length,0,'No console errors');
      assert.equal(failedRequests.length,0,'No failed network requests');
      assert.equal(httpErrors.length,0,'No HTTP errors');
      assert(requests.every(url=>url.startsWith(report.url)),'All runtime resources are local; no original CleanShot requests');
      report.viewports[name]={...metrics,portraits,scriptErrors:errors,consoleErrors,failedRequests,httpErrors,requests,screenshot:`screenshots/${name}.png`,interactions:['focus styling','valid and invalid email states','keyboard tab to button','hover lift','active reset','button click (visual-only per prompt)']};
      await page.close();
    }
    report.checks=['Static production build served at required subpath','Desktop 1440x1000 and mobile 390x844','No horizontal overflow','Local DM Sans loaded','Original MP4 decoded and autoplay advanced','Muted, loop, playsinline verified','Input and button states verified','Four distinct cached portraits decoded, correctly sized and visible','No JavaScript or console errors','No failed requests or HTTP errors','All runtime requests local; unavailable originals never requested','Required screenshots captured'];
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
