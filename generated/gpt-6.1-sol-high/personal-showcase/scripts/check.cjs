const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/personal-showcase/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  if (!rel.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', rel.slice(base.length) || 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { desktop:{}, mobile:{}, reducedMotion:{}, fallback:{}, errors:[], failedRequests:[], assetResponses:[] };
  async function pageFor(viewport, reducedMotion='no-preference') {
    const context = await browser.newContext({ viewport, reducedMotion });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', msg => { if(msg.type()==='error') report.errors.push(msg.text()); });
    page.on('requestfailed', req => report.failedRequests.push({url:req.url(), error:req.failure()?.errorText}));
    page.on('response', res => { if (!res.url().startsWith('http://127.0.0.1')) report.assetResponses.push({url:res.url(),status:res.status()}); });
    await page.goto('http://127.0.0.1:4173'+base, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2800);
    return page;
  }
  async function metrics(page) {
    return page.evaluate(() => ({
      title:document.title,
      viewport: {width:innerWidth,height:innerHeight},
      document: {width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
      images:Array.from(document.images).map(i=>({src:i.currentSrc,loaded:i.complete && i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight,fallback:!!i.dataset.fallback})),
      fontLoaded:document.fonts.check('16px "Helvetica Neue ME"'),
      fontFaces:Array.from(document.fonts).map(f=>({family:f.family,status:f.status})),
      marqueeDuration:getComputedStyle(document.querySelector('.marquee')).animationDuration,
      lineTransform:getComputedStyle(document.querySelector('.anim-line')).transform,
    }));
  }
  const desktop=await pageFor({width:1440,height:1000});
  report.desktop=await metrics(desktop);
  assert.equal(report.desktop.title,'Marcus — Bennet');
  assert.equal(report.desktop.document.width,1440); assert.equal(report.desktop.document.height,1000);
  assert(report.desktop.images.every(i=>i.loaded));
  await assert.doesNotReject(()=>desktop.getByRole('navigation',{name:'Site index',exact:true}).getByText('Story').click());
  await desktop.getByRole('navigation',{name:'Social links',exact:true}).getByText('Instagram').hover();
  await desktop.waitForTimeout(350);
  report.desktop.hoverOpacity=await desktop.getByRole('navigation',{name:'Social links',exact:true}).getByText('Instagram').evaluate(el=>getComputedStyle(el).opacity);
  assert.equal(report.desktop.hoverOpacity,'0.6');
  await desktop.mouse.move(700,900);
  await desktop.waitForTimeout(350);
  await desktop.screenshot({path:'/work/screenshots/desktop.png'});

  const mobile=await pageFor({width:390,height:844});
  report.mobile=await metrics(mobile);
  assert.equal(report.mobile.document.width,390); assert.equal(report.mobile.document.height,844);
  assert(report.mobile.images.every(i=>i.loaded));
  await mobile.screenshot({path:'/work/screenshots/mobile.png'});
  const menu=mobile.getByRole('button',{name:'Open menu'});
  await menu.click(); await mobile.waitForTimeout(1000);
  assert.equal(await mobile.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
  assert.equal(await mobile.evaluate(()=>document.body.style.overflow),'hidden');
  const dialog=mobile.getByRole('dialog');
  assert(await dialog.getByText('Story',{exact:true}).isVisible());
  await mobile.screenshot({path:'/work/screenshots/mobile-menu.png'});
  await dialog.getByText('Jobs',{exact:true}).click(); await mobile.waitForTimeout(650);
  assert.equal(await mobile.evaluate(()=>document.body.style.overflow),'');
  await mobile.getByRole('button',{name:'Open menu'}).click(); await mobile.waitForTimeout(700);
  await mobile.keyboard.press('Escape'); await mobile.waitForTimeout(650);
  assert.equal(await menu.getAttribute('aria-expanded'),'false');
  await menu.click(); await mobile.waitForTimeout(700);
  await mobile.mouse.click(12,400); await mobile.waitForTimeout(650);
  assert.equal(await menu.getAttribute('aria-expanded'),'false');
  await menu.click(); await mobile.waitForTimeout(700);
  await mobile.getByRole('button',{name:'Close menu'}).click(); await mobile.waitForTimeout(650);
  assert.equal(await menu.getAttribute('aria-expanded'),'false');
  report.mobile.interactions=['open','link closes','Escape closes','backdrop closes','close button','body overflow restored'];
  const reduced=await pageFor({width:390,height:844},'reduce');
  report.reducedMotion=await metrics(reduced);
  assert.equal(report.reducedMotion.marqueeDuration,'1e-05s');
  const fallbackContext=await browser.newContext({viewport:{width:390,height:844}});
  const fallback=await fallbackContext.newPage();
  await fallback.route('https://images.higgs.ai/**',r=>r.abort());
  await fallback.route('https://stone-expand-60400629.figma.site/**',r=>r.abort());
  await fallback.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  report.fallback=await metrics(fallback);
  assert(report.fallback.images.every(i=>i.loaded && i.fallback));
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
  assert.equal(report.errors.length,0,JSON.stringify(report.errors));
  await browser.close(); server.close();
  console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
