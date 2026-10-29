const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/orbis-cta/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (range) {
    const [startRaw,endRaw] = range.replace('bytes=','').split('-');
    const start = Number(startRaw); const end = endRaw ? Number(endRaw) : size-1;
    res.writeHead(206, {...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  const report = {viewports:[], fallback:null};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[]; const consoleErrors=[]; const failedRequests=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});
      page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
      await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>{ const v=document.querySelector('video'); return v.readyState >= 2 && !v.paused && v.currentTime > 0; },{timeout:30000});
      const initial=await page.locator('video').evaluate(v=>v.currentTime);
      await page.waitForTimeout(350);
      assert(await page.locator('video').evaluate(v=>v.currentTime)>initial,'Video must advance');
      const layout=await page.evaluate(()=>{
        const v=document.querySelector('video'), s=document.querySelector('section'), h=document.querySelector('h2');
        return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth, sectionHeight:s.getBoundingClientRect().height,videoHeight:v.getBoundingClientRect().height,videoWidth:v.videoWidth,videoNaturalHeight:v.videoHeight,headingFont:getComputedStyle(h).fontFamily,headingSize:getComputedStyle(h).fontSize,videoPosition:getComputedStyle(v).position,muted:v.muted,loop:v.loop,fonts:['Anton','Condiment'].map(name=>Array.from(document.fonts).some(f=>f.family===name && f.status==='loaded'))};
      });
      assert(layout.documentWidth<=width,'Horizontal overflow');
      assert.equal(layout.sectionHeight,layout.videoHeight);
      assert.equal(layout.videoPosition,'static');
      assert(layout.muted && layout.loop && layout.fonts.every(Boolean));
      assert.equal(await page.getByRole('button').count(),3);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Mail');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Twitter');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'GitHub');
      await page.evaluate(()=>document.activeElement.blur());
      const mail=page.getByRole('button',{name:'Mail',exact:true});
      const before=await mail.evaluate(b=>getComputedStyle(b).backgroundColor);
      await mail.hover(); await page.waitForTimeout(250);
      const after=await mail.evaluate(b=>getComputedStyle(b).backgroundColor);
      assert.notEqual(before,after,'Hover background changes');
      for (const name of ['Mail','Twitter','GitHub']) { const button=page.getByRole('button',{name,exact:true}); await button.click(); await button.focus(); assert(await button.evaluate(b=>b===document.activeElement)); }
      await page.mouse.move(width-1,height-1); await page.getByRole('button',{name:'GitHub',exact:true}).evaluate(b=>b.blur());
      // Capture the same video instant on both viewports for a stable visual comparison.
      await page.locator('video').evaluate(v=>{v.pause();v.currentTime=1;});
      await page.waitForTimeout(250);
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      assert.deepEqual(errors,[],'No uncaught script errors');
      assert.deepEqual(consoleErrors,[],'No browser console errors');
      report.viewports.push({name,width,height,layout,hover:{before,after},buttons:'click and keyboard focus passed; destinations unspecified by design',scriptErrors:errors,consoleErrors,failedRequests});
      await page.close();
    }
    const page=await browser.newPage();
    await page.route('https://d8j0ntlcm91z4.cloudfront.net/**',r=>r.abort());
    await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.route('https://fonts.gstatic.com/**',r=>r.abort());
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('video').dataset.fallback==='true' && document.querySelector('video').readyState>=2);
    await page.evaluate(()=>document.fonts.ready);
    assert(await page.evaluate(()=>['Anton','Condiment'].every(name=>Array.from(document.fonts).some(f=>f.family===name && f.status==='loaded'))));
    report.fallback=await page.locator('video').evaluate(v=>({passed:true,localFontsLoaded:true,src:v.currentSrc,readyState:v.readyState}));
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close(); server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
