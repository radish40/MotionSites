const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = '/work/dist';
const base = '/motionsites-results/crypto-wealth-hero/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const target = path.join(root, pathname.slice(base.length) || 'index.html');
  if (!pathname.startsWith(base) || !fs.existsSync(target)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(target), range = req.headers.range;
  res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
  if (range) {
    const [a,b] = range.replace('bytes=','').split('-'); const start = Number(a), end = b ? Number(b) : stat.size - 1;
    res.writeHead(206, {'Content-Range':`bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges':'bytes', 'Content-Length':end-start+1});
    fs.createReadStream(target, {start,end}).pipe(res);
  } else { res.setHeader('Content-Length',stat.size); fs.createReadStream(target).pipe(res); }
});
(async () => {
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless:true, args:['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors = [], failedRequests = [];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('requestfailed', req=>failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForTimeout(3500);
  await page.evaluate(()=>document.fonts.ready);
  const initial = await page.evaluate(()=>({title:document.title,font:document.fonts.check('500 16px Inter'), overflow:document.documentElement.scrollWidth > innerWidth, heroOpacity:getComputedStyle(document.querySelector('#home')).opacity, videos:[...document.querySelectorAll('video')].map(v=>({readyState:v.readyState,currentTime:v.currentTime,paused:v.paused,error:v.error?.message || null,width:v.videoWidth,height:v.videoHeight})), cards:document.querySelectorAll('.popup-card-animate').length}));
  await page.screenshot({path:`/work/screenshots/${name}.png`});
  await page.getByRole('link',{name:'Get started',exact:true}).click();
  await page.waitForTimeout(1400);
  const scrolled = await page.evaluate(()=>({scrollY, heroOpacity:getComputedStyle(document.querySelector('#home')).opacity,showcaseOpacity:getComputedStyle(document.querySelector('#showcase')).opacity,zoom:document.querySelector('video').parentElement.style.transform,overflow:document.documentElement.scrollWidth > innerWidth,dashboardVisible:document.querySelector('.dashboard-animate').getBoundingClientRect().top < innerHeight}));
  await page.screenshot({path:`/work/screenshots/${name}-showcase.png`});
  await page.getByRole('link',{name:'ContentFlow home'}).click();
  await page.waitForTimeout(1100);
  const homeWorks = await page.evaluate(()=>scrollY < 1);
  if(name==='desktop') {
   for (const label of ['Features','Workflows','Resources','Pricing']) { await page.getByRole('link',{name:label,exact:true}).click(); await page.waitForTimeout(850); if(await page.evaluate(()=>scrollY < innerHeight * .9)) errors.push(`${label} failed to navigate`); }
  }
  results.push({name,viewport:{width,height},initial,scrolled,homeWorks,errors,failedRequests});
  await page.close();
 }
 fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
 await browser.close(); server.close();
})().catch(e=>{console.error(e); process.exit(1)});
