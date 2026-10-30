const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/digital-epoch-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let relative = decodeURIComponent(req.url.split('?')[0]);
  if (!relative.startsWith(base)) { res.writeHead(404).end(); return; }
  relative = relative.slice(base.length) || 'index.html';
  const file = path.resolve('dist', relative);
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404).end(); return; } res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failures.push({ url: r.url(), error: r.failure()?.errorText }));
    await page.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    const metrics = await page.evaluate(() => {
      const v = document.querySelector('video');
      return { overflow: document.documentElement.scrollWidth > innerWidth, heroHeight: document.querySelector('.hero').getBoundingClientRect().height,
        video: { readyState: v.readyState, currentTime: v.currentTime, paused: v.paused, width: v.videoWidth, height: v.videoHeight },
        fonts: { inter: document.fonts.check('15px Inter'), outfit: document.fonts.check('500 56px Outfit') },
        logos: [...document.querySelectorAll('#products img')].map(i => ({ alt: i.alt, loaded: i.complete && i.naturalWidth > 0 })) };
    });
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Contact Us', exact: true }).click();
    const contactOpens = await page.locator('dialog').evaluate(d => d.open);
    await page.getByLabel('Name', { exact: true }).fill('Preview visitor');
    await page.getByLabel('Email', { exact: true }).fill('preview@example.com');
    await page.getByLabel('What are you building?').fill('A decentralized product.');
    const formValid = await page.locator('form').evaluate(f => f.checkValidity());
    await page.keyboard.press('Escape');
    const escapeCloses = await page.locator('dialog').evaluate(d => !d.open);
    await page.getByRole('button', { name: 'Docs', exact: true }).click();
    const docsOpens = await page.getByText('Detailed product documentation is not published in this preview.').isVisible();
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await page.getByRole('button', { name: 'Get in touch', exact: true }).click();
    const navContactOpens = await page.locator('dialog').evaluate(d => d.open);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Products', exact: true }).click();
    await page.waitForTimeout(500);
    await page.locator('#products').hover();
    const marqueePauses = await page.locator('.marquee-track').evaluate(e => getComputedStyle(e).animationPlayState === 'paused');
    await page.mouse.move(0,0);
    const marqueeResumes = await page.locator('.marquee-track').evaluate(e => getComputedStyle(e).animationPlayState === 'running');
    await page.locator('#products').hover();
    const cardPoint = await page.locator('#products .group').evaluateAll(cards => {
      const card = cards.find(c => { const r = c.getBoundingClientRect(); return r.left > 24 && r.right < innerWidth - 24; });
      const r = card.getBoundingClientRect();
      card.setAttribute('data-hover-check', 'true');
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    const firstCard = page.locator('[data-hover-check]');
    await page.mouse.move(cardPoint.x, cardPoint.y);
    await page.waitForTimeout(600);
    const hoverGradient = await firstCard.locator('div').evaluate(e => getComputedStyle(e).opacity === '1');
    results.push({ viewport: name, width, height, ...metrics, interactions: { contactOpens, formValid, escapeCloses, docsOpens, navContactOpens, marqueePauses, marqueeResumes, hoverGradient }, errors, failures });
    await context.close();
  }
  const reducedContext = await browser.newContext({ reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`http://localhost:4173${base}`, { waitUntil: 'networkidle' });
  const reducedMotion = await reducedPage.evaluate(() => ({ marqueeStopped: getComputedStyle(document.querySelector('.marquee-track')).animationName === 'none', videoPaused: document.querySelector('video').paused }));
  await browser.close();
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify({ results, reducedMotion }, null, 2));
  console.log(JSON.stringify({ results, reducedMotion }, null, 2));
  server.close();
  if (results.some(r => r.overflow || r.errors.length || !Object.values(r.fonts).every(Boolean) || r.video.readyState < 2 || r.video.paused || r.logos.some(i => !i.loaded) || !Object.values(r.interactions).every(Boolean)) || !reducedMotion.marqueeStopped || !reducedMotion.videoPaused) process.exitCode = 1;
})().catch(e => { console.error(e); server.close(); process.exit(1); });
