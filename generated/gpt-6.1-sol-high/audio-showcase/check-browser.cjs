const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/audio-showcase/';
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join('/work/dist', relative.startsWith(base) ? relative.slice(base.length) || 'index.html' : 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  if (range) {
    const [start, end] = range.replace('bytes=','').split('-').map(Number);
    const last = end || stat.size - 1;
    res.writeHead(206, {'Content-Type': types[path.extname(file)] || 'application/octet-stream','Content-Range':`bytes ${start}-${last}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':last-start+1});
    fs.createReadStream(file,{start,end:last}).pipe(res);
  } else { res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors = [], failed = [], consoleWarnings = [];
    page.on('console',msg => { if (['error','warning'].includes(msg.type())) consoleWarnings.push(msg.text()); });
    page.on('pageerror',error => errors.push(error.message));
    page.on('requestfailed',req => failed.push({url:req.url(),error:req.failure().errorText}));
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.waitForTimeout(1700);
    await page.locator('video').evaluate(v => { if (v.readyState < 2) throw Error('Video not ready'); });
    const asset = await page.evaluate(async () => { await document.fonts.ready; const v=document.querySelector('video'); return {fontLoaded:[...document.fonts].some(f=>f.family==='Helvetica Regular' && f.status==='loaded'),documentFontsCheck:document.fonts.check('16px "Helvetica Regular"'),fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status})),computedFont:getComputedStyle(document.documentElement).fontFamily,videoWidth:v.videoWidth,videoHeight:v.videoHeight,duration:v.duration}; });
    assert(asset.fontLoaded, 'Helvetica face did not load');
    await page.screenshot({path:`/work/screenshots/${name}.png`});
    assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth && document.documentElement.scrollHeight === innerHeight), 'Page overflows');
    await page.getByRole('button',{name:'Like track',exact:true}).click();
    assert.equal(await page.getByRole('button',{name:'Unlike track',exact:true}).getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'Next track',exact:true}).click();
    await page.getByText('Alder Field -- Understory').waitFor();
    await page.getByRole('button',{name:'Previous track',exact:true}).click();
    await page.getByText('Helia Marsh -- Fern Light').waitFor();
    assert.equal(await page.getByRole('button',{name:'Unlike track',exact:true}).getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'Browse the shelves',exact:true}).click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(),0);
    await page.getByRole('button',{name:'Newest arrivals',exact:true}).click();
    await page.getByRole('heading',{name:'Newest arrivals',exact:true}).waitFor();
    await page.getByRole('button',{name:'Close dialog'}).click();
    await page.getByRole('button',{name:'Open cart, 0 items'}).click();
    await page.getByText('Your cart is quiet.').waitFor();
    await page.getByRole('button',{name:'Close dialog'}).click();
    if (name === 'mobile') {
      await page.getByRole('button',{name:'Open menu',exact:true}).click();
      await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Talents',exact:true}).click();
      await page.getByRole('heading',{name:'Talents',exact:true}).waitFor();
      await page.keyboard.press('Escape');
    } else {
      await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:'Sound diary',exact:true}).click();
      await page.getByRole('heading',{name:'Sound diary',exact:true}).waitFor();
      await page.keyboard.press('Escape');
    }
    await page.waitForFunction(() => document.querySelector('canvas').dataset.playback === 'boomerang',{},{timeout:45000});
    const boomerang = await page.locator('canvas').evaluate(c => ({frames:Number(c.dataset.frames),width:c.width,height:c.height,visible:!c.hidden,videoHidden:document.querySelector('video').style.visibility === 'hidden'}));
    assert(boomerang.frames > 5 && boomerang.visible && boomerang.videoHidden);
    const animation = await page.locator('h1').evaluate(e => ({fill:getComputedStyle(e).animationFillMode,transform:getComputedStyle(e).transform}));
    assert.equal(animation.transform,'none');
    assert.equal(errors.length,0,errors.join('\n'));
    results.push({name,viewport:{width,height},asset,boomerang,animation,overflow:false,interactions:'passed',scriptErrors:errors,failedRequests:failed,consoleWarnings});
    await page.close();
  }
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.addInitScript(() => { delete HTMLVideoElement.prototype.requestVideoFrameCallback; delete HTMLVideoElement.prototype.cancelVideoFrameCallback; });
  await page.goto(`http://localhost:4173${base}`);
  assert.equal(await page.locator('h1').evaluate(e => getComputedStyle(e).animationName),'none');
  await page.waitForFunction(() => document.querySelector('canvas').dataset.playback === 'boomerang',{},{timeout:45000});
  const rafFallback = await page.locator('canvas').evaluate(c=>Number(c.dataset.frames)>5);
  assert(rafFallback);
  await page.close();
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify({results,reducedMotion:'passed',requestAnimationFrameFallback:'passed'},null,2));
  console.log(JSON.stringify({results,reducedMotion:'passed',requestAnimationFrameFallback:'passed'},null,2));
  await browser.close();
  server.close();
})().catch(error => {console.error(error);process.exit(1)});
