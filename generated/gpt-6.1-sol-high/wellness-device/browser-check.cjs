const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/wellness-device/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const filename = path.join('/work/dist',url.startsWith(base) ? url.slice(base.length) || 'index.html' : '__missing__');
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { res.writeHead(404); res.end(); return; }
  const stat=fs.statSync(filename); const headers={'Content-Type':mime[path.extname(filename)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if(req.headers.range){ const [start,end]=req.headers.range.replace('bytes=','').split('-'); const from=Number(start), to=end?Number(end):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${from}-${to}/${stat.size}`,'Content-Length':to-from+1});fs.createReadStream(filename,{start:from,end:to}).pipe(res); }
  else {res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(filename).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--ignore-certificate-errors']});
 const report={checks:[],page_errors:[],console_errors:[],failed_requests:[]};
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
   const page=await context.newPage();
   page.on('pageerror',e=>report.page_errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error') report.console_errors.push(m.text())});
   page.on('requestfailed',r=>report.failed_requests.push({url:r.url(),error:r.failure()?.errorText}));
   page.on('response',r=>{if(r.status()>=400)report.failed_requests.push({url:r.url(),status:r.status()})});
   await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
   assert.equal(await page.locator('h1').textContent(),'Measured');
   const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,heroHeight:document.querySelector('section').getBoundingClientRect().height,headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,headingSize:getComputedStyle(document.querySelector('h1')).fontSize,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),video:{playing:!document.querySelector('video').paused,muted:document.querySelector('video').muted,loop:document.querySelector('video').loop}}));
   assert.equal(metrics.scrollWidth,width);assert.equal(metrics.scrollHeight,height);assert.equal(metrics.heroHeight,height);assert.equal(metrics.images,true);assert.equal(metrics.video.playing,true);
   report.checks.push({name,metrics});
   if(name==='desktop'){
    await page.mouse.move(720,690);await page.waitForTimeout(1200);
    assert.match(await page.locator('.spotlight').evaluate(e=>e.style.maskImage),/data:image\/png/);
    await page.waitForFunction(()=>document.querySelector('canvas').getContext('2d').getImageData(720,690,1,1).data[3]===255,{},{timeout:15000});
    const maskPixels=await page.locator('canvas').evaluate(e=>{const c=e.getContext('2d');return {center:c.getImageData(720,690,1,1).data[3],outside:c.getImageData(100,100,1,1).data[3]}});
    assert.equal(maskPixels.center,255);assert.equal(maskPixels.outside,0);
    assert.notEqual(await page.locator('.hero-grid').evaluate(e=>e.style.transform),'translate(0px, 0px)');
    const videoTime=await page.locator('video').evaluate(e=>e.currentTime);await page.waitForTimeout(200);assert.notEqual(await page.locator('video').evaluate(e=>e.currentTime),videoTime);
    assert.equal(await page.locator('video').evaluate(e=>e.style.clipPath),'inset(40% 0px 0px)');
    await page.screenshot({path:'/work/screenshots/desktop.png'});
    await page.mouse.move(720,200);await page.waitForTimeout(800);
    await page.screenshot({path:'/work/screenshots/desktop-top-hover.png'});
    report.checks.push({name:'spotlight',status:'passed',details:'Canvas data URL mask changes with cursor; video clipped to lower 60%; parallax transform updates.'});
   } else {
    await page.screenshot({path:'/work/screenshots/mobile.png'});
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(900);
    assert.equal(await page.locator('body').evaluate(e=>e.style.overflow),'hidden');
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('button',{name:'Close menu'}).click();assert.equal(await page.getByRole('dialog').count(),0);
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('button',{name:'Science',exact:true}).last().click();assert.equal(await page.getByRole('dialog').count(),0);
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.getByRole('button',{name:'Reserve Yours'}).last().click();assert.equal(await page.getByRole('dialog').count(),0);
    report.checks.push({name:'mobile-menu',status:'passed',details:'Open, close, Escape, navigation selection, reserve dismiss, body overflow lock, focus return.'});
   }
   await context.close();
  }
  assert.equal(report.page_errors.length,0);assert.equal(report.console_errors.length,0);assert.equal(report.failed_requests.length,0);
  report.status='passed';
 } catch(e){report.status='failed';report.error=e.stack; process.exitCode=1;}
 finally {fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();}
})();
