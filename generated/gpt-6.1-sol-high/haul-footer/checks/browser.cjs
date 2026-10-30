const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/haul-footer/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(content);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024]]) {
    const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
    const errors = []; const failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if(msg.type() === 'error') errors.push(msg.text()); });
    page.on('requestfailed', req => failed.push(req.url()));
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    const initialTransform = await page.locator('[data-truck-layer]').evaluate(el => getComputedStyle(el).transform);
    const spacer = await page.locator('section').first().evaluate(el => el.getBoundingClientRect().height);
    assert.equal(Math.round(spacer), Math.round(height * (name === 'tablet' ? .3 : .5)));
    await page.locator('section').nth(1).evaluate(el => el.scrollIntoView());
    await page.waitForTimeout(500);
    const scrolledTransform = await page.locator('[data-truck-layer]').evaluate(el => getComputedStyle(el).transform);
    assert.notEqual(initialTransform, scrolledTransform, 'truck should move on scroll');
    assert.equal(await page.locator('nav a').count(), 7);
    const social = page.getByRole('link', { name: 'Facebook', exact:true });
    await social.hover(); await page.waitForTimeout(350);
    assert.equal(await social.evaluate(el => getComputedStyle(el).backgroundColor),'rgb(249, 115, 22)');
    await page.getByRole('link', { name:'Founding',exact:true }).focus();
    assert.equal(await page.evaluate(() => document.activeElement.textContent),'Founding');
    await page.mouse.move(width-1,height-1);
    await page.evaluate(() => document.activeElement.blur());
    await page.waitForTimeout(400);
    const layout = await page.evaluate(() => ({width:innerWidth, scrollWidth:document.documentElement.scrollWidth, images:[...document.images].every(i=>i.complete && i.naturalWidth>0), font:document.fonts.check('500 14px Inter')}));
    assert.equal(layout.scrollWidth, width, 'no horizontal overflow');
    assert(layout.images); assert(layout.font); assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);
    if(name !== 'tablet') {
      await page.screenshot({path:`/work/screenshots/${name}.png`});
      await page.screenshot({path:`/work/screenshots/${name}-full.png`, fullPage:true});
    }
    results.push({name, viewport:{width,height},spacer,initialTransform,scrolledTransform,layout,errors,failed,linkHover:'passed',keyboardFocus:'passed'});
    await page.close();
  }
  fs.writeFileSync('/work/checks/browser-results.json',JSON.stringify(results,null,2));
  await browser.close();server.close();
  console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exit(1)});
