const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');

const base = '/motionsites-results/axion-about/';
const root = path.resolve('dist');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  const file = path.resolve(root, relative || 'index.html');
  if (!req.url.startsWith(base) || !file.startsWith(root + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const results = [];
  try {
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['tablet', 768, 1000], ['small-desktop', 1024, 1000]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(`http://127.0.0.1:4173${base}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
      await page.keyboard.press('Tab');
      const keyboardFocusable = await page.evaluate(() => document.activeElement?.textContent?.includes('About our studio') === true);
      await page.evaluate(() => document.activeElement.blur());
      const layout = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth,
        imagesLoaded: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        visibleImages: [...document.images].filter(i => i.getBoundingClientRect().width > 0).length,
        fontFamily: getComputedStyle(document.body).fontFamily,
        imageBounds: [...document.images].filter(i => i.getBoundingClientRect().width > 0).map(i => {
          const r = i.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
        }),
      }));
      if (name === 'desktop' || name === 'mobile' || name === 'small-desktop') {
        await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      }
      const button = page.getByRole('button', { name: 'About our studio', exact: true }).filter({ visible: true });
      const roll = button.locator('span.flex-col');
      const arrow = button.locator('svg');
      const before = { roll: await roll.evaluate(el => getComputedStyle(el).transform), arrow: await arrow.evaluate(el => getComputedStyle(el).transform) };
      await button.hover();
      await page.waitForTimeout(600);
      const after = { roll: await roll.evaluate(el => getComputedStyle(el).transform), arrow: await arrow.evaluate(el => getComputedStyle(el).transform), color: await button.evaluate(el => getComputedStyle(el).backgroundColor) };
      if (name === 'desktop') await page.screenshot({ path: 'screenshots/desktop-hover.png', fullPage: true });
      await button.click();
      await page.mouse.move(0, 0);
      await page.keyboard.press('Tab');
      const result = { name, viewport: { width, height }, errors, ...layout, keyboardFocusable, hover: { before, after }, buttonClickCompleted: true };
      results.push(result);
      console.log(JSON.stringify(result));
      if (errors.length || !layout.imagesLoaded || layout.visibleImages !== 2 || layout.pageWidth > width || !keyboardFocusable || !after.roll.includes('-20') || after.color !== 'rgb(224, 90, 26)') throw new Error(`Failed browser check: ${name}`);
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results, null, 2) + '\n');
    console.log('Browser checks passed; evidence saved to screenshots/browser-checks.json');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
