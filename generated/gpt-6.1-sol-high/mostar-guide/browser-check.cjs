const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('/app/node_modules/playwright-core');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/mostar-guide/';
const server = http.createServer((req, res) => {
  const name = req.url.split('?')[0].slice(prefix.length) || 'index.html';
  if (!req.url.startsWith(prefix) || !['index.html','styles.css','script.js','assets/OggText-Medium.woff2'].includes(name)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', name.endsWith('.css') ? 'text/css' : name.endsWith('.js') ? 'text/javascript' : 'text/html');
  res.end(fs.readFileSync(`dist/${name}`));
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  const report = { viewports:[], errors:[], failedRequests:[], assetResponses:[], checks:[] };
  fs.mkdirSync('screenshots', { recursive:true });
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({ viewport:{ width,height }, deviceScaleFactor:1 });
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(`${name}: ${e.message}`));
      page.on('requestfailed', req => report.failedRequests.push({ viewport:name,url:req.url(),error:req.failure()?.errorText }));
      page.on('response', response => { if (!response.url().startsWith('http://127.0.0.1')) report.assetResponses.push({ url:response.url(),status:response.status() }); });
      await page.goto(`http://127.0.0.1:4173${prefix}`, { waitUntil:'networkidle',timeout:120000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => [...document.images].every(img => img.complete), { timeout:120000 });
      const assets = await page.evaluate(() => ({ images:[...document.images].filter(img => !img.naturalWidth).map(img=>img.src),font:document.fonts.check('500 24px "Ogg Medium"'),overflow:document.documentElement.scrollWidth > innerWidth,cards:document.querySelectorAll('.sight-card').length }));
      report.viewports.push({name,width,height,...assets});
      assert.equal(assets.images.length,0,'all images loaded'); assert.equal(assets.font,true); assert.equal(assets.overflow,false); assert.equal(assets.cards,15);
      await page.screenshot({path:`screenshots/${name}.png`});
      const scrollTo = async y => { await page.evaluate(y => window.scrollTo({top:y,behavior:'instant'}),y); await page.waitForFunction(y => { const s = document.documentElement.style; const expected = y === 0 ? 0.76 : y === 1050 ? 0.76 + 1050 / 2700 * 0.2 + 0.18 : y === 2300 ? 0.76 + 2300 / 2700 * 0.2 + 0.18 + 0.16 : 1.3; return Math.abs(Number(s.getPropertyValue('--back-scale')) - expected) < 0.000001 && (y !== 3700 || s.getPropertyValue('--sights-enter-x') === '0vw' && s.getPropertyValue('--sights-controls-opacity') === '1'); }, y, {timeout:60000}); };
      const vars = async () => page.evaluate(() => Object.fromEntries(['--title-opacity','--panel2-opacity','--panel3-opacity','--blur-px','--sights-enter-x','--sights-controls-opacity'].map(k=>[k,document.documentElement.style.getPropertyValue(k)])));
      await scrollTo(1050); let state = await vars(); assert.equal(+state['--title-opacity'],0); assert.equal(+state['--panel2-opacity'],1); assert.equal(state['--blur-px'],'14px');
      await page.screenshot({path:`screenshots/${name}-bridge.png`});
      await scrollTo(2300); state = await vars(); assert.equal(+state['--panel3-opacity'],1); assert.equal(+state['--panel2-opacity'],0);
      await page.screenshot({path:`screenshots/${name}-bazaar.png`});
      await scrollTo(3700); state = await vars(); assert.equal(state['--sights-enter-x'],'0vw'); assert.equal(+state['--sights-controls-opacity'],1);
      await page.screenshot({path:`screenshots/${name}-sights.png`});
      const settleSlider = async () => { await page.waitForFunction(() => { const track = document.querySelector('.sights-track'); return !track.classList.contains('is-jumping') && track.getAnimations().every(animation => animation.playState !== 'running'); }, null, {timeout:60000}); };
      const active = () => page.locator('.sight-card.is-active').getAttribute('data-sight-index');
      const start = Number(await active());
      await page.getByRole('button',{name:'Next sight',exact:true}).click(); await settleSlider(); assert.equal(Number(await active()),start+1);
      await page.getByRole('button',{name:'Previous sight',exact:true}).click(); await settleSlider(); assert.equal(Number(await active()),start);
      for (let i=0;i<5;i++) { await page.getByRole('button',{name:'Next sight',exact:true}).click(); await settleSlider(); }
      assert.equal(Number(await active()),5,'forward wrap to middle set');
      await page.getByRole('button',{name:'Previous sight',exact:true}).click(); await settleSlider(); assert.equal(Number(await active()),9,'backward wrap to middle set');
      const target = page.locator('.sight-card').nth(10);
      await target.dispatchEvent('keydown',{key:'Enter'}); await settleSlider(); assert.equal(Number(await active()),5);
      await page.locator('.sight-card').nth(6).click(); await settleSlider(); assert.equal(Number(await active()),6);
      await page.getByRole('link',{name:'Bridge',exact:true}).click(); await page.waitForTimeout(2200); assert.ok(Math.abs(await page.evaluate(()=>scrollY)-1050)<2);
      await page.getByRole('link',{name:'Bazaar',exact:true}).click(); await page.waitForTimeout(2200); assert.ok(Math.abs(await page.evaluate(()=>scrollY)-2300)<2);
      await page.getByRole('link',{name:'Routes',exact:true}).click(); await page.waitForTimeout(2200); assert.ok(Math.abs(await page.evaluate(()=>scrollY)-3700)<2);
      await page.getByRole('link',{name:'Intro',exact:true}).click(); await page.waitForTimeout(2200); assert.ok(await page.evaluate(()=>scrollY)<2);
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.mouse.move(width-5,height-5); await scrollTo(1050);
      const reduced = await page.evaluate(()=>({ mx:document.documentElement.style.getPropertyValue('--mx'),my:document.documentElement.style.getPropertyValue('--my'),x:document.documentElement.style.getPropertyValue('--back-x'),panel:document.documentElement.style.getPropertyValue('--panel2-opacity') }));
      assert.equal(+reduced.mx,0);assert.equal(+reduced.my,0);assert.equal(reduced.x,'0px');assert.equal(+reduced.panel,1);
      report.checks.push({viewport:name, passed:['remote images','Ogg font','no horizontal overflow','15 cloned cards','intro exit','bridge scene','bazaar scene','sights scene','prev/next','forward/backward loop','card click/keyboard','navigation anchors','reduced motion']});
      await context.close();
    }
    assert.equal(report.errors.length,0);
    report.status = 'passed';
  } catch(error) { report.status = 'failed';report.failure=error.stack;process.exitCode=1; }
  finally { fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close(); }
  console.log(JSON.stringify(report,null,2));
})();
