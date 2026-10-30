const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert');
const root = '/work/dist';
const base = '/motionsites-results/digitwist-hero/';
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server = http.createServer((req,res)=>{let url=decodeURIComponent(req.url.split('?')[0]);if(!url.startsWith(base)){res.writeHead(404);res.end();return;}let file=path.join(root,url.slice(base.length)||'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();}else{res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);}});});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const context=await browser.newContext({viewport,deviceScaleFactor:1});
  const page=await context.newPage(); const errors=[]; const failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000}).catch(async e=>{if(!await page.locator('h1').isVisible())throw e;});
  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(2500);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,fontSans:document.fonts.check('600 20px "Instrument Sans"'),fontSerif:document.fonts.check('400 30px "Instrument Serif"'),video:{readyState:document.querySelector('video').readyState,time:document.querySelector('video').currentTime,paused:document.querySelector('video').paused,width:document.querySelector('video').videoWidth},posterLoaded:document.querySelector('video').poster}));
  assert(!state.overflow, name+' layout overflows');
  await page.screenshot({path:'/work/screenshots/'+name+'.png',fullPage:true});
  await page.getByRole('button',{name:'Start Building Free'}).click();
  await page.getByLabel('Your website idea').fill('A portfolio for a landscape photographer');
  await page.getByRole('button',{name:'Create concept'}).click();
  await page.getByRole('status').waitFor();
  await page.keyboard.press('Escape');
  assert(!await page.locator('dialog').isVisible());
  await page.getByRole('button',{name:'See Examples'}).click();
  await page.getByRole('button',{name:'Creative studio'}).click();
  assert((await page.getByLabel('Your website idea').inputValue()).includes('creative studio'));
  await page.getByRole('button',{name:'Close dialog'}).click();
  await page.getByRole('button',{name:'Get Started',exact:true}).click();
  await page.getByRole('button',{name:'Close dialog'}).click();
  if(name==='desktop'){
   await page.getByRole('button',{name:'Products',exact:true}).click();
   assert(await page.locator('#products-menu').isVisible());
   await page.keyboard.press('Escape');
   assert(!await page.locator('#products-menu').isVisible());
   for(const label of ['Customer Stories','Resources','Pricing','Book A Demo']){await page.getByRole('button',{name:label,exact:true}).click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');}
   await page.getByRole('button',{name:'Products',exact:true}).click();
   await page.getByRole('button',{name:'AI Website Builder'}).click();
   assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');
  } else {assert(!await page.getByRole('button',{name:'Products',exact:true}).isVisible());}
  assert.deepEqual(errors,[],name+' JS errors');
  report[name]={viewport,...state,scriptErrors:errors,failedRequests:failed,interactions:'passed',screenshot:'screenshots/'+name+'.png'};
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();await page.goto('http://localhost:4173'+base);await page.getByRole('heading',{name:'Build Faster'}).waitFor();
 await page.waitForTimeout(1000);report.reducedMotion={videoPaused:await page.locator('video').evaluate(v=>v.paused)};await context.close();
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
