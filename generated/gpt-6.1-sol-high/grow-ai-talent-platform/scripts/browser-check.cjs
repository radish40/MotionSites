const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const prefix = '/motionsites-results/grow-ai-talent-platform/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.mp4': 'video/mp4' };
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(prefix, '');
  const file = path.join(process.cwd(), 'dist', relative || 'index.html');
  if (!file.startsWith(path.join(process.cwd(), 'dist')) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if(req.headers.range) {
    const [a,b] = req.headers.range.replace('bytes=','').split('-');
    const start = Number(a), end = b ? Number(b) : size-1;
    res.writeHead(206, {...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
 await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
 const results = { errors: [], failedRequests: [], viewports: {}, interactions: {} };
 try {
  for(const [name, viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
   const page = await browser.newPage({viewport, deviceScaleFactor:1});
   page.on('pageerror', e => results.errors.push(e.message));
   page.on('requestfailed', r => results.failedRequests.push({url:r.url(),error:r.failure()}));
   await page.goto(`http://localhost:4173${prefix}`, {waitUntil:'networkidle'});
   await page.evaluate(() => document.fonts.ready);
   await page.waitForFunction(() => { const v=document.querySelector('video'); return v.readyState>=3 && v.currentTime>0.6; });
   await page.evaluate(() => { const v=document.querySelector('video'); v.currentTime=3; });
   await page.waitForTimeout(250);
   const metrics = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:document.fonts.check('400 230px "General Sans"'),video:{duration:document.querySelector('video').duration,currentTime:document.querySelector('video').currentTime,opacity:document.querySelector('video').style.opacity},title:document.querySelector('h1').textContent}));
   assert(metrics.scrollWidth <= viewport.width, `${name} overflow`);
   assert(metrics.font, 'General Sans loaded');
   assert.equal(metrics.title,'Grow');
   assert.equal(metrics.video.opacity,'1');
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   for(const label of ['Features','Solutions','Plans','Learning','Sign Up','Schedule a Consult']) {
    const button = page.getByRole('button',{name:label,exact:true});
    await button.click();
    await button.focus();
    assert(await button.evaluate(el=>el===document.activeElement));
   }
   results.interactions[name] = 'All six specified buttons accept pointer and keyboard focus; no destinations supplied by design.';
   if(name==='desktop') {
    const marqueeBefore = await page.locator('.animate-marquee').evaluate(el=>getComputedStyle(el).transform);
    await page.waitForTimeout(200);
    assert.notEqual(await page.locator('.animate-marquee').evaluate(el=>getComputedStyle(el).transform),marqueeBefore);
    await page.evaluate(()=> { const v=document.querySelector('video');v.pause();v.currentTime=0.25; });
    await page.waitForTimeout(100);
    const fadeIn=await page.locator('video').evaluate(v=>Number(v.style.opacity));
    assert(Math.abs(fadeIn-0.5)<0.05);
    await page.evaluate(()=> { const v=document.querySelector('video');v.currentTime=v.duration-0.25; });
    await page.waitForTimeout(100);
    const fadeOut=await page.locator('video').evaluate(v=>Number(v.style.opacity));
    assert(Math.abs(fadeOut-0.5)<0.05);
    await page.evaluate(()=> { const v=document.querySelector('video');v.currentTime=v.duration-0.08;void v.play(); });
    await page.waitForFunction(() => { const v=document.querySelector('video'); return v.currentTime<2 && !v.paused; }, {timeout:10000});
    const restarted=await page.locator('video').evaluate(v=>({time:v.currentTime,paused:v.paused}));
    assert(restarted.time<2 && !restarted.paused);
    results.animation={marqueeMoves:true,fadeIn,fadeOut,restarted};
   }
   results.viewports[name]=metrics;
   await page.close();
  }
  assert.equal(results.errors.length,0); assert.equal(results.failedRequests.length,0);
  fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
