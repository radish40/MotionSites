const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/vision-reveal/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server = http.createServer(async (req,res) => {
 try {
  if (!req.url.startsWith(prefix)) {res.writeHead(404);res.end();return;}
  const file = path.join(process.cwd(),'dist',decodeURIComponent(req.url.slice(prefix.length).split('?')[0]) || 'index.html');
  const data = await fs.readFile(file);
  res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});res.end(data);
 } catch {res.writeHead(404);res.end();}
});
(async () => {
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = [];
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const context = await browser.newContext({viewport:{width,height}, deviceScaleFactor:1, isMobile:name==='mobile',hasTouch:name==='mobile'});
   const page=await context.newPage(); const errors=[];const failed=[];
   page.on('pageerror', e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400) failed.push(`${r.status()} ${r.url()}`)});
   page.on('requestfailed',r=>failed.push(r.url()));
   await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2700);
   assert.equal(await page.locator('h1').getAttribute('aria-label'),'I build compelling visual stories & motion that make ideas shine.');
   assert.equal(await page.locator('#splash').evaluate(e=>getComputedStyle(e).visibility),'hidden');
   assert(await page.evaluate(()=>document.fonts.check('500 28px Inter')));
   const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,hero:document.querySelector('.hero').getBoundingClientRect().height}));
   assert(metrics.scrollWidth<=width, 'horizontal overflow');
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   const before=await page.screenshot();
   if(name==='mobile') await page.touchscreen.tap(270,550); else await page.mouse.move(1000,550);
   await page.waitForTimeout(1200);
   assert((await page.locator('#reveal-img').evaluate(e=>e.style.maskImage)).includes('radial-gradient'));
   const after=await page.screenshot(); assert(!before.equals(after),'spotlight changes the rendered image');
   await page.screenshot({path:`screenshots/${name}-reveal.png`,fullPage:true});
   await page.locator('#burger-btn').click();
   await page.waitForTimeout(600);assert.equal(await page.locator('#burger-btn').getAttribute('aria-expanded'),'true');
   assert.equal(await page.locator('#menu-panel').evaluate(e=>e.inert),false);
   await page.screenshot({path:`screenshots/${name}-menu.png`,fullPage:true});
   await page.locator('nav a').first().click();
   assert.equal(await page.locator('#burger-btn').getAttribute('aria-expanded'),'false');
   assert(page.url().endsWith('#work'));
   await page.locator('#burger-btn').click(); await page.keyboard.press('Escape');
   assert.equal(await page.locator('#burger-btn').getAttribute('aria-expanded'),'false');
   if(name==='desktop') {
    await page.locator('.cta-btn').hover();await page.waitForTimeout(500);
    const sizes=await page.locator('.cta-btn').evaluate(e=>({button:e.getBoundingClientRect().width,bg:e.querySelector('.cta-btn-bg').getBoundingClientRect().width}));
    assert(Math.abs(sizes.bg-(sizes.button-16))<1,'CTA hover expands white background');
   }
   await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
   assert.equal(await page.locator('h1 .word-reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   results.push({viewport:`${width}x${height}`,layout:metrics,script_errors:errors,failed_requests:failed,checks:['assets and Inter loaded','no horizontal overflow','entrance complete','spotlight changes pixels','menu opens and closes','nav closes menu','Escape closes menu','reduced motion visible',...(name==='desktop'?['CTA hover expansion']:[])]});
   await context.close();
  }
  await fs.writeFile('screenshots/checks.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
