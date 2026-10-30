const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/community-superdesign-lightning-background/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!req.url.startsWith(base) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const report = { url: `http://localhost:4173${base}`, checks: [], errors: [], failedRequests: [], warnings: [] };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if(message.type() === 'error') report.errors.push(message.text()); if(message.type() === 'warning') report.warnings.push(message.text()); });
    page.on('requestfailed', request => report.failedRequests.push(request.url()));
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      await page.goto(report.url, {waitUntil:'networkidle'});
      await page.waitForTimeout(1300);
      assert.equal(await page.title(), 'Lightning Discharge');
      assert.equal(await page.locator('h1').innerText(), 'Lightning Discharge');
      const state = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const gl = canvas.getContext('webgl');
        const button = document.querySelector('button').getBoundingClientRect();
        return { viewport: [innerWidth,innerHeight], canvas: [canvas.width,canvas.height], webgl: !!gl, glError: gl?.getError(), overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight, buttonVisible: button.x>=0 && button.y>=0 && button.right<=innerWidth && button.bottom<=innerHeight };
      });
      assert.ok(state.webgl); assert.equal(state.glError,0); assert.equal(state.overflow,false); assert.ok(state.buttonVisible); assert.deepEqual(state.canvas,[width,height]);
      const before = await page.locator('canvas').screenshot();
      await page.waitForTimeout(350);
      const after = await page.locator('canvas').screenshot();
      assert.ok(!before.equals(after), 'Canvas animation must change between frames');
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      const dialogPromise = new Promise(resolve => page.once('dialog', async dialog => { const message = dialog.message(); await dialog.accept(); resolve(message); }));
      await page.getByRole('button',{name:'Reply',exact:true}).click({noWaitAfter:true});
      assert.equal(await dialogPromise, 'Reply Action');
      await page.keyboard.press('Tab');
      await page.getByRole('button',{name:'Reply',exact:true}).focus();
      assert.ok(await page.getByRole('button',{name:'Reply',exact:true}).evaluate(el => el === document.activeElement));
      const keyboardDialogPromise = new Promise(resolve => page.once('dialog', async dialog => { const message = dialog.message(); await dialog.accept(); resolve(message); }));
      await page.keyboard.press('Enter');
      assert.equal(await keyboardDialogPromise, 'Reply Action');
      report.checks.push({name, ...state, animationChanges:true, replyClick:true, keyboardActivation:true, screenshot:`screenshots/${name}.png`});
    }
    assert.deepEqual(report.errors,[]); assert.deepEqual(report.failedRequests,[]);
    report.status='passed';
  } finally {
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
    await browser.close(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; server.close(); });
