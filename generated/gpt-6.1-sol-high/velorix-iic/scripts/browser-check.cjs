const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const prefix = '/motionsites-results/velorix-iic/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const filename = path.join(root, pathname.slice(prefix.length) || 'index.html');
  if (!filename.startsWith(root) || !fs.existsSync(filename)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(filename).size;
  const headers = { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [a,b] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(a), end = b ? Math.min(Number(b), size-1) : size-1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1 });
    fs.createReadStream(filename, {start,end}).pipe(res);
  } else { res.writeHead(200, {...headers, 'Content-Length': size}); fs.createReadStream(filename).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = { path: prefix, checks: [], errors: [], failedRequests: [], screens: {} };
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('pageerror',e=>report.errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
      page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`);});
      page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()}));
      await page.goto(`http://localhost:4173${prefix}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=3 && v.currentTime>0.1;});
      const start = await page.locator('video').evaluate(v=>v.currentTime);
      await page.waitForTimeout(350);
      assert(await page.locator('video').evaluate(v=>v.currentTime)>start,'Video advances');
      const metrics = await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,font:document.fonts.check('400 16px Inter'),video:{width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight,duration:document.querySelector('video').duration,muted:document.querySelector('video').muted,loop:document.querySelector('video').loop}}));
      assert.equal(metrics.scrollWidth,width); assert.equal(metrics.scrollHeight,height); assert(metrics.font); assert(metrics.video.muted&&metrics.video.loop);
      report.screens[name]=metrics;
      await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=3;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));});
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      await page.getByRole('button',{name:'Watch it unfold'}).hover();
      await page.getByRole('button',{name:'Watch it unfold'}).click();
      if(name==='desktop') {
        assert.equal(await page.locator('nav a:visible').count(),5);
        await page.getByRole('button',{name:'Join the wait'}).click();
        await page.locator('nav a').first().click();
      } else {
        const toggle=page.getByRole('button',{name:'Toggle menu'});
        await toggle.click(); await page.waitForTimeout(800);
        assert.equal(await toggle.getAttribute('aria-expanded'),'true');
        assert.equal(await page.locator('#mobile-menu a:visible').count(),5);
        await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});
        await page.keyboard.press('Escape'); await page.waitForTimeout(550);
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        await toggle.click(); await page.waitForTimeout(600);
        await page.locator('#mobile-menu a').nth(2).click(); await page.waitForTimeout(550);
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        await toggle.click(); await page.waitForTimeout(600);
        await page.mouse.click(20,650); await page.waitForTimeout(550);
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        await toggle.click(); await page.waitForTimeout(600);
        await page.locator('#mobile-menu button').click();
        await toggle.click(); await page.waitForTimeout(550);
        assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      }
      report.checks.push(`${name}: font loaded, video autoplay/advance/muted/loop, no page overflow, screenshot, navigation and CTA clicks`);
      await page.close();
    }
    report.checks.push('Mobile menu: toggle, Escape, link selection, backdrop dismissal, menu CTA');
    assert.deepEqual(report.errors,[]); assert.deepEqual(report.failedRequests,[]);
    report.status='passed';
  } catch(e) {report.status='failed';report.failure=e.stack;process.exitCode=1;}
  finally {fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close();console.log(JSON.stringify(report,null,2));}
})();
