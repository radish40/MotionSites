const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const prefix = '/motionsites-results/7/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf'};
const server = http.createServer((req,res)=>{
  let file = path.resolve(root, decodeURIComponent(req.url.split('?')[0].replace(prefix,'')) || 'index.html');
  if(!file.startsWith(root)) {res.writeHead(403);return res.end();}
  try { if(fs.statSync(file).isDirectory()) file = path.join(file,'index.html');res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');res.end(fs.readFileSync(file)); }
  catch {res.writeHead(404);res.end('Not found');}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={};
 for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  const errors=[],failedRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(3500);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,font:document.fonts.check('400 15px Inter'),video:(()=>{const v=document.querySelector('video');return {currentTime:v.currentTime,readyState:v.readyState,paused:v.paused,videoWidth:v.videoWidth,error:v.error?.message||null,streamError:v.dataset.streamError||null,opacity:getComputedStyle(v).opacity};})()}));
  assert.equal(layout.width,layout.scrollWidth,'Horizontal overflow');
  assert.ok(layout.video.currentTime > 0 && !layout.video.paused && layout.video.readyState >= 3, 'Video is playing');
  assert.equal(layout.video.opacity, '1');
  const noFooterCollision = await page.evaluate(() => document.querySelector('.logo-row').getBoundingClientRect().bottom < document.querySelector('.hero-footnote').getBoundingClientRect().top);
  assert.ok(noFooterCollision, 'Logos clear the footer');
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  if(name==='mobile') {
   await page.getByRole('button',{name:'Open menu',exact:true}).click();
   await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('button',{name:'Insights',exact:true}).click();
  } else await page.getByRole('button',{name:'Insights',exact:true}).click();
  await assert.ok(await page.getByRole('dialog').isVisible());
  await page.getByRole('heading',{name:'Make every iteration count.'}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').isVisible(),false);
  await page.locator('.hero-actions').getByRole('button',{name:'Get Started for Free'}).click();
  await page.getByLabel('Work email').fill('test@example.com');
  await page.getByRole('button',{name:'Get started',exact:true}).click();
  await page.getByRole('heading',{name:'Thanks for exploring Synapse.'}).waitFor();
  await page.getByRole('button',{name:'Back to Synapse'}).click();
  await page.getByRole('button',{name:"Let's Get Connected"}).click();
  await page.getByLabel('Work email').fill('test@example.com');
  await page.getByLabel('What’s on your mind?').fill('A new testing workflow');
  await page.getByRole('button',{name:'Let’s connect',exact:true}).click();
  await page.getByRole('heading',{name:'Thanks for exploring Synapse.'}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(errors.length,0,errors.join('\n'));
  results[name]={viewport,layout,scriptErrors:errors,failedRequests,interactions:'passed: navigation dialog, Escape, signup preview, contact preview'};
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
 await reduced.getByRole('heading',{name:'Where Innovation Meets Execution'}).waitFor();
 results.reducedMotion='Page renders with reduced motion preference';
 await browser.close();server.close();fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
