const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = path.resolve('dist');
const base = '/motionsites-results/adhd-planner/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.webp':'image/webp','.woff2':'font/woff2','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(req.url.split('?')[0]); if(!pathname.startsWith(base)){res.writeHead(404);return res.end();}const file=path.join(root,pathname.slice(base.length)||'index.html');if(!fs.existsSync(file)){res.writeHead(404);return res.end();} const size=fs.statSync(file).size;const range=req.headers.range;const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};if(range){const [s,e]=range.replace('bytes=','').split('-');const start=Number(s),end=e?Math.min(Number(e),size-1):size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});const page=await context.newPage();const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
const assert=(value,msg)=>{if(!value)throw new Error(name+': '+msg)};
assert(await page.title()==='Drift — ADHD-friendly planner','title');
const heroVideo=await page.locator('video').first().evaluate(v=>({ready:v.readyState,width:v.videoWidth,playing:!v.paused,error:v.error?.message||null}));
await page.screenshot({path:`screenshots/${name}.png`});
await page.getByRole('button',{name:'Open menu',exact:true}).click();assert(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded')==='true','menu opens');await page.getByRole('button',{name:'FAQ',exact:true}).click();assert(await page.locator('dialog').isVisible(),'FAQ dialog opens');await page.keyboard.press('Escape');assert(!await page.locator('dialog').isVisible(),'escape closes dialog');
await page.getByRole('button',{name:'Start for free',exact:true}).first().click();assert(await page.locator('dialog').isVisible(),'CTA opens');await page.getByRole('button',{name:'Close dialog'}).click();
await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('link',{name:'Drift AI',exact:true}).click();await page.waitForTimeout(1100);const anchorTop=await page.locator('#drift-ai').evaluate(el=>el.getBoundingClientRect().top);console.log(name+' Drift AI anchor top: '+anchorTop);assert(anchorTop>=0 && anchorTop<height/2,'Drift AI anchor');
for(const label of ['Say hello','Stay informed']){await page.getByRole('button',{name:label,exact:true}).click();assert(await page.locator('dialog').isVisible(),label+' opens');await page.getByRole('button',{name:'Close dialog'}).click();}
for(let i=0;i<3;i++){await page.locator('article').nth(i).scrollIntoViewIfNeeded();await page.waitForTimeout(900);assert(await page.locator('article').nth(i).evaluate(el=>getComputedStyle(el).opacity==='1'),'card revealed '+i);if(name==='desktop')assert(await page.locator('[aria-label="Feature navigation"] button').nth(i).getAttribute('aria-current')==='true','active card '+i);}
if(name==='desktop'){await page.locator('[aria-label="Feature navigation"] button').first().click();await page.waitForTimeout(1100);assert(await page.locator('[aria-label="Feature navigation"] button').first().getAttribute('aria-current')==='true','feature navigation scroll');}
const media=await page.locator('video').evaluateAll(vs=>vs.map(v=>({src:v.getAttribute('src'),width:v.videoWidth,ready:v.readyState,error:v.error?.message||null})));
assert(media.every(v=>v.width>0 && v.ready>=2 && !v.error),'all videos decoded');
const font=await page.evaluate(()=>({inter:document.fonts.check('16px Inter'),serif:document.fonts.check('italic 16px "Instrument Serif"')}));
assert(font.inter && font.serif,'fonts loaded');
const overflows=[];
for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=500){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(70);const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));if(dims.scroll>dims.client)overflows.push({y,...dims});}
if(overflows.length)console.log(JSON.stringify({overflows,offenders:await page.locator('body *').evaluateAll(els=>els.map(el=>({tag:el.tagName,cls:el.className,x:el.getBoundingClientRect().x,right:el.getBoundingClientRect().right})).filter(el=>el.right>window.innerWidth+1||el.x< -1))}));assert(!overflows.length,'no horizontal overflow');assert(!errors.length,'no script errors');
await page.evaluate(()=>window.scrollTo({top:document.getElementById('features').offsetTop+160,behavior:'instant'}));await page.waitForTimeout(1000);await page.screenshot({path:`screenshots/${name}-features.png`});
results.push({viewport:name,width,height,heroVideo,media,font,errors,failed,overflows,interactions:'passed'});await context.close();}
fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));await browser.close();server.close();})().catch(e=>{console.error(e);process.exit(1)});
