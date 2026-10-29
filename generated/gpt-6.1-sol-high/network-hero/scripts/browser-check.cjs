const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/network-hero/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
 if (!req.url.startsWith(base)) {res.writeHead(404); return res.end();}
 const relative = decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html';
 const file = path.resolve('dist',relative);
 if (!file.startsWith(path.resolve('dist')+path.sep) || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(resolve => server.listen(4173,'127.0.0.1',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[], failed=[];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console',msg => {if(msg.type()==='error')errors.push(msg.text());});
  page.on('requestfailed',r=>failed.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  const early = await page.locator('.typed-heading').innerText();
  assert(early.length < 82,'Typewriter begins incrementally');
  await page.waitForFunction(()=>document.documentElement.classList.contains('typing-complete'));
  await page.waitForTimeout(1500);
  await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,heading:document.querySelector('.typed-heading').textContent,count:document.querySelector('.count-value').textContent,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),inter:document.fonts.check('400 15px Inter'),urbanist:document.fonts.check('600 64px Urbanist'),orbits:document.querySelectorAll('.orbit').length,avatars:document.querySelectorAll('.avatar').length,logos:document.querySelectorAll('.ticker img').length,background:getComputedStyle(document.querySelector('.app')).backgroundImage}));
  assert.equal(metrics.scrollWidth,width,'No horizontal document overflow');
  assert.equal(metrics.count,'20k+'); assert.equal(metrics.images.length,0);
  assert(metrics.inter && metrics.urbanist); assert.equal(metrics.orbits,4);assert.equal(metrics.avatars,9);assert.equal(metrics.logos,20);
  assert.equal(metrics.heading,'Unlock Top Marketing Talent You Thought Was Out of Reach -- Now Just One Click Away!');
  const orbit=page.locator('.orbit-2');
  const before=await orbit.evaluate(e=>getComputedStyle(e).transform);
  await page.waitForTimeout(100);
  assert.notEqual(await orbit.evaluate(e=>getComputedStyle(e).transform),before,'Orbit rotates');
  const join=page.getByRole('link',{name:'Join Now',exact:true});
  await join.hover();await page.waitForTimeout(450);
  assert.equal(await join.evaluate(e=>getComputedStyle(e,'::after').transform),'matrix(1, 0, 0, 1, 0, 0)');
  await join.click();
  const start=page.getByRole('link',{name:'Start Project'});await start.hover();await page.waitForTimeout(450);
  assert.equal(await start.evaluate(e=>getComputedStyle(e,'::after').transform),'matrix(1, 0, 0, 1, 0, 0)');await start.click();
  if(name==='desktop') {
   const nav=page.getByRole('link',{name:'Solutions',exact:true});await nav.hover();await page.waitForTimeout(350);assert.equal(await nav.evaluate(e=>getComputedStyle(e,'::after').transform),'matrix(1, 0, 0, 1, 0, 0)');
  } else assert.equal(await page.locator('nav').isVisible(),false);
  await join.focus();assert.equal(await join.evaluate(e=>e===document.activeElement),true);
  await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());await page.waitForTimeout(500);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  results.push({name,viewport:{width,height},metrics,errors,failedRequests:failed,checks:['incremental typewriter and completed exact heading','20k+ counter','all images and fonts loaded','four rotating orbits and nine avatars','20 logo instances','CTA hover fill and click','keyboard focus','navigation hover or mobile hiding','no horizontal overflow','no console or script errors']});
  await page.close();
 }
 for (const width of [320,480,768,1024,1280]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(overflow,false,`No horizontal overflow at ${width}px`);
  results.push({name:`breakpoint-${width}`,passed:true});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
 assert.equal(await reduced.locator('.count-value').innerText(),'20k+');assert(await reduced.getByRole('link',{name:'Start Project'}).isVisible());
 results.push({name:'reduced-motion',passed:true});
 fs.writeFileSync('browser-checks.json',JSON.stringify(results,null,2));
 await browser.close();server.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
