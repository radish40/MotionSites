const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/ai-workflow-agents/';
const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.resolve('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1, isMobile:name==='mobile',hasTouch:name==='mobile'});
    const errors = [], consoleErrors = [], failedRequests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('requestfailed', req => failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle',timeout:90000});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2,{},{timeout:60000});
    await page.waitForTimeout(2000);
    const data = await page.evaluate(() => {
      const video = document.querySelector('video');
      return {
        title: document.title,
        viewport: {width: innerWidth, height: innerHeight},
        document: {width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight},
        fonts: {inter: document.fonts.check('400 16px Inter'), instrumentSerif:document.fonts.check('400 32px "Instrument Serif"')},
        video: {readyState:video.readyState,paused:video.paused,currentTime:video.currentTime,videoWidth:video.videoWidth,videoHeight:video.videoHeight,muted:video.muted,loop:video.loop},
        heading: document.querySelector('h1').getBoundingClientRect().toJSON(),
        navVisible: getComputedStyle(document.querySelector('nav > div')).display !== 'none',
      };
    });
    assert.equal(data.document.width,width,'horizontal overflow');
    assert.equal(data.document.height,height,'vertical overflow');
    assert.equal(data.fonts.inter,true); assert.equal(data.fonts.instrumentSerif,true);
    assert.equal(data.video.paused,false); assert.ok(data.video.currentTime > 0);
    assert.equal(data.navVisible,name === 'desktop');
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    await page.getByRole('button',{name:'Get Early Access'}).click();
    await assert.equal(await page.getByRole('status').innerText(),'Early access signup is coming soon.');
    if(name==='desktop') {
      for (const item of ['Features','Plans','Security','About']) {
        await page.getByRole('link',{name:item,exact:true}).click();
        assert.equal(await page.getByRole('status').innerText(),`${item} details are coming soon.`);
      }
      await page.getByRole('link',{name:'Axon home'}).click();
      assert.equal(await page.getByRole('status').innerText(),'');
      await page.getByRole('button',{name:'Get Early Access'}).focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.getByRole('status').innerText(),'Early access signup is coming soon.');
    }
    assert.equal(errors.length,0);
    assert.equal(consoleErrors.length,0);
    results.push({name,...data,errors,consoleErrors,failedRequests,interactions:'passed'});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-checks.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
  server.close();
})().catch(error => { console.error(error); server.close(); process.exit(1); });
