const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/subscription-agency/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server = http.createServer((req, res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', decodeURIComponent(req.url.slice(base.length)).split('?')[0] || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const report = { url: `http://localhost:4173${base}`, viewports: [], scriptErrors: [], failedRequests: [], httpErrors: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
      page.on('pageerror', error => report.scriptErrors.push(error.message));
      page.on('requestfailed', request => report.failedRequests.push({ url:request.url(), error:request.failure()?.errorText }));
      page.on('response', response => {if(response.status() >= 400) report.httpErrors.push({url:response.url(),status:response.status()});});
      await page.goto(report.url, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1300);
      const metrics = await page.evaluate(() => ({
        width:innerWidth, documentWidth:document.documentElement.scrollWidth,
        heroHeight:document.querySelector('.hero').getBoundingClientRect().height,
        titleFont:getComputedStyle(document.querySelector('h1')).fontSize,
        fonts:[...document.fonts].filter(f=>f.status === 'loaded').map(f=>({family:f.family,weight:f.weight,style:f.style})),
        avatarLoaded:document.querySelector('.book-button img').naturalWidth>0,
        curveCount:document.querySelectorAll('.curve-field span').length,
        mobileCurveCount:document.querySelectorAll('.curves-top span').length,
        ctaDirection:getComputedStyle(document.querySelector('.cta-row')).flexDirection,
      }));
      console.log(JSON.stringify(metrics));
      assert.equal(metrics.documentWidth,width,'No horizontal overflow');
      assert.equal(metrics.avatarLoaded,true);
      assert.equal(metrics.curveCount,40);
      assert.equal(metrics.ctaDirection,name==='mobile'?'column':'row');
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      const menu = page.getByRole('button',{name:'Menu',exact:true});
      await menu.click();
      await page.waitForTimeout(450);
      assert.equal(await page.getByRole('button',{name:'Close',exact:true}).getAttribute('aria-expanded'),'true');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent.includes('Projects')),true);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Close');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      for (const name of ['Projects','Plans','Team','FAQs','Get in Touch']) {
        await menu.click();
        await page.locator('#navigation nav a').filter({hasText:name}).click();
        await page.waitForTimeout(80);
        assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
      }
      await page.getByRole('link',{name:'View Plans',exact:true}).click();
      await page.getByRole('heading',{name:'A flexible design partnership.',exact:true}).waitFor();
      await page.getByRole('button',{name:'Back to Alwayzz'}).click();
      await page.getByRole('link',{name:/Chat for 15 minutes/}).click();
      await page.getByRole('heading',{name:'Chat for 15 minutes.',exact:true}).waitFor();
      await page.getByRole('button',{name:'Close dialog'}).click();
      if(name==='desktop') {
        await menu.click(); await page.waitForTimeout(450);
        await page.screenshot({path:'/work/screenshots/menu.png',fullPage:true});
        await page.keyboard.press('Escape');
      }
      report.viewports.push({name,...metrics,menuKeyboardChecks:'passed',navigationLinks:'5 passed',ctaDialogs:'2 passed'});
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('.marquee-track').first().evaluate(el=>getComputedStyle(el).animationName),'none');
      await page.close();
    }
    for (const width of [320, 810, 1199, 1200]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      await page.goto(report.url,{waitUntil:'networkidle'});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`Overflow at ${width}px`);
      await page.close();
    }
    assert.equal(report.scriptErrors.length,0);
    assert.equal(report.httpErrors.length,0);
    report.status='passed';
    report.extraResponsiveWidths=[320,810,1199,1200];
    report.reducedMotion='passed';
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error => {console.error(error);server.close();process.exitCode=1;});
