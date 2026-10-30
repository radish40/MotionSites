const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/community-superdesign-horizontal-gallery/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', name.slice(prefix.length) || 'index.html');
  try { res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404); res.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors = [], failed = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {if(response.status() >= 400) failed.push(response.url());});
      await page.goto(`http://localhost:4173${prefix}`, {waitUntil:'networkidle'});
      await page.waitForSelector('.pin-spacer');
      await page.waitForTimeout(300);
      assert.equal(await page.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)),true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,'Horizontal overflow');
      await page.screenshot({path:`/work/screenshots/${name}.png`});
      await page.locator('.gallery-link').click();
      await page.waitForTimeout(900);
      const initial = await page.locator('.gallery').boundingBox();
      assert.ok(Math.abs(initial.y) < 3, 'Gallery reaches pinned position');
      await page.mouse.wheel(0,600);
      await page.waitForTimeout(1200);
      const pinned = await page.locator('.gallery').boundingBox();
      assert.ok(Math.abs(pinned.y) < 3, 'Gallery stays pinned');
      const translation = await page.locator('.gallery-track').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
      assert.ok(translation < -400,'Vertical scroll translates gallery horizontally');
      await page.screenshot({path:`/work/screenshots/${name}-pinned.png`});
      await page.getByRole('button',{name:'Next photograph'}).click();
      await page.waitForTimeout(1600);
      const afterNext = await page.locator('.current-count').innerText();
      assert.ok(!afterNext.startsWith('01'),'Next control advances gallery');
      await page.getByRole('button',{name:'Previous photograph'}).click();
      await page.waitForTimeout(1600);
      const afterPrev = await page.locator('.current-count').innerText();
      assert.ok(afterPrev < afterNext,'Previous control moves backward');
      await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight));
      await page.waitForTimeout(1100);
      assert.ok((await page.locator('.gallery').boundingBox()).y < 0,'Pin releases at end');
      await page.getByRole('button',{name:'BACK TO TOP'}).click();
      await page.waitForTimeout(1800);
      assert.ok(await page.evaluate(() => scrollY < 2),'Back to top works');
      assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);
      results.push({viewport:`${width}x${height}`,imagesLoaded:true,noHorizontalOverflow:true,pinning:true,horizontalTranslation:translation,nextAndPrevious:true,pinRelease:true,backToTop:true,scriptErrors:errors,failedRequests:failed});
      await page.close();
    }
    const resized = await browser.newPage({viewport:{width:1440,height:1000}});
    await resized.goto(`http://localhost:4173${prefix}`,{waitUntil:'networkidle'});
    await resized.waitForSelector('.pin-spacer');
    for (const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
      await resized.setViewportSize(viewport);
      await resized.waitForTimeout(500);
      assert.equal(await resized.locator('.pin-spacer').count(),1,'Only one pin after resize');
      assert.equal(await resized.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
    }
    await resized.close();
    results.push({resize:'Desktop to mobile and back; single pin, no overflow'});
    const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    await page.goto(`http://localhost:4173${prefix}`,{waitUntil:'networkidle'});
    await page.waitForTimeout(300);
    assert.equal(await page.locator('.pin-spacer').count(),0);
    assert.equal(await page.locator('.gallery-track').evaluate(el => getComputedStyle(el).overflowX),'auto');
    results.push({reducedMotion:'Unpinned native horizontal gallery verified'});
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error => {console.error(error);server.close();process.exitCode=1;});
