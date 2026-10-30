const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve('dist');
const prefix = '/motionsites-results/nexacore-hero/';
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.m3u8':'application/vnd.apple.mpegurl'};
const server=http.createServer((req,res)=>{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}const file=path.join(root,pathname.slice(prefix.length)||'index.html');if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{
 await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={};
 for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();const errors=[],consoleErrors=[],failedRequests=[],httpErrors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text());});page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(4000);
  const initial=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('400 16px "Mazzard H"'),hero:(()=>{const v=document.querySelector('.hero-video');return {readyState:v.readyState,playing:!v.paused,time:v.currentTime,width:v.videoWidth,error:v.error?.message};})()}));
  await page.locator('.control-video').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const v=document.querySelector('.control-video video');return v.readyState>=2&&v.videoWidth>0;},{},{timeout:30000});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(700);
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  if(name==='mobile'){await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.locator('#mobile-menu').waitFor();await page.locator('#mobile-menu a').first().click();await page.waitForTimeout(700);}
  else {await page.locator('.desktop-links a').first().click();await page.waitForTimeout(700);}
  const scrolled=await page.locator('.navbar').evaluate(el=>el.classList.contains('scrolled'));
  const card=page.locator('.service-card').first();await card.scrollIntoViewIfNeeded();await page.waitForTimeout(800);if(name==='desktop')await card.hover();else await card.focus();await page.waitForTimeout(600);
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.service-card .learn-more')).opacity==='1',{},{timeout:3000});
  const cardActive=await card.locator('.learn-more').evaluate(el=>getComputedStyle(el).opacity==='1');
  await card.locator('.learn-more').click();await page.waitForTimeout(1000);
  const control=await page.locator('.control-video video').evaluate(v=>({readyState:v.readyState,playing:!v.paused,time:v.currentTime,width:v.videoWidth,error:v.error?.message}));
  if(name==='mobile'){await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.locator('#mobile-menu button[aria-label="Search"]').click();}else await page.getByRole('button',{name:'Search',exact:true}).click();
  await page.getByRole('textbox',{name:'Search sections'}).fill('method');
  const searchCount=await page.locator('.search-results a').count();await page.locator('.search-results a').click();await page.waitForTimeout(700);
  const overflow=[];for(const id of ['home','what-we-build','our-method','who-we-are']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(100);overflow.push({section:id,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});}
  assert.equal(initial.overflow,false);assert.equal(initial.font,true);assert.ok(initial.hero.playing&&initial.hero.width>0);assert.ok(scrolled&&cardActive);assert.equal(searchCount,1);assert.ok(control.playing&&control.width>0);assert.equal(errors.length,0);assert.equal(consoleErrors.length,0);assert.equal(httpErrors.length,0);assert.ok(overflow.every(v=>!v.overflow));
  report[name]={viewport,initial,scrolled,cardActive,searchCount,searchClosed:await page.locator('dialog').evaluate(el=>!el.open),control,overflow,errors,consoleErrors,failedRequests,httpErrors};
  await context.close();
 }
 fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
