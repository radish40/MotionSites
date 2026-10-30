const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/automation-machines-hero/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.splinecode':'application/octet-stream', '.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless:true, args:['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
      page.setDefaultTimeout(90000);
      // Hold the real rendered scene after its first settled frames for reproducible
      // screenshots on this software-WebGL host. This only affects this test browser.
      await page.addInitScript(() => {
        const raf = window.requestAnimationFrame.bind(window);
        window.__captureFramesHeld = false;
        window.requestAnimationFrame = callback => raf(time => {
          if (!window.__captureFramesHeld) callback(time);
        });
        const observer = new MutationObserver(() => {
          if (document.querySelector('[data-loaded="true"]')) {
            observer.disconnect();
            setTimeout(() => { window.__captureFramesHeld = true; }, 3000);
          }
        });
        observer.observe(document, {subtree:true, attributes:true});
      });
      const errors = [], failedRequests = [];
      page.on('pageerror', err=>{errors.push(err.message); console.log('PAGE ERROR',err.message);});
      page.on('console', msg=>{ if(msg.type()==='error') console.log('CONSOLE ERROR',msg.text()); });
      page.on('requestfailed', req=>{const failure={url:req.url(),error:req.failure()?.errorText}; failedRequests.push(failure); console.log('REQUEST FAILED',failure);});
      await page.goto(`http://localhost:4173${base}`, {waitUntil:'domcontentloaded', timeout:60000});
      console.log('Checking',name);
      await page.locator('[data-loaded="true"]').waitFor({timeout:90000}).catch(async err=>{await page.screenshot({path:`screenshots/${name}-load-failure.png`}); throw err;});
      console.log('Scene loaded',name);
      await page.evaluate(()=>document.fonts.ready);
      console.log('Fonts ready',name);
      await page.waitForTimeout(5000);
      console.log('Capturing',name);
      const metrics = await page.evaluate(() => ({
        width:innerWidth, height:innerHeight, scrollWidth:document.documentElement.scrollWidth, scrollHeight:document.documentElement.scrollHeight,
        headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,
        fonts:{orbitron:document.fonts.check('40px Orbitron'), spaceGrotesk:document.fonts.check('14px "Space Grotesk"'), mono:document.fonts.check('12px "JetBrains Mono"')},
        canvas:!!document.querySelector('canvas'), sceneLoaded:document.querySelector('[data-loaded]').dataset.loaded,
        title:document.querySelector('h1').innerText,
        heading:document.querySelector('h1').getBoundingClientRect().toJSON(),
        footer:document.querySelector('footer').getBoundingClientRect().toJSON(),
      }));
      console.log('METRICS',JSON.stringify(metrics));
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true, timeout:90000});
      assert.equal(metrics.scrollWidth,width,'No horizontal overflow');
      assert.equal(metrics.sceneLoaded,'true');
      assert.equal(metrics.canvas,true);
      assert.equal(await page.locator('dl > div').count(),4);
      assert.equal(await page.getByRole('button').count(),3);
      const button = page.getByRole('button',{name:'Snowflake'});
      const before = await button.evaluate(el=>getComputedStyle(el).borderColor);
      await button.hover();
      await page.waitForTimeout(250);
      const after = await button.evaluate(el=>getComputedStyle(el).borderColor);
      assert.notEqual(before,after,'Icon border responds to hover');
      await button.click();
      await page.getByRole('button',{name:'Maximize'}).click();
      await page.getByRole('button',{name:'Zap'}).click();
      await page.keyboard.press('Tab');
      await page.mouse.move(width-10,10);
      await page.waitForTimeout(500);
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      results.push({viewport:name, metrics, interactions:{iconHover:true, iconClicks:true, keyboardTab:true}, errors,failedRequests});
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2)+'\n');
    console.log(JSON.stringify(results,null,2));
    assert.ok(results.every(r=>!r.errors.length),'No page errors');
  } finally { await browser.close(); server.close(); }
})().catch(err=>{console.error(err); process.exitCode=1; server.close();});
