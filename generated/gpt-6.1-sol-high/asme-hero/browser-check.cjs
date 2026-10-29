const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/asme-hero/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html';
  const file = path.join(process.cwd(), 'dist', rel);
  if (!file.startsWith(path.join(process.cwd(), 'dist/')) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  if (req.headers.range) {
    const [startString, endString] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startString); const end = endString ? Number(endString) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end-start+1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else { res.writeHead(200, { ...headers, 'Content-Length': size }); fs.createReadStream(file).pipe(res); }
});
(async () => {
 await new Promise(r => server.listen(4173, '0.0.0.0', r));
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
 const errors = [], consoleErrors = [], failures = [], results = {};
 try {
  for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
   const page = await browser.newPage({ viewport: { width,height }, deviceScaleFactor: 1 });
   page.on('pageerror', err => errors.push(err.message));
   page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
   page.on('requestfailed', req => failures.push({ url: req.url(), error: req.failure().errorText }));
   await page.goto('http://localhost:4173'+base, { waitUntil: 'networkidle' });
   await page.evaluate(() => document.fonts.ready);
   await page.waitForFunction(() => {const v = document.querySelector('video'); return v.readyState >= 2 && v.currentTime > .8 && v.style.opacity === '1';}, {timeout: 30000});
   await page.evaluate(() => { const v = document.querySelector('video'); v.currentTime = 4; });
   await page.waitForFunction(() => { const v = document.querySelector('video'); return !v.seeking && v.readyState >= 3 && v.currentTime >= 4 && Number(v.style.opacity) === 1; });
   await page.waitForTimeout(300);
   results[name] = await page.evaluate(() => {
    const video = document.querySelector('video'); const heading = document.querySelector('h1').getBoundingClientRect();
    return { viewport: {width: innerWidth, height: innerHeight}, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, headingFits: heading.left >= 0 && heading.right <= innerWidth, fontLoaded: document.fonts.check('48px "Instrument Serif"'), video: { currentTime: video.currentTime, duration: video.duration, readyState: video.readyState, paused: video.paused, opacity: video.style.opacity, source: video.currentSrc } };
   });
   assert.equal(results[name].scrollWidth, width, 'horizontal overflow');
   assert.equal(results[name].scrollHeight, height, 'vertical overflow');
   assert(results[name].headingFits, 'heading overflow');
   assert(results[name].fontLoaded, 'font unavailable');
   await page.screenshot({ path: `screenshots/${name}.png` });
   await page.getByRole('button',{name:'Sign Up', exact:true}).click();
   assert(await page.getByRole('textbox',{name:'Email address'}).evaluate(el => el === document.activeElement));
   await page.getByRole('textbox',{name:'Email address'}).fill('invalid-email');
   await page.getByRole('button',{name:'Subscribe to newsletter'}).click();
   assert.equal(await page.getByRole('textbox',{name:'Email address'}).evaluate(el => el.validity.valid), false);
   assert.equal(await page.getByRole('status').count(), 0);
   await page.getByRole('textbox',{name:'Email address'}).fill('curious@example.com');
   await page.getByRole('button',{name:'Subscribe to newsletter'}).click();
   await page.getByRole('status').filter({hasText:'Newsletter sign-up is coming soon'}).waitFor();
   await page.getByRole('button',{name:'Manifesto',exact:true}).click();
   await page.getByRole('dialog').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   assert.equal(await page.getByRole('dialog').isVisible(), false);
   for (const name of ['Instagram','Twitter','Website']) {
    await page.getByRole('button',{name,exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.getByRole('button',{name:'Close dialog'}).click();
   }
   await page.getByRole('button',{name:'Login',exact:true}).click();
   await page.getByLabel('Email',{exact:true}).fill('curious@example.com');
   await page.getByLabel('Password',{exact:true}).fill('test-password');
   await page.getByRole('dialog').getByRole('button',{name:'Login',exact:true}).click();
   await page.getByRole('status').filter({hasText:'Login is not connected'}).waitFor();
   await page.keyboard.press('Escape');
   if (name === 'desktop') {
    for (const link of ['Features','Pricing','About']) {
     await page.getByRole('link',{name:link,exact:true}).click();
     await page.getByRole('dialog').waitFor({state:'visible'});
     await page.keyboard.press('Escape');
    }
    // Exercise the real end-of-video fade and delayed restart twice.
    results.loopChecks = [];
    for (let n=0; n<2; n++) {
     await page.evaluate(() => { const v = document.querySelector('video'); v.currentTime = v.duration - .8; });
     await page.waitForFunction(() => { const v=document.querySelector('video'); const o=Number(v.style.opacity); return v.currentTime > v.duration-1 && o>0 && o<1; });
     await page.waitForFunction(() => { const v=document.querySelector('video'); return v.currentTime>.2 && v.currentTime<2 && Number(v.style.opacity)===1 && !v.paused; });
     results.loopChecks.push('fade-out and restart with full fade-in passed');
    }
   }
   results[name].interactions = 'passed';
   await page.close();
  }
  const fallbackPage = await browser.newPage();
  await fallbackPage.route('https://d8j0ntlcm91z4.cloudfront.net/**', route => route.abort());
  await fallbackPage.goto('http://localhost:4173'+base);
  await fallbackPage.waitForFunction(() => { const v = document.querySelector('video'); return v.currentSrc.includes('/assets/asme-background.mp4') && v.currentTime > .5 && !v.paused; });
  results.localVideoFallback = 'passed with remote source deliberately blocked';
  await fallbackPage.close();
  assert.equal(errors.length,0, 'page script errors');
  assert.equal(consoleErrors.length, 0, 'browser console errors');
  results.scriptErrors = errors; results.consoleErrors = consoleErrors; results.failedRequests = failures;
  fs.writeFileSync('screenshots/browser-checks.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode=1; server.close(); });
