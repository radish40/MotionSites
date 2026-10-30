// Public acceptance of the multi-page Next.js export, including direct 404s.
const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const [base, project, output] = process.argv.slice(2);
  assert(base && project && output, 'Usage: URL PROJECT OUTPUT_JSON');
  const ids = [...fs.readFileSync(`${project}/app/lib/tours.ts`, 'utf8').matchAll(/\bid:\s*'([^']+)'/g)].map(m => m[1]);
  assert.equal(ids.length, 7, 'All seven specified destinations must be tested');
  const report = { url:base, checked_utc:new Date().toISOString(), passed:false, results:[] };
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox'] });
  try {
    for (const [name, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
      const context = await browser.newContext({viewport});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const routes = [];
      for (const route of ['', 'destinations/', ...ids.map(id=>`destinations/${id}/`), 'missing-review-route/', 'destinations/missing-review-tour/']) {
        const response = await page.goto(new URL(route, base).href, {waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForTimeout(1800);
        const missing = route.includes('missing-review');
        assert.equal(response.status(), missing ? 404 : 200, route);
        const layout = await page.evaluate(()=>({text:document.body.innerText,overflow:document.documentElement.scrollWidth-innerWidth}));
        assert(layout.text.trim().length > 0 && layout.overflow <= 3, route);
        if (missing) {
          assert(layout.text.includes('Page not found') && layout.text.includes('Back to home'), route);
          await page.getByRole('link',{name:'Back to home'}).click();
          await page.waitForURL(base);
        } else if (route.startsWith('destinations/') && route !== 'destinations/') {
          assert.equal(await page.locator('h1').count(), 1, route);
          assert(await page.getByRole('link',{name:'Back to explore'}).count(), route);
        }
        routes.push({route,status:response.status(),horizontalOverflow:layout.overflow});
      }
      await page.goto(new URL('destinations/',base).href,{waitUntil:'domcontentloaded'});
      const search = page.getByRole('textbox',{name:'Find your tour'});
      await search.fill('Switzerland');
      const tourLinks = page.locator('#destcontainer a[href*="/destinations/"]');
      await page.waitForTimeout(800);
      assert.equal(await tourLinks.count(), 1);
      await tourLinks.first().click();
      await page.waitForURL(new RegExp('/destinations/switzerland-alps/?$'));
      await page.getByRole('link',{name:'Back to explore'}).click();
      await page.waitForURL(new RegExp('/destinations/?$'));
      assert.deepEqual(errors, [], `${name} script errors`);
      report.results.push({viewport:name,routes,filterAndClientNavigation:true,errors});
      await context.close();
    }
    report.passed = true;
  } finally {
    await browser.close();
    fs.writeFileSync(output, JSON.stringify(report,null,2)+'\n');
  }
  console.log(JSON.stringify({url:base,passed:report.passed,viewports:report.results.length,destinations:ids.length}));
})().catch(e=>{console.error(e);process.exitCode=1;});
