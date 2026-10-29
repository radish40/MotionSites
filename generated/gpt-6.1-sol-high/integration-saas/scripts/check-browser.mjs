import { chromium } from '/app/node_modules/playwright-core/index.mjs';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const prefix = '/motionsites-results/integration-saas/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(prefix)) { res.writeHead(404); res.end(); return; }
    const file = path.join('/work/dist', url.pathname.slice(prefix.length) || 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const errors = [], assetIssues = [], mediaAborts = [], checks = [];
function assert(condition, name) { checks.push({ name, passed: Boolean(condition) }); if (!condition) throw new Error(name); }
try {
  for (const [name, viewport] of [['desktop', {width: 1440, height: 1000}], ['mobile', {width: 390, height: 844}]]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => {
      const issue = { url: r.url(), error: r.failure()?.errorText };
      if (r.resourceType() === 'media' && issue.error === 'net::ERR_ABORTED') mediaAborts.push(issue);
      else assetIssues.push(issue);
    });
    page.on('response', r => { if (r.status() >= 400) assetIssues.push({url:r.url(), status:r.status()}); });
    await page.goto(`http://localhost:4173${prefix}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2, {timeout:30000});
    await page.waitForTimeout(1800);
    const layout = await page.evaluate(() => ({
      noOverflow: document.documentElement.scrollWidth <= innerWidth,
      height: document.querySelector('main').getBoundingClientRect().height,
      font: document.fonts.check('400 18px Geist'),
      images: [...document.images].every(i => i.complete && i.naturalWidth > 0),
      video: { ready: document.querySelector('video').readyState, paused: document.querySelector('video').paused, width: document.querySelector('video').videoWidth },
    }));
    assert(layout.noOverflow, `${name}: no horizontal overflow`);
    assert(layout.height === viewport.height, `${name}: fullscreen hero`);
    assert(layout.font, `${name}: Geist font loaded`);
    assert(layout.images, `${name}: all avatars loaded`);
    assert(layout.video.ready >= 2 && !layout.video.paused && layout.video.width > 0, `${name}: video loaded and autoplaying`);
    await page.screenshot({ path: `/work/screenshots/${name}.png`, fullPage: true });
    if (name === 'mobile') {
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(550);
      assert(await page.getByRole('dialog').isVisible(), 'mobile: menu opens');
      await page.keyboard.press('Shift+Tab');
      assert(await page.getByRole('dialog').getByText('Sign In').evaluate(e => e === document.activeElement), 'mobile: keyboard focus stays in menu');
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => document.body.style.overflow === 'hidden'), 'mobile: scroll locked');
      await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
      await page.keyboard.press('Escape');
      await page.waitForTimeout(450);
      assert(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'mobile: Escape closes and unlocks scroll');
      assert(await page.getByRole('button', {name:'Open menu'}).evaluate(e => e === document.activeElement), 'mobile: focus restored');
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(450);
      await page.getByRole('navigation', {name:'Mobile navigation'}).getByText('Platform').click();
      await page.waitForTimeout(450);
      assert(await page.evaluate(() => location.hash === '#platform' && document.body.style.overflow !== 'hidden'), 'mobile: navigation updates hash and closes menu');
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(450);
      await page.mouse.click(30, 400);
      await page.waitForTimeout(450);
      assert(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'mobile: backdrop closes menu');
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(450);
      await page.getByRole('button', {name:'Close menu'}).click();
      await page.waitForTimeout(450);
      assert(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'mobile: close button works');
    }
    if (name === 'desktop') {
      for (const [label, hash] of [['Start Integration', '#start-integration'], ['Schedule Call', '#schedule-call'], ['Sign In', '#sign-in']]) {
        await page.getByRole('link', {name: label, exact: true}).click();
        assert(await page.evaluate(expected => location.hash === expected, hash), `desktop: ${label} link responds`);
      }
    }
    await page.close();
  }
  assert(errors.length === 0, 'no browser script or console errors');
  assert(assetIssues.length === 0, 'no failed asset requests');
} finally {
  await writeFile('/work/screenshots/browser-checks.json', JSON.stringify({ checks, errors, assetIssues, mediaAborts }, null, 2));
  await browser.close(); server.close();
}
console.log(JSON.stringify({checks, errors, assetIssues, mediaAborts}, null, 2));
