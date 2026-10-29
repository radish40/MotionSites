const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const base = '/motionsites-results/arceage-services/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.json':'application/json','.woff2':'font/woff2'};
const server = http.createServer((req,res)=>{
  const rel=decodeURIComponent(req.url.split('?')[0]).replace(base,'');
  const file=path.join('/work/dist',rel || 'index.html');
  if(!file.startsWith('/work/dist/') || !fs.existsSync(file) || fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(4173,'0.0.0.0',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results={};
 for(const [name,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  const errors=[], failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure().errorText}));
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const heading of await page.locator('#services h3').all()){await heading.scrollIntoViewIfNeeded();await page.waitForTimeout(2000);}
  await page.getByRole('button',{name:'Schedule Service',exact:true}).filter({visible:true}).scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1800);
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth, fonts:{barlow:document.fonts.check('16px Barlow'),instrument:document.fonts.check('italic 16px "Instrument Serif"')},imageLoaded:document.querySelector('#services img').naturalWidth>0,lottieCount:document.querySelectorAll('.lf-player-container svg').length,heading:document.querySelector('h2').textContent}));
  await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Schedule Service',exact:true}).filter({visible:true}).click();
  await page.waitForTimeout(1500);
  const contact=await page.evaluate(()=>({focused:document.activeElement.id==='contact',visible:document.getElementById('contact').getBoundingClientRect().top<innerHeight,scrollY}));
  if(!layout.fonts.barlow || !layout.fonts.instrument || layout.scrollWidth>viewport.width || !layout.imageLoaded || layout.lottieCount!==3 || errors.length || !contact.focused || !contact.visible)throw new Error(JSON.stringify({name,layout,errors,contact}));
  results[name]={viewport,layout,contact,scriptErrors:errors,failedRequests:failed};
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
 await browser.close();server.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
