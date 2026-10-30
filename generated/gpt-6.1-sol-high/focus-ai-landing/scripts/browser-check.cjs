const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/focus-ai-landing/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join('/work/dist', decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  fs.readFile(file, (error, data) => { if(error) {res.writeHead(404); res.end();} else {res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data);} });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'] });
  const report = { pageErrors:[], consoleErrors:[], failedRequests:[], media:[], checks:[] };
  const page = await browser.newPage({ viewport:{width:1440,height:1000}, deviceScaleFactor:1 });
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', msg => { if(msg.type() === 'error') report.consoleErrors.push(msg.text()); });
  page.on('requestfailed', request => report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
  await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle', timeout:90000});
  await page.waitForTimeout(6000);
  await page.evaluate(() => document.fonts.ready);
  report.fonts = await page.evaluate(() => ({serif:document.fonts.check('32px "Instrument Serif"'),body:document.fonts.check('16px Inter')}));
  report.media = await page.locator('video').evaluateAll(videos => videos.map(v => ({src:v.currentSrc,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState,paused:v.paused,time:v.currentTime,error:v.error?.message || null})));
  const overflow = async label => { const value = await page.evaluate(() => ({viewport:innerWidth,content:document.documentElement.scrollWidth})); report.checks.push({name:label, passed:value.content <= value.viewport,...value}); };
  await overflow('desktop overflow');
  await page.screenshot({path:'/work/screenshots/desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Charge Faster',exact:true}).click();
  report.checks.push({name:'feature tab switches active state',passed:await page.getByRole('button',{name:'Charge Faster',exact:true}).getAttribute('aria-pressed') === 'true'});
  await page.getByRole('link',{name:'Discover the App',exact:true}).click();
  await page.waitForTimeout(900);
  report.checks.push({name:'app CTA navigation',passed:await page.evaluate(() => location.hash === '#join')});
  for (const [name,title] of [['Preorder Now','Your journey starts here.'],['Schedule a Tour','Meet your next adventure.'],['Subscribe','A little closer to the road.']]) {
    await page.getByRole('button',{name,exact:true}).click();
    await page.getByRole('dialog').waitFor();
    await page.locator('#email').fill('test@example.com');
    await page.getByRole('button',{name:/Register .*interest/}).click();
    report.checks.push({name:`${name} dialog and local form`,passed:await page.getByRole('status').isVisible() && await page.getByRole('heading',{name:title}).isVisible()});
    await page.keyboard.press('Escape');
  }
  for (const name of ['Privacy Policy','Terms & Conditions']) {
    await page.getByRole('button',{name,exact:true}).click();
    report.checks.push({name:`${name} dialog`,passed:await page.getByRole('dialog').isVisible()});
    await page.getByRole('button',{name:'Close dialog'}).click();
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle', timeout:90000});
  await page.waitForTimeout(2500);
  await overflow('mobile overflow');
  await page.screenshot({path:'/work/screenshots/mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Sleep Well',exact:true}).click();
  report.checks.push({name:'mobile feature tab',passed:await page.getByRole('button',{name:'Sleep Well',exact:true}).getAttribute('aria-pressed') === 'true'});
  await page.getByRole('button',{name:'Schedule a Tour',exact:true}).click();
  report.checks.push({name:'mobile dialog fits viewport',passed:await page.getByRole('dialog').evaluate(el => { const r=el.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight; })});
  await page.keyboard.press('Escape');
  fs.writeFileSync('/work/screenshots/browser-report.json', JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
  server.close();
})().catch(error => {console.error(error); server.close(); process.exitCode=1;});
