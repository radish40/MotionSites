const {chromium}=require('/app/node_modules/playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve('dist'),base='/motionsites-results/vortex-studio-hero/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.gif':'image/gif','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer((req,res)=>{const relative=decodeURIComponent(req.url.split('?')[0]).replace(base,'');const file=path.join(root,relative||'index.html');if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{
await new Promise(r=>server.listen(4173,'0.0.0.0',r));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const report={url:'http://localhost:4173'+base,checks:[],errors:[],failedRequests:[]};
function check(name,passed,details){report.checks.push({name,passed,details});if(!passed)console.error('FAIL',name,details);}
try{
 for(const device of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()}));
  await page.goto(report.url,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
  check(device.name+' hero',await page.locator('h1').innerText()==='Build the next wave,\nthe bold way.');
  check(device.name+' fonts',await page.evaluate(()=>document.fonts.check('16px "PP Neue Montreal"')&&document.fonts.check('16px "PP Mondwest"')));
  check(device.name+' marquee animation',await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).animationDuration) === (device.name==='desktop'?'30s':'10s'));
  const before=await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(250);check(device.name+' marquee moves',before!==await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform));
  await page.getByRole('link',{name:'View projects',exact:true}).click();await page.waitForTimeout(1200);check(device.name+' projects anchor',await page.evaluate(()=>location.hash==='#projects'));
  await page.locator('.portrait-frame').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);const parallaxBefore=await page.locator('.portrait-frame img').getAttribute('style');await page.evaluate(()=>window.scrollBy(0,100));await page.waitForTimeout(200);check(device.name+' portrait parallax',parallaxBefore!==await page.locator('.portrait-frame img').getAttribute('style'));
  const carousel=page.locator('section[aria-label="Client testimonials"]');await carousel.scrollIntoViewIfNeeded();await page.waitForTimeout(1300);
  await page.locator('.carousel-arrow').first().hover();const track=page.locator('.carousel-window > div');const initial=await track.getAttribute('style');await page.getByRole('button',{name:'Next testimonial'}).click();await page.waitForTimeout(1000);check(device.name+' carousel next',initial!==await track.getAttribute('style'));
  await page.getByRole('button',{name:'Previous testimonial'}).click();await page.waitForTimeout(1000);check(device.name+' carousel previous',initial===await track.getAttribute('style'));
  const paused=await track.getAttribute('style');await page.waitForTimeout(3300);check(device.name+' carousel pauses',paused===await track.getAttribute('style'));
  await page.mouse.move(0,0);await page.locator('button:focus').evaluateAll(els=>els.forEach(el=>el.blur()));await page.waitForTimeout(4100);check(device.name+' carousel auto advances',paused!==await track.getAttribute('style'));
  if(device.name==='desktop'){
   await page.locator('.partner-panel').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);const box=await page.locator('.partner-panel').boundingBox();await page.mouse.move(box.x+100,box.y+100);await page.mouse.move(box.x+200,box.y+150,{steps:5});check('cursor trail spawns',await page.locator('.cursor-thumbnail').count()>0);await page.waitForTimeout(1200);check('cursor trail cleans up',await page.locator('.cursor-thumbnail').count()===0);
  }
  // Reveal all sections and load lazy media before the full page capture.
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=650){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,110));}});await page.waitForTimeout(1500);
  const images=await page.locator('img').evaluateAll(els=>els.map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0})));check(device.name+' images',images.every(i=>i.loaded),images.filter(i=>!i.loaded));
  check(device.name+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth})));
  check(device.name+' CTA destinations',await page.locator('a.button-primary').evaluateAll(els=>els.every(el=>el.getAttribute('href')==='https://halaskastudio.com/./book')));
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(1000);await page.screenshot({path:`screenshots/${device.name}.png`,fullPage:true,animations:'disabled'});await page.screenshot({path:`screenshots/${device.name}-viewport.png`,animations:'disabled'});
  await page.close();
 }
 check('no script or console errors',report.errors.length===0,report.errors);check('no failed requests',report.failedRequests.length===0,report.failedRequests);
}finally{fs.writeFileSync('browser-checks.json',JSON.stringify(report,null,2));await browser.close();server.close();}
console.log(JSON.stringify(report,null,2));if(report.checks.some(c=>!c.passed))process.exitCode=1;
})();
