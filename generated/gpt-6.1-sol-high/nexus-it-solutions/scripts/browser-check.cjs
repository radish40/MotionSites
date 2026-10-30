const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve('dist');
const base = '/motionsites-results/nexus-it-solutions/';
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mp4':'video/mp4', '.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  if (!name.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.join(root, name.slice(base.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404); return res.end();}
  const size = fs.statSync(file).size;
  const range = req.headers.range;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes'};
  if (range) {
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    const start = Number(match[1]); const end = match[2] ? Number(match[2]) : size-1;
    res.writeHead(206, {...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.writeHead(200,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors = [], failedRequests = [];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
  const before = await page.locator('video').evaluate(v=>v.currentTime);
  await page.waitForTimeout(600);
  const playback = await page.locator('video').evaluate((v,b)=>({playing:!v.paused && v.currentTime>b,muted:v.muted,loop:v.loop,objectFit:getComputedStyle(v).objectFit,width:v.videoWidth,height:v.videoHeight}),before);
  await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
  const layout = await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,heading:document.querySelector('h1').textContent,akshar:document.fonts.check('400 20px Akshar'),inter:document.fonts.check('400 20px Inter'),corners:document.querySelectorAll('.corner').length}));
  await page.keyboard.press('Tab');
  const keyboardFocus = await page.evaluate(()=>({tag:document.activeElement.tagName,outline:getComputedStyle(document.activeElement).outlineStyle}));
  const cta = await page.getByText('START YOUR JOURNEY',{exact:true}).locator('..').getAttribute('href');
  let menu = null;
  if (name==='mobile') {
   await page.getByRole('button',{name:'Open navigation'}).click();
   menu = {opened:await page.getByRole('button',{name:'Close navigation'}).getAttribute('aria-expanded')==='true',links:await page.locator('#mobile-navigation a').count()};
   await page.locator('#mobile-navigation').getByRole('link',{name:'HOME',exact:true}).click();
   menu.closedAfterSelection=await page.locator('#mobile-navigation').count()===0;
  } else {
   const contact = page.getByRole('link',{name:'GET IN TOUCH',exact:true});
   await contact.hover();
   await page.waitForTimeout(250);
   if (await contact.evaluate(el=>getComputedStyle(el).backgroundColor) !== 'rgb(115, 123, 140)') {
    const color = await contact.evaluate(el=>getComputedStyle(el).backgroundColor);
    if(color === 'rgba(0, 0, 0, 0)') throw new Error('Contact hover did not apply');
   }
  }
  await page.mouse.move(width-5,height-5);
  await page.locator('body').click({position:{x:width-5,y:height-5}});
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  results.push({name,viewport:{width,height},errors,failedRequests,layout,playback,cta,menu,keyboardFocus});
  await page.close();
 }
 await browser.close(); server.close();
 fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>r.errors.length||r.layout.scrollWidth>r.viewport.width||!r.playback.playing))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
