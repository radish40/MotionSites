const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = '/work/dist';
const prefix = '/motionsites-results/bookedup/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
 let pathname = decodeURIComponent(req.url.split('?')[0]);
 if (!pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
 let file = path.join(root, pathname.slice(prefix.length) || 'index.html');
 if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
 res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(r => server.listen(4173,'0.0.0.0',r));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const errors = [], failed = [], results = [], consoleErrors = [];
 const fontRequests = []; 
 const page = await browser.newPage();
 page.on('console', m=>{if(m.type()==='error')consoleErrors.push(m.text());});
 page.on('response', r=>{if(/woff|ttf/.test(r.url()))fontRequests.push({url:r.url(),status:r.status()});});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',req=>failed.push({url:req.url(),error:req.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()});});
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',820,1000]]) {
  await page.setViewportSize({width,height});
  await page.goto('http://127.0.0.1:4173'+prefix,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  const layout = await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,fonts:{heading:[...document.fonts].some(f=>f.family==='SK Reykjavik Rounded Regular'&&f.status==='loaded'),body:[...document.fonts].some(f=>f.family==='Inter'&&f.status==='loaded')},cycleHeight:document.querySelector('.marquee-cycle').getBoundingClientRect().height,visibleTracks:[...document.querySelectorAll('.marquee-track')].filter(el=>getComputedStyle(el).display!=='none').length,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),heading:document.querySelector('h1').getBoundingClientRect().toJSON(),cards:document.querySelector('.client-card').getBoundingClientRect().toJSON()}));
  const firstY=await page.locator('.marquee-track').first().evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  const secondY=await page.locator('.marquee-track').first().evaluate(el=>getComputedStyle(el).transform);
  if(name!=='tablet') await page.screenshot({path:'/work/screenshots/'+name+'.png',fullPage:true});
  await page.getByRole('button',{name:'Scale revenue now'}).click();
  await page.getByRole('dialog').waitFor({state:'visible'});
  const growth=await page.getByRole('heading',{name:'A little space for big growth.'}).isVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Start Here'}).click();
  const intro=await page.getByRole('heading',{name:'More leads. More possibility.'}).isVisible();
  await page.getByRole('button',{name:'Back to BookedUp'}).click();
  results.push({name,width,height,...layout,marqueeMoving:firstY!==secondY,growthDialog:growth,introDialog:intro,dialogClosed:await page.getByRole('dialog').isHidden()});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload({waitUntil:'networkidle'});
 const reducedMotion=await page.locator('.marquee-track').first().evaluate(el=>getComputedStyle(el).transform==='none');
 const report={results,errors,consoleErrors,failed,reducedMotion,fontRequests};
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close(); server.close();
 if(errors.length||results.some(r=>r.scrollWidth>r.viewport||!r.images||!r.fonts.heading||!r.fonts.body||r.cycleHeight!==1200||!r.growthDialog||!r.introDialog)) process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
