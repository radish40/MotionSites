const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/sentinel-ai-hero/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.splinecode':'application/octet-stream', '.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  const relative = name.startsWith(base) ? name.slice(base.length) : name.slice(1);
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
    await page.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = cb => raf(t => { if (!window.__freezeCapture) cb(t); }); });
    const errors = [], failedRequests = [], warnings = [];
    page.on('pageerror', error => { errors.push(error.message); console.log('PAGE ERROR', error.message); });
    page.on('requestfailed', req => { failedRequests.push({url:req.url(), error:req.failure()?.errorText}); console.log('REQUEST FAILED', req.url(), req.failure()?.errorText); });
    page.on('console', msg => { if (msg.type() === 'error') warnings.push(msg.text()); });
    await page.goto(`http://localhost:4173${base}`, {waitUntil:'domcontentloaded', timeout:120000}); console.log(name, 'DOM ready');
    await page.locator('[data-scene="loaded"]').waitFor({timeout:120000}).catch(error => { errors.push('Scene did not initialize: ' + error.message); }); console.log(name, 'scene check complete');
    await page.evaluate(async () => { await Promise.all([300,400,500,600,700].map(w => document.fonts.load(`${w} 16px Sora`, 'Sentinel AI'))); await document.fonts.ready; });
    await page.waitForTimeout(6000);
    await page.evaluate(() => { window.__freezeCapture = true; });
    await page.evaluate(() => { document.addEventListener('click', e => { window.__lastClick = {text:e.target.textContent, defaultPrevented:e.defaultPrevented}; }); });
    console.log(name, 'reading layout');
    const state = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector('h1').textContent,
      viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth,
      viewportHeight: innerHeight, documentHeight: document.documentElement.scrollHeight,
      font: getComputedStyle(document.body).fontFamily,
      soraLoaded: [...document.fonts].some(f => f.family.replaceAll('\"', '') === 'Sora' && f.status === 'loaded'),
      fontFaces: [...document.fonts].filter(f => f.family.includes('Sora')).map(f => ({weight:f.weight, status:f.status})),
      sceneLoaded: !!document.querySelector('[data-scene="loaded"]'),
      canvas: [...document.querySelectorAll('canvas')].map(x=>({width:x.width,height:x.height})),
      navLinksVisible: !!document.querySelector('nav div').getBoundingClientRect().width,
      quoteVisible: !!document.querySelector('nav button').getBoundingClientRect().width,
      buttons: [...document.querySelectorAll('button')].map(x=>({text:x.textContent, pointerEvents:getComputedStyle(x).pointerEvents}))
    }));
    console.log(name, 'layout read', state);
    const cta = page.getByRole('button',{name:'Book a Call'});
    await cta.focus(); console.log(name, 'focus checked');
    state.ctaFocus = await cta.evaluate(x => document.activeElement === x);
    const bounds = await cta.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.waitForTimeout(800);
    state.ctaHovered = await cta.evaluate(x => x.matches(':hover'));
    state.ctaHoverFilter = await cta.evaluate(x => getComputedStyle(x).filter);
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2); console.log(name, 'call clicked');
    const work = await page.getByRole('button',{name:'Our Work'}).boundingBox();
    await page.mouse.click(work.x + work.width / 2, work.y + work.height / 2);
    if (name === 'desktop') {
      const services = await page.getByRole('link',{name:'Services', exact:true}).boundingBox();
      await page.mouse.click(services.x + services.width / 2, services.y + services.height / 2);
      await page.waitForTimeout(800);
      state.servicesHash = new URL(page.url()).hash;
      const quote = await page.getByRole('button',{name:'Get Quote'}).boundingBox();
      await page.mouse.click(quote.x + quote.width / 2, quote.y + quote.height / 2);
    }
    await page.mouse.move(width-40, 200);
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(1000);
    state.lastClick = await page.evaluate(() => window.__lastClick);
    console.log(name, 'capturing');

    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true, timeout:120000});
    results.push({name, ...state, errors, failedRequests, consoleErrors:warnings});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close(); server.close();
})().catch(err => {console.error(err);server.close();process.exit(1)});
