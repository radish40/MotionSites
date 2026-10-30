const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [], failures = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failures.push(r.url()));
  const base = 'http://localhost:4173/motionsites-results/stark-minimal-footer/';
  const results = {};
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844], ['tablet',768,1024], ['small',320,740], ['breakpoint',981,1000]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => {
      const footer = document.querySelector('.site-footer');
      const brand = document.querySelector('.site-footer__brand');
      const word = brand.lastElementChild;
      const range = document.createRange(); range.selectNodeContents(word);
      return {
        viewportWidth: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        footerHeight: footer.getBoundingClientRect().height,
        gridColumns: getComputedStyle(document.querySelector('.site-footer__top')).gridTemplateColumns,
        wordRight: range.getBoundingClientRect().right,
        contentOverflow: [...document.querySelectorAll(".site-footer__top h2, .site-footer__nav a, .site-footer__brand > span:last-child, .site-footer__legal > *")].some(e => { const r = document.createRange(); r.selectNodeContents(e); const b = r.getBoundingClientRect(); return b.left < 0 || b.right > innerWidth; }),
        brandRight: brand.getBoundingClientRect().right,
        fontLoaded: document.fonts.check('760 70px Geist'),
        linkCount: document.querySelectorAll('a').length
      };
    });
    assert.equal(metrics.documentWidth, width, `${name}: document overflow`);
    assert.equal(metrics.contentOverflow, false, `${name}: content clipped`);
    assert.ok(metrics.fontLoaded, `${name}: Geist font`);
    assert.equal(metrics.linkCount, 14);
    results[name] = metrics;
    if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  const company = page.getByRole('link', { name: 'Company', exact: true });
  await company.hover(); await page.waitForTimeout(220);
  assert.equal(await company.evaluate(e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 3, 0)');
  await company.click(); assert.equal(new URL(page.url()).hash, '#company');
  for (const [name, hash] of [['Technology','technology'],['Solutions','solutions'],['Our Edge','our-edge'],['Investors','investors'],['Our Team','our-team'],['News','news'],['Careers','careers'],['Contact Us','contact'],['Privacy Policy','privacy'],['Terms of Use','terms']]) {
    await page.getByRole('link', { name, exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#' + hash);
  }
  const socials = await page.locator('nav[aria-label="Social links"] a').evaluateAll(links => links.map(a => ({ href: a.href, target: a.target, rel: a.rel })));
  assert.deepEqual(socials.map(x => x.href), ['https://www.linkedin.com/', 'https://x.com/']);
  assert.ok(socials.every(x => x.target === '_blank' && x.rel === 'noreferrer'));
  assert.equal(await page.getByRole('link', {name:'EngineTech home'}).getAttribute('href'), '/');
  await page.keyboard.press("Tab");
  await company.focus();
  assert.equal(await company.evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
  const dots = page.locator('.footer-dots__line');
  const t1 = await dots.evaluate(e => getComputedStyle(e).transform);
  await page.waitForTimeout(150);
  const t2 = await dots.evaluate(e => getComputedStyle(e).transform);
  assert.notEqual(t1, t2);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await dots.evaluate(e => getComputedStyle(e).animationName), 'none');
  assert.deepEqual(errors, []); assert.deepEqual(failures, []);
  await fs.writeFile('screenshots/checks.json', JSON.stringify({results, interactions: 'passed: fragment links, hover, focus, social attributes, home href, moving dots and reduced motion', consoleErrors: errors, failedRequests: failures}, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
