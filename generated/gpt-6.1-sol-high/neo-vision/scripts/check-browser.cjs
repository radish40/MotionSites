const {chromium}=require('/app/node_modules/playwright-core');
const fs=require('fs'),http=require('http'),path=require('path');
const base='/motionsites-results/neo-vision/';
const server=http.createServer((req,res)=>{let url=decodeURIComponent(req.url.split('?')[0]);if(!url.startsWith(base)){res.writeHead(404);res.end();return;}let file=path.join('/work/dist',url.slice(base.length)||'index.html');if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));}).listen(4173,'0.0.0.0');
function assert(value,msg){if(!value)throw Error(msg);}
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const results=[];
for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 console.log('Checking '+device);const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:device==='mobile',hasTouch:device==='mobile'});page.setDefaultTimeout(12000);let errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
 const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),videos:[...document.querySelectorAll('video')].map(v=>({ready:v.readyState,time:v.currentTime,paused:v.paused,width:v.videoWidth}))}));
 assert(metrics.scrollWidth===width,device+' horizontal overflow');assert(metrics.images.every(i=>i.ok),device+' broken image');assert(metrics.videos.every(v=>v.ready>=2&&!v.paused&&v.time>0),device+' video playback failed');
 await page.screenshot({path:`/work/screenshots/${device}.png`,fullPage:true});await page.screenshot({path:`/work/screenshots/${device}-hero.png`});
 console.log('Screenshots saved; testing navigation');await page.getByRole('link',{name:'Get Started',exact:true}).click();await page.waitForTimeout(600);assert(await page.evaluate(()=>scrollY>0),'Get Started scroll');
 console.log('Testing video modal');await page.getByRole('button',{name:'Watch a Video'}).click();assert(await page.locator('dialog').evaluate(d=>d.open),'Video dialog opened');await page.keyboard.press('Escape');assert(!await page.locator('dialog').evaluate(d=>d.open),'Dialog closed');
 console.log('Testing tabs');for(const name of ['Technology','Experience','Innovation']){await page.getByRole('tab',{name,exact:true}).click();assert(await page.getByRole('tab',{name,exact:true}).getAttribute('aria-selected')==='true','tab selected');await page.waitForFunction(()=>{const i=document.querySelector('#insight-panel img');return i&&i.complete&&i.naturalWidth>0;});}
 console.log('Testing article dialog');await page.locator('#insight-panel').getByRole('button',{name:'Learn More'}).click();assert(await page.locator('dialog').evaluate(d=>d.open),'Article dialog');await page.getByRole('button',{name:'Close dialog'}).click();
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);
 if(device==='mobile'){await page.getByRole('button',{name:'Open menu'}).click();assert(await page.locator('#mobile-menu').isVisible(),'mobile menu');}
 await page.getByRole('searchbox').count();
 console.log('Testing search');const search=page.getByRole('textbox',{name:'Search insights'});await search.fill('Spatial');await search.press('Enter');await page.getByRole('link',{name:'The Rise of Spatial Computing in Everyday Life'}).click();assert(await page.getByRole('tab',{name:'Technology',exact:true}).getAttribute('aria-selected')==='true','search result selected');
 if(device==='mobile')assert(!await page.locator('#mobile-menu').count(),'mobile menu closed on result');
 assert(errors.length===0,JSON.stringify(errors));assert(failed.length===0,JSON.stringify(failed));
 results.push({device,viewport:{width,height},metrics,checks:['page loaded at required subpath','no horizontal overflow','all images loaded','both videos autoplay','Get Started scroll','video modal opens and closes with Escape','three tabs update content','article dialog opens and closes','search selects matching insight',...(device==='mobile'?['mobile menu opens and closes']:[])],console_errors:errors,failed_responses:failed});await page.close();
}
await browser.close();fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));server.close();console.log(JSON.stringify(results,null,2));})().catch(e=>{console.error(e);server.close();process.exit(1)});
