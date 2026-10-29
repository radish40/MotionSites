const { chromium } = require('/app/node_modules/playwright-core');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/solar-energy-hero/';
const root = path.resolve('dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(root, decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const errors = [], failedRequests = [], responses = [], checks = [];
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => { if (response.url().includes('fonts.') || response.status() >= 400) responses.push({url:response.url(),status:response.status()}); });
  async function layout(label) {
    const result = await page.evaluate(() => {
      const content = [...document.querySelectorAll('.hero-title, .theme-toggle, .hero-footer')].map(el => {
        const r = el.getBoundingClientRect(); return { element: el.className, x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      });
      return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, content };
    });
    assert.equal(result.scrollWidth, result.width, `${label}: horizontal overflow`);
    assert.equal(result.scrollHeight, result.height, `${label}: vertical overflow`);
    for (const r of result.content) assert(r.x >= 0 && r.y >= 0 && r.right <= result.width && r.bottom <= result.height, `${label}: ${r.element} out of viewport`);
    checks.push({ check: label + ' layout', status:'passed', ...result });
  }
  for (const [name, size] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
    await page.setViewportSize(size);
    await page.goto(`http://127.0.0.1:4173${base}`, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    assert(await page.getByRole('button', {name:'Night $0 for Electricity'}).getAttribute('aria-pressed') === 'true');
    assert(await page.evaluate(() => document.fonts.check('500 56px Outfit')));
    await layout(name);
    await page.screenshot({path:`screenshots/${name}.png`, fullPage:true});
    const morning = page.getByRole('button', {name:'Morning $0 for Electricity'});
    await morning.click();
    assert(await page.locator('.bg-front').evaluate(el=>el.classList.contains('pull-down')));
    await morning.click();
    await page.waitForTimeout(1000);
    assert(await page.locator('body').evaluate(el=>el.classList.contains('light-theme')));
    assert((await page.locator('.bg-front').evaluate(el=>el.style.backgroundImage)).includes('hero-light.webp'));
    assert(!(await page.locator('.bg-front').evaluate(el=>el.classList.contains('pull-down'))));
    await page.screenshot({path:`screenshots/${name}-morning.png`,fullPage:true});
    await layout(name + ' morning');
    await page.getByRole('button',{name:'Night $0 for Electricity'}).click();
    await page.waitForTimeout(1000);
    assert(!(await page.locator('body').evaluate(el=>el.classList.contains('light-theme'))));
    checks.push({check:name+' pull-down, repeat click guard, Morning and Night switch',status:'passed'});
    if(name === 'mobile') {
      const menu = page.getByRole('button',{name:'Open navigation'});
      await menu.click();
      await page.waitForTimeout(500);
      assert(await page.getByRole('link',{name:'How It Works'}).isVisible());
      assert(await page.locator('.drawer-cta').isVisible());
      await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});
      await page.getByRole('button',{name:'Close navigation'}).press('Escape');
      assert(!(await page.getByRole('link',{name:'How It Works'}).isVisible()));
      await page.getByRole('button',{name:'Open navigation'}).press('Enter');
      assert(await page.getByRole('link',{name:'Customers'}).isVisible());
      await page.getByRole('button',{name:'Close navigation'}).click();
      checks.push({check:'mobile menu pointer and keyboard open/close',status:'passed'});
    } else {
      assert(await page.locator('.nav-cta').isVisible());
      assert.equal(await page.locator('.nav-links a:visible').count(),6);
      const button = page.locator('.nav-cta');
      await button.hover(); await page.waitForTimeout(400);
      assert.notEqual(await button.evaluate(el=>getComputedStyle(el).transform),'none');
      checks.push({check:'desktop six navigation links, quote button visibility and hover',status:'passed'});
    }
    const images = await page.evaluate(async () => {
      return Promise.all(['hero-dark.webp','hero-light.webp'].map(file => new Promise(resolve => {
        const img = new Image(); img.onload = () => resolve({file,width:img.naturalWidth,height:img.naturalHeight});
        img.onerror = () => resolve({file,error:true}); img.src = '/motionsites-results/solar-energy-hero/images/'+file;
      })));
    });
    assert(images.every(img=>img.width>0));
    checks.push({check:name+' local images decoded',status:'passed',images});
  }
  await browser.close();
  server.close();
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify({checks,errors,failedRequests,responses},null,2));
  assert.equal(errors.length,0,'browser errors');
  assert.equal(failedRequests.length,0,'failed network requests');
  console.log(JSON.stringify({status:'passed', checks:checks.length,errors,failedRequests,responses},null,2));
})().catch(error => { console.error(error); server.close(); process.exit(1); });
