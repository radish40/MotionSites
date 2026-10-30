const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = { viewports: [], errors: [], failedRequests: [], interactions: [] };
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => {if(m.type()==='error') report.errors.push(m.text());});
  page.on('requestfailed', req => report.failedRequests.push(req.url()));
  page.on('response', res => {if(res.status()>=400) report.errors.push(`${res.status()} ${res.url()}`);});
  await page.goto('http://localhost:5173/motionsites-results/technical-specifications/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  assert.equal(await page.locator('.stats__bar-row').count(),4);
  assert.equal(await page.locator('.statspoint').count(),24);
  assert.deepEqual(await page.locator('.statsvalue').allTextContents(),['82%','68%','54%','76%']);
  const metrics = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,font:document.fonts.check('300 30px Geist'), axis:[...document.querySelectorAll('.statsaxis>div>span')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.textContent)}));
  assert.equal(metrics.scrollWidth,width); assert.ok(metrics.font);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); document.querySelector(".stats__tabs").scrollLeft = 0; });
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  for (const [key,values] of [['materials',['91%','72%','96%','84%']],['fuels',['78%','64%','88%','92%']],['hydrogen',['86%','74%','93%','81%']],['cities',['82%','68%','54%','76%']]]) {
   await page.locator(`[data-stats-tab="${key}"]`).click();
   assert.equal(await page.locator(`[data-stats-tab="${key}"]`).getAttribute('aria-selected'),'true');
   await page.waitForTimeout(200);
   assert.deepEqual(await page.locator('.statsvalue').allTextContents(),values);
   assert.equal(await page.locator('.statschart').getAttribute('aria-labelledby'),`tab-${key}`);
   await page.waitForTimeout(1300);
   assert.ok(await page.locator('.statsbar').evaluateAll(bars=>bars.every(bar=>getComputedStyle(bar).transform==='matrix(1, 0, 0, 1, 0, 0)')));
  }
  // Race test: the final click must win over the delayed earlier render.
  await page.evaluate(()=>{document.querySelector('[data-stats-tab="materials"]').click();document.querySelector('[data-stats-tab="hydrogen"]').click();});
  await page.waitForTimeout(170);
  assert.equal(await page.locator('.statsvalue').first().textContent(),'86%');
  await page.locator('[data-stats-tab="hydrogen"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(170);
  assert.equal(await page.locator('[aria-selected="true"]').getAttribute('data-stats-tab'),'cities');
  await page.keyboard.press('End'); await page.waitForTimeout(170);
  assert.equal(await page.locator('[aria-selected="true"]').getAttribute('data-stats-tab'),'hydrogen');
  await page.keyboard.press('Home'); await page.waitForTimeout(1500);
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); document.querySelector(".stats__tabs").scrollLeft = 0; });
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  report.viewports.push({name,width,height,...metrics});
  report.interactions.push(`${name}: all four datasets, active states, animation completion, rapid switching, arrow/Home/End keyboard navigation passed`);
  await page.close();
 }
 await browser.close();
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
