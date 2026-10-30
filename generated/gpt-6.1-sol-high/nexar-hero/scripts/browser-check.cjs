const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('node:assert/strict');
const baseURL = 'http://127.0.0.1:4173/motionsites-results/nexar-hero/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = { consoleErrors: [], pageErrors: [], failedRequests: [], checks: [] };
  async function check(name, task) { await task(); results.checks.push({name, passed:true}); }
  const context = await browser.newContext({ viewport: {width:1440,height:1000} });
  const page = await context.newPage();
  page.on('pageerror', e => results.pageErrors.push(e.message));
  page.on('console', msg => { if(msg.type() === 'error') results.consoleErrors.push(msg.text()); });
  page.on('requestfailed', req => results.failedRequests.push({url:req.url(), error:req.failure()?.errorText}));
  try {
    await page.goto(baseURL, { waitUntil:'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    await check('Desktop: three task cards and no horizontal overflow', async () => {
      assert.equal(await page.locator('.task-card').count(),3);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    });
    await check('Original assets and background video load and play', async () => {
      const media = await page.evaluate(() => ({ images:[...document.images].every(i => i.complete && i.naturalWidth > 0),video:document.querySelector('video').readyState,playing: !document.querySelector('video').paused, time:document.querySelector('video').currentTime }));
      assert(media.images); assert(media.video >= 2); assert(media.playing); assert(media.time > 0);
      results.media = media;
    });
    await page.screenshot({path:'screenshots/desktop.png', fullPage:true});
    await check('Mode switch and notifications', async () => {
      await page.getByRole('button',{name:'Solo',exact:true}).click();
      await page.getByText('Your personal workspace',{exact:true}).waitFor();
      await page.getByRole('button',{name:'Crew',exact:true}).click();
      await page.getByRole('button',{name:'Notifications',exact:true}).click();
      await page.getByText("You're all caught up",{exact:true}).waitFor();
      await page.getByRole('button',{name:'Notifications',exact:true}).click();
    });
    await check('Project selector opens and selects', async () => {
      await page.getByRole('button',{name:/Zenith Launch Product/}).click();
      await page.getByRole('button',{name:'All projects',exact:true}).click();
      await page.getByRole('button',{name:/All projects Product/}).click();
      await page.getByRole('button',{name:'Zenith Launch',exact:true}).click();
    });
    async function close() { await page.getByRole('button',{name:'Close dialog',exact:true}).click(); }
    await check('Session, AI review brief, and scheduled details', async () => {
      await page.getByRole('button',{name:'Enter session',exact:true}).click();
      await page.getByRole('button',{name:'Enter session workspace',exact:false}).click();
      await page.getByRole('status').waitFor(); await close();
      await page.getByRole('button',{name:'Let AI begin',exact:true}).click();
      await page.getByRole('button',{name:'Prepare review brief',exact:false}).click();
      await page.getByText('Review brief prepared',{exact:true}).waitFor(); await close();
      await page.getByRole('button',{name:'Show details',exact:true}).click();
      await page.locator('dialog').getByText(/Friday/).waitFor(); await close();
    });
    await check('Fast commands and adding an item', async () => {
      await page.getByRole('button',{name:/Review session notes/}).click();
      await page.getByRole('button',{name:'Done',exact:false}).click();
      await page.getByRole('button',{name:'Add Item',exact:false}).click();
      await page.getByLabel('What would you like Nexar to do?').fill('Prepare next sprint agenda');
      await page.getByRole('button',{name:'Add command',exact:false}).click();
      await page.getByRole('button',{name:'Prepare next sprint agenda',exact:true}).waitFor();
    });
    await check('Editing metrics updates the dashboard', async () => {
      await page.getByRole('button',{name:'Edit sprint metrics',exact:true}).click();
      await page.getByRole('spinbutton',{name:'Sessions hours'}).fill('28');
      await page.getByRole('button',{name:'Save metrics',exact:false}).click(); await close();
      await page.getByText('28h',{exact:true}).waitFor();
    });
    await check('Navigation switches views', async () => {
      await page.getByRole('button',{name:'Actions',exact:true}).click(); assert.equal(await page.locator('.task-card').count(),1);
      await page.getByRole('button',{name:'Performance',exact:true}).click(); await page.getByText('This sprint, at a glance').waitFor();
      await page.getByRole('button',{name:'AI Insights',exact:true}).click(); await page.getByText('A little clarity for your crew').waitFor();
      await page.getByRole('button',{name:'Workspace',exact:true}).click();
    });
    await check('Microphone unavailable state is explained', async () => {
      await page.getByRole('button',{name:'Start audio input',exact:true}).click();
      await page.getByRole('status').filter({hasText:/Microphone access/}).waitFor();
    });
    await page.close();
    const mobile = await context.newPage();
    await mobile.setViewportSize({width:390,height:844});
    mobile.on('pageerror',e => results.pageErrors.push(e.message));
    await mobile.goto(baseURL,{waitUntil:'networkidle'});
    await mobile.evaluate(() => document.fonts.ready); await mobile.waitForTimeout(1600);
    await check('Mobile: all cards visible, no horizontal overflow', async () => {
      assert.equal(await mobile.locator('.task-card').count(),3);
      assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const overflow = await mobile.evaluate(() => [...document.querySelectorAll('main *')].filter(el => { const r=el.getBoundingClientRect();return r.width > 0 && (r.right > innerWidth+1 || r.left < -1); }).map(el=>el.tagName+':'+el.className));
      assert.deepEqual(overflow,[]);
    });
    await mobile.screenshot({path:'screenshots/mobile.png',fullPage:true});
    await check('Mobile task details and dialog dismissal',async () => {
      await mobile.getByRole('button',{name:'Show details',exact:true}).click(); await mobile.locator('dialog').getByText(/Friday/).waitFor();
      await mobile.getByRole('button',{name:'Close dialog',exact:true}).click();
    });
    assert.deepEqual(results.pageErrors,[]);
    results.passed = true;
  } catch(e) { results.passed=false; results.error=String(e); process.exitCode=1; }
  fs.writeFileSync('browser-report.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
})();
