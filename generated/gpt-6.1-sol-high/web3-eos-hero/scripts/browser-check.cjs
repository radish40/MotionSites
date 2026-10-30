const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/web3-eos-hero/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req,res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join('/work/dist', url.startsWith(base) ? url.slice(base.length) || 'index.html' : '__missing__');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  const headers = {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes'};
  if(range) {
    const [startStr,endStr] = range.replace('bytes=','').split('-');
    const start = Number(startStr), end = endStr ? Number(endStr) : stat.size-1;
    res.writeHead(206, {...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end-start+1});
    fs.createReadStream(file, {start,end}).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
    const errors=[], failed=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    page.on('requestfailed',r=>failed.push(r.url()));
    page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
    const video = await page.evaluate(()=>{const v=document.querySelector('video');return {playing:!v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,inline:v.playsInline}});
    assert(video.playing && video.muted && video.loop && video.inline);
    await page.waitForTimeout(250);
    assert(await page.evaluate(t=>document.querySelector('video').currentTime>t,video.time));
    const layout = await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,font:document.fonts.check('500 56px "General Sans"'),headingSize:getComputedStyle(document.querySelector('h1')).fontSize,nav:getComputedStyle(document.querySelector('nav')).display}));
    assert.equal(layout.scrollWidth,width);
    assert(layout.font);
    assert.equal(layout.headingSize,name==='mobile'?'36px':'56px');
    assert.equal(layout.nav,name==='mobile'?'none':'flex');
    for(const button of await page.locator('[data-waitlist]').all()) {
      await button.click();
      await page.waitForFunction(()=>document.querySelector('dialog').open);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
    }
    await page.locator('[data-waitlist]').first().click();
    await page.getByRole('button',{name:'Close waitlist'}).click();
    assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
    await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
    await page.mouse.click(2,2);
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    await page.emulateMedia({reducedMotion:'reduce'});
    assert(await page.locator('video').evaluate(v=>v.paused));
    assert.equal(errors.length,0,errors.join('\n'));
    assert.equal(failed.length,0,failed.join('\n'));
    results.push({name,viewport:{width,height},video,layout,waitlist:'both buttons open; Escape and close button dismiss',reducedMotion:'paused',errors,failed});
    await page.close();
  }
  // Check breakpoint and narrow widths as well as required screenshot sizes.
  const page = await browser.newPage();
  for(const width of [320,375,768,900,1024,1280,1920]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(`http://localhost:4173${base}`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  }
  await browser.close();
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({results,extraWidths:[320,375,768,900,1024,1280,1920]},null,2));
  console.log(JSON.stringify(results,null,2));
  server.close();
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
