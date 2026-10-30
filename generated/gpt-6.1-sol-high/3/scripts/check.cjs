const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const prefix = '/motionsites-results/3/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
 const url = decodeURIComponent(req.url.split('?')[0]);
 const file = path.join('/work/dist', url.startsWith(prefix) ? url.slice(prefix.length) || 'index.html' : '__missing__');
 if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const results = {desktop:{},mobile:{},errors:[],networkFailures:[]};
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e => results.errors.push(e.message));
  page.on('console',m => {if(m.type()==='error')results.errors.push(m.text());});
  page.on('requestfailed',r => {if(!r.failure()?.errorText.includes('ERR_ABORTED'))results.networkFailures.push({url:r.url(),error:r.failure()?.errorText});});
  await page.goto(`http://localhost:4173${prefix}`, {waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3500);
  results[name].video = await page.locator('video').evaluate(v=>({readyState:v.readyState,currentTime:v.currentTime,paused:v.paused,muted:v.muted,loop:v.loop,width:v.videoWidth,error:v.error?.message || null}));
  results[name].fonts = await page.evaluate(()=>({switzer:document.fonts.check('500 64px Switzer'),geist:document.fonts.check('400 16px Geist')}));
  results[name].overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert.equal(results[name].overflow,false);
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  if(name==='mobile') {
   await page.getByRole('button',{name:'Open navigation'}).click();
   assert.equal(await page.locator('#mobile-navigation').isVisible(),true);
   await page.locator('#mobile-navigation').getByRole('button',{name:'Features'}).click();
   assert.equal(await page.getByRole('dialog').isVisible(),true);
   await page.getByRole('button',{name:'Close dialog'}).click();
   results[name].menu='passed';
  } else {
   await page.locator('.primary').hover();
   await page.waitForTimeout(350);
   results[name].hoverArrowOpacity=await page.locator('.primary-arrow').evaluate(e=>getComputedStyle(e).opacity);
   assert.equal(results[name].hoverArrowOpacity,'1');
   for (const item of ['Features','Pricing','Reviews']) {
    await page.locator('.desktop-nav').getByRole('button',{name:item}).click();
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    await page.keyboard.press('Escape');
   }
   await page.getByRole('button',{name:'Sign In',exact:true}).click();
   await page.getByLabel('Work email').fill('test@example.com');
   await page.getByRole('button',{name:'Continue',exact:true}).click();
   assert.equal(await page.getByText("You're all set to preview.").isVisible(),true);
   await page.getByRole('button',{name:'Close dialog'}).click();
  }
  await page.locator('.primary').click();
  await page.getByLabel('Work email').fill('store@example.com');
  await page.getByRole('button',{name:'Get started',exact:true}).click();
  assert.equal(await page.getByText("You're all set to preview.").isVisible(),true);
  await page.getByRole('button',{name:'Close dialog'}).click();
  results[name].interactions='passed';
  await page.close();
 }
 assert.equal(results.errors.length,0,'Browser console errors');
 assert.equal(results.networkFailures.length,0,'Failed network requests');
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
