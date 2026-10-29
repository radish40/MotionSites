const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/bio-active/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.webp': 'image/webp' };
const server = http.createServer((req,res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist', rel);
  if (!file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range;
  if (range) { const [a,b] = range.replace('bytes=','').split('-'); const start=Number(a),end=b ? Number(b) : size-1; res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1}); fs.createReadStream(file,{start,end}).pipe(res); }
  else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report={ checks:[], errors:[], failedRequests:[], assets:[] };
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
      const page=await context.newPage();
      page.on('pageerror',e=>report.errors.push(e.message));
      page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure().errorText}));
      await page.goto(`http://127.0.0.1:4173${base}`);
      await page.getByRole('progressbar').waitFor();
      report.checks.push(`${name}: loading intro visible`);
      if(name==='desktop') await page.screenshot({path:'screenshots/splash.png'});
      await page.getByLabel('Loading LumiDerm').waitFor({state:'detached',timeout:12000});
      await page.waitForTimeout(1700);
      assert.equal(await page.title(),'LumiDerm | Advanced Skin Science');
      assert.equal(await page.locator('main').getAttribute('data-progress'),'0');
      await page.evaluate(()=>document.fonts.ready);
      const assets=await page.evaluate(()=>({ font:document.fonts.check('16px "Helvetica Now Text"'), videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,error:v.error?.message||null,width:v.videoWidth,height:v.videoHeight,currentTime:v.currentTime})), image:document.querySelector('img').naturalWidth, overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight }));
      report.assets.push({viewport:name,...assets});
      assert.equal(assets.overflow,false);
      assert(assets.videos.every(v=>v.readyState>=2&&!v.error));
      assert(assets.image>0);
      await page.screenshot({path:`screenshots/${name}.png`});
      if(name==='desktop') {
        await page.mouse.wheel(0,400); await page.waitForTimeout(600);
        assert.equal(await page.locator('main').getAttribute('data-scene'),'2');
        await page.mouse.wheel(0,450); await page.waitForTimeout(800);
      } else {
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.waitForTimeout(350);
        assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
        await page.screenshot({path:'screenshots/mobile-menu.png'});
        await page.locator('#mobile-menu').getByRole('link',{name:'Science',exact:true}).click();
        await page.waitForTimeout(800);
        assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
      }
      assert.equal(await page.locator('main').getAttribute('data-progress'),'1');
      await page.screenshot({path:`screenshots/${name}-science.png`});
      const playing = await page.evaluate(()=>{ const v=[...document.querySelectorAll('video')]; return {firstPaused:v[0].paused,secondPlaying:!v[1].paused,secondTime:v[1].currentTime}; });
      assert(playing.firstPaused && playing.secondPlaying && playing.secondTime > 0);
      await page.evaluate(()=>{const v=document.querySelectorAll('video')[1];v.currentTime=v.duration-0.2;});
      await page.waitForFunction(()=>document.querySelectorAll('video')[1].ended);
      assert(await page.evaluate(()=>document.querySelectorAll('video')[1].paused));
      report.checks.push(`${name}: correct active video and play-once end pause passed`);
      report.checks.push(`${name}: second scene, clinical stats and ${name==='desktop'?'wheel transition':'menu navigation'} passed`);
      await page.getByRole('link',{name:'LumiDerm home'}).click(); await page.waitForTimeout(800);
      assert.equal(await page.locator('main').getAttribute('data-progress'),'0');
      await page.getByRole('button',{name:'Explore Now',exact:true}).click(); await page.waitForTimeout(800);
      assert.equal(await page.locator('main').getAttribute('data-progress'),'1');
      report.checks.push(`${name}: home reset and Explore Now passed; no layout overflow`);
      if(name==='mobile') {
        await page.getByRole('link',{name:'LumiDerm home'}).click(); await page.waitForTimeout(800);
        await page.evaluate(()=>{ document.body.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[new Touch({identifier:1,target:document.body,clientY:600})]})); document.body.dispatchEvent(new TouchEvent('touchmove',{bubbles:true,touches:[new Touch({identifier:1,target:document.body,clientY:150})],cancelable:true})); });
        assert.equal(await page.locator('main').getAttribute('data-progress'),'1');
        report.checks.push('mobile: touch gesture transition passed');
      }
      await context.close();
    }
    assert.equal(report.errors.length,0);
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(e=>{ console.error(e); process.exitCode=1; server.close(); });
