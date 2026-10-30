import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/community-superdesign-glow-cursor-button/';
const server = createServer(async (req, res) => {
  const relative = req.url.slice(base.length) || 'index.html';
  if (!req.url.startsWith(base) || !['index.html', 'style.css', 'main.js'].includes(relative)) {
    res.writeHead(404); res.end(); return;
  }
  try {
    const data = await readFile(`dist/${relative}`);
    res.setHeader('Content-Type', relative.endsWith('.css') ? 'text/css' : relative.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [];
const checks = [];
try {
  for (const [name, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, isMobile: name === 'mobile', hasTouch: name === 'mobile', deviceScaleFactor: 1 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
    await page.goto(`http://127.0.0.1:4173${base}`);
    const button = page.getByRole('button', { name: 'Get started' });
    assert(await button.isVisible());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const bounds = await button.boundingBox();
    assert(Math.abs(bounds.x + bounds.width / 2 - viewport.width / 2) < 1);
    assert(Math.abs(bounds.y + bounds.height / 2 - viewport.height / 2) < 1);
    if (name === 'desktop') {
      await page.mouse.move(bounds.x + 36, bounds.y + 24);
      const x1 = await button.evaluate(el => el.style.getPropertyValue('--cursor-x'));
      await page.mouse.move(bounds.x + bounds.width - 25, bounds.y + bounds.height - 18);
      const x2 = await button.evaluate(el => el.style.getPropertyValue('--cursor-x'));
      assert.notEqual(x1, x2);
      await page.screenshot({ path: `screenshots/${name}.png` });
      await page.mouse.move(10, 10);
      assert.equal(await button.evaluate(el => el.style.getPropertyValue('--cursor-x')), '');
      await page.keyboard.press('Tab');
      assert(await button.evaluate(el => el === document.activeElement && el.matches(':focus-visible')));
      await page.keyboard.press('Enter');
    } else {
      await page.screenshot({ path: `screenshots/${name}.png` });
      await button.tap();
    }
    assert.equal(await button.innerText(), 'Let’s go');
    assert.equal(await page.getByRole('status').textContent(), 'Button activated.');
    await page.waitForTimeout(1750);
    assert.equal(await button.innerText(), 'Get started');
    if (name === 'desktop') {
      await page.keyboard.press('Space');
      assert.equal(await button.innerText(), 'Let’s go');
      await page.waitForTimeout(1750);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await button.evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    }
    checks.push({ viewport: name, size: `${viewport.width}x${viewport.height}`, centered: true, overflow: false, activation: 'passed', screenshot: `screenshots/${name}.png` });
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile('screenshots/checks.json', JSON.stringify({ checks, console_errors: errors, cursor_tracking: 'passed', keyboard_enter_and_space: 'passed', focus_visible: 'passed', reduced_motion: 'passed', subpath_assets: 'passed' }, null, 2) + '\n');
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
  server.close();
}
