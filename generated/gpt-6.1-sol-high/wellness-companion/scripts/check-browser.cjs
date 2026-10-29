const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/wellness-companion/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + '/')) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err,data) => {res.writeHead(err?404:200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(err?'Not found':data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report = {viewports:[],errors:[],assetFailures:[],checks:[]};
 try {
 for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  const context = await browser.newContext({viewport,deviceScaleFactor:1,hasTouch:viewport.width===390});
  const page = await context.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')report.errors.push(msg.text());});
  page.on('requestfailed',r=>report.assetFailures.push({url:r.url(),error:r.failure().errorText}));
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1500);
  const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,phone:{width:document.querySelector('.phone').clientWidth,height:document.querySelector('.phone').clientHeight},fontLoaded:document.fonts.check('16px "Helvetica Now Var"'),imageLoaded:document.querySelector('.backdrop-image').naturalWidth>0,contentFits:document.querySelector('.content').scrollHeight===document.querySelector('.content').clientHeight}));
  assert.ok(metrics.scrollWidth<=viewport.width,'No horizontal overflow');
  assert.ok(metrics.imageLoaded && metrics.fontLoaded && metrics.contentFits);
  assert.equal(metrics.phone.height,780);
  if(viewport.width===1440)assert.equal(metrics.phone.width,375);
  report.viewports.push({...viewport,...metrics});
  await page.screenshot({path:`screenshots/${viewport.width===1440?'desktop':'mobile'}.png`,fullPage:true});
  const stress=page.getByRole('button',{name:'02 Stress'});
  const skin=page.getByRole('button',{name:'04 Skin'});
  const sleep=page.getByRole('button',{name:'01 Sleep quality'});
  assert.equal(await stress.getAttribute('aria-pressed'),'true');
  assert.equal(await skin.getAttribute('aria-pressed'),'true');
  assert.equal(await sleep.getAttribute('aria-pressed'),'false');
  await sleep.click(); assert.equal(await sleep.getAttribute('aria-pressed'),'true');
  await stress.click(); assert.equal(await stress.getAttribute('aria-pressed'),'false');
  const slider=page.getByRole('slider');
  async function drag(fraction) {
   const thumb=await slider.boundingBox();
   const track=await page.locator('.confirm-track').boundingBox();
   await page.mouse.move(thumb.x+22,thumb.y+22);
   await page.mouse.down();
   await page.mouse.move(thumb.x+22+(track.width-56)*fraction,thumb.y+22,{steps:15});
   await page.mouse.up();
   await page.waitForTimeout(350);
  }
  await drag(0.6);assert.equal(await slider.getAttribute('aria-valuenow'),'0');
  await drag(0.95);assert.equal(await slider.getAttribute('aria-valuenow'),'100');
  await sleep.click();assert.equal(await slider.getAttribute('aria-valuenow'),'0');
  await slider.focus();await page.keyboard.press('ArrowRight');assert.equal(await slider.getAttribute('aria-valuenow'),'100');
  // Exercise deterministic unsupported-browser feedback without requesting microphone access.
  await page.evaluate(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;});
  await page.getByRole('button',{name:'Choose wellness aspects by voice'}).click();
  assert.ok(await page.getByText('Voice is unavailable in this browser. Tap your choices above.').isVisible());
  report.checks.push({viewport:viewport.width,preselectedCards:true,toggles:true,shortDragResets:true,longDragConfirms:true,selectionResetsConfirmation:true,keyboardConfirmation:true,voiceFallback:true});
  await context.close();
 }
 // Verify supplied local image fallback, while the remote source is blocked.
 const fallbackPage=await browser.newPage();
 await fallbackPage.route('https://images.higgs.ai/**',r=>r.abort());
 await fallbackPage.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
 assert.ok(await fallbackPage.locator('.backdrop-image').evaluate(img=>img.naturalWidth>0 && img.src.includes('/assets/wellness-background.webp')));
 report.checks.push({localImageFallback:true});
 await fallbackPage.close();
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 assert.equal(report.errors.length,0);
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
