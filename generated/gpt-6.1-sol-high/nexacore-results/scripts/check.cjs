const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/nexacore-results/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  if (!req.url.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', decodeURIComponent(req.url.slice(base.length).split('?')[0]) || 'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404).end(); return;}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
 await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['breakpoint-below',639,900],['breakpoint-at',640,900]]) {
  const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
  const errors = [], failedRequests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if(m.type()==='error') errors.push(m.text()); });
  page.on('requestfailed', r => failedRequests.push(r.url()));
  await page.goto('http://127.0.0.1:4173'+base,{waitUntil:'networkidle'});
  await page.evaluate(() => document.fonts.ready);
  const details = await page.evaluate(() => {
   const section = document.querySelector('section');
   const container = section.children[1];
   const desktop = container.children[0], mobile = container.children[1];
   const visible = getComputedStyle(desktop).display !== 'none' ? desktop : mobile;
   return {
    title:document.title,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    viewportWidth:innerWidth, documentWidth:document.documentElement.scrollWidth,
    desktopVisible:getComputedStyle(desktop).display !== 'none',
    mobileVisible:getComputedStyle(mobile).display !== 'none',
    pillarCount:visible.children.length,
    pillars:[...visible.children].map(p => ({label:p.children[0].textContent.trim(),x:p.getBoundingClientRect().x,y:p.getBoundingClientRect().y,align:getComputedStyle(p).alignItems})),
    imagesLoaded:[...document.images].every(i=>i.complete && i.naturalWidth>0),
    fontsLoaded:document.fonts.check('400 16px "Mazzard H"') && document.fonts.check('500 16px "Mazzard H"'),
    animationCount:document.getAnimations().length,
    controlCount:document.querySelectorAll('button,a,input,select,textarea').length,
    bodyHeight:document.body.scrollHeight,
   };
  });
  if (['desktop','mobile'].includes(name)) await page.screenshot({path:`/work/screenshots/${name}.png`, fullPage:true});
  await page.mouse.move(100,100);
  await page.evaluate(() => window.scrollTo(0,document.body.scrollHeight));
  details.scrollReachedBottom = await page.evaluate(()=>Math.ceil(scrollY+innerHeight)>=document.documentElement.scrollHeight);
  const passed = !details.horizontalOverflow && details.pillarCount===4 && details.imagesLoaded && details.fontsLoaded && details.animationCount===0 && details.controlCount===0 && details.desktopVisible===(width>=640) && errors.length===0 && failedRequests.length===0;
  results.push({name,viewport:{width,height},passed,...details,errors,failedRequests});
  await page.close();
 }
 await browser.close(); server.close();
 fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>!r.passed)) process.exitCode=1;
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
