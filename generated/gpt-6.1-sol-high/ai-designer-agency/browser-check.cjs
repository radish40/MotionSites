const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(process.cwd(),'dist');
const base='/motionsites-results/ai-designer-agency/';
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4','.gif':'image/gif','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const filename=path.join(root,decodeURIComponent(req.url.split('?')[0]).replace(base,'') || 'index.html');
 const file=filename.endsWith('/')?path.join(filename,'index.html'):filename;
 if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}
 const size=fs.statSync(file).size;
 const range=req.headers.range;
 if(range){const [start,end]=range.replace('bytes=','').split('-').map(Number);const last=end||size-1;res.writeHead(206,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Range':`bytes ${start}-${last}/${size}`,'Accept-Ranges':'bytes','Content-Length':last-start+1});fs.createReadStream(file,{start,end:last}).pipe(res);}
 else {res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{await new Promise(r=>server.listen(4173,'0.0.0.0',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const report={};
for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile'});
 const page=await context.newPage();const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>{if(!r.url().startsWith('mailto:'))failed.push({url:r.url(),error:r.failure()?.errorText});});
 await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(6000);await page.evaluate(()=>document.fonts.ready);
 const heroVideo=await page.locator('.hero video').evaluate(v=>({readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,currentTime:v.currentTime,error:v.error?.message||null}));
 await page.screenshot({path:`screenshots/${name}-hero.png`});
 await page.getByRole('link',{name:'Get Started',exact:true}).click();await page.waitForTimeout(1300);
 const contactReached=await page.evaluate(()=>Math.abs(document.querySelector('#contact').getBoundingClientRect().top)<120);
 const ctaLinks=await page.locator('#contact a').evaluateAll(a=>a.map(x=>({text:x.textContent,href:x.getAttribute('href')})));
 await page.locator('#about').scrollIntoViewIfNeeded();await page.waitForTimeout(800);
 await page.screenshot({path:`screenshots/${name}-about.png`});
 await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 for(const article of await page.locator('#work article').all()){await article.scrollIntoViewIfNeeded();await page.waitForTimeout(400);}
 await page.screenshot({path:`screenshots/${name}-work.png`});
 await page.locator('#contact').scrollIntoViewIfNeeded();await page.waitForTimeout(2500);
 await page.screenshot({path:`screenshots/${name}-cta.png`});
 const media=await page.locator('video').evaluateAll(v=>v.map(x=>({src:x.currentSrc,readyState:x.readyState,width:x.videoWidth,error:x.error?.message||null})));
 const overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
 const images=await page.locator('img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
 const fonts=await page.evaluate(()=>({barlow:document.fonts.check('16px Barlow'),instrument:document.fonts.check('italic 16px "Instrument Serif"')}));
 await page.locator('#home').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
 await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
 await page.getByRole('textbox',{name:'Email address'}).fill('');await page.getByRole('button',{name:'SUBSCRIBE'}).click();
 const invalidEmailBlocked=await page.locator('input[type=email]').evaluate(e=>!e.validity.valid);
 await page.getByRole('textbox',{name:'Email address'}).fill('design@example.com');await page.getByRole('button',{name:'SUBSCRIBE'}).click();
 const subscriptionStatus=await page.getByRole('status').textContent();
 report[name]={viewport:{width,height},errors,failed,heroVideo,media,overflow,images,fonts,contactReached,ctaLinks,invalidEmailBlocked,subscriptionStatus};await context.close();
}
fs.writeFileSync('browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();server.close();
 for (const [name,result] of Object.entries(report)) {
  const pass = result.errors.length === 0 && result.overflow.viewport === result.overflow.document && result.images.every(i=>i.loaded) && result.fonts.barlow && result.fonts.instrument && result.contactReached && result.invalidEmailBlocked && result.subscriptionStatus.includes('email app') && result.media.every(v=>v.readyState>=2 && v.width>0);
  if(!pass) throw new Error(`${name}: browser acceptance check failed`);
 }})().catch(e=>{console.error(e);process.exit(1)});
