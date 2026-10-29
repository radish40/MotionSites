const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
 const report = { viewports: [], errors: [], assetFailures: [], canceledMediaRequests: [], interactions: [] };
 const base = 'http://localhost:4173/motionsites-results/ai-automation/';
 for (let attempt=0; attempt<40; attempt++) { try { const response=await fetch(base); if(response.ok) break; } catch {} await new Promise(resolve=>setTimeout(resolve,250)); }
 for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
  const context = await browser.newContext({ viewport: { width, height }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(`${name}: ${error.message}`));
  page.on('console', msg => { if (msg.type() === 'error') report.errors.push(`${name}: ${msg.text()}`); });
  page.on('requestfailed', req => { const entry={ viewport:name, url:req.url(), error:req.failure()?.errorText }; if(entry.error === 'net::ERR_ABORTED' && req.resourceType() === 'media') report.canceledMediaRequests.push(entry); else report.assetFailures.push(entry); });
  page.on('response', response => { if (response.status() >= 400) report.assetFailures.push({ viewport:name,url:response.url(),status:response.status() }); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2), { timeout: 30000 });
  await page.waitForTimeout(1600);
  const first = await page.evaluate(() => ({
   viewport: {width:innerWidth,height:innerHeight}, scrollWidth:document.documentElement.scrollWidth,
   fontLoaded:document.fonts.check('16px "Helvetica Now Var"'),
   fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status})),
   videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,readyState:v.readyState,playing:!v.paused,width:v.videoWidth,height:v.videoHeight})),
   heading:document.querySelector('h1').innerText,
  }));
  assert(first.scrollWidth <= width, `${name} horizontal overflow`);
  assert.equal(first.videos.length, 4);
  assert(first.videos.every(v => v.width > 0), 'All videos must decode');
  assert(first.videos[0].playing, 'Background video must play');
  await page.screenshot({path:`screenshots/${name}.png`});
  await page.getByRole('link', {name:'CASE',exact:true}).click();
  await page.waitForTimeout(2000);
  assert.equal(await page.evaluate(()=>location.hash),'#statement');
  assert(await page.locator('.statement h2 span').evaluateAll(words=>words.every(word=>Number(getComputedStyle(word).opacity)===1)));
  await page.screenshot({path:`screenshots/${name}-statement.png`});
  await page.getByRole('link',{name:'MAIN',exact:true}).click();
  await page.waitForTimeout(1200);
  await page.getByRole('link', {name:'OUR PRODUCTS',exact:true}).click();
  await page.waitForTimeout(1600);
  assert.equal(await page.evaluate(()=>location.hash),'#offering');
  const servicesTop = await page.locator('#offering').evaluate(e=>e.getBoundingClientRect().top);
  assert(await page.evaluate(()=>{ const el=document.querySelector('#offering'); return Math.abs(scrollY - Math.min(el.offsetTop,document.documentElement.scrollHeight-innerHeight)) < 2; }), 'Products should scroll to services or page end');
  for (const card of await page.locator('.service-card').all()) { await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(1100); assert(await card.isVisible()); assert(await card.locator('video').evaluate(v=>!v.paused && v.readyState >= 2), 'Visible card video must play'); }
  await page.locator('#offering').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({path:`screenshots/${name}-services.png`});
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
  assert(!overflow, `${name} services overflow`);
  await page.getByRole('button',{name:'REPOST',exact:true}).click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.repost').innerText(),'LINK COPIED');
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),`${base}#offering`);
  await page.getByRole('link',{name:'MAIN',exact:true}).click();
  await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(()=>Math.round(scrollY)),0);
  assert((await page.getByRole('link',{name:'BOOK A CALL!',exact:true}).getAttribute('href')).startsWith('mailto:'));
  if(name==='desktop') {
   await page.locator('.btn-secondary').hover();
   await page.waitForTimeout(250);
   assert.equal(await page.locator('.btn-secondary').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(26, 26, 26)');
  }
  assert(await page.locator('video').evaluateAll(videos=>videos.every(v=>v.error===null)), 'No media errors');
  report.interactions.push(`${name}: statement word animations, products navigation, 3 service cards, repost clipboard, main navigation, email CTA${name==='desktop'?', button hover':''} passed`);
  report.viewports.push({name,...first,servicesTop,horizontalOverflow:overflow});
  await context.close();
 }
 await browser.close();
 fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 assert.equal(report.errors.length,0,'Browser errors');
 assert.equal(report.assetFailures.length,0,'Failed asset requests');
})().catch(error=>{console.error(error);process.exit(1);});
