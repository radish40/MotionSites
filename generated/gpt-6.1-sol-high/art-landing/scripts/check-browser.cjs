const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/art-landing/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage'], headless:true });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: {width,height}, deviceScaleFactor:1, isMobile:name==='mobile', hasTouch:name==='mobile' });
    const errors = [], failedRequests = [], httpErrors = [];
    page.on('response', res => { if(res.status() >= 400) httpErrors.push({url:res.url(),status:res.status()}); });
    page.on('pageerror', err => errors.push(err.message));
    page.on('requestfailed', req => failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
    await page.goto('http://localhost:4173'+base, {waitUntil:'networkidle',timeout:60000});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(video => video.readyState >= 2), {timeout:30000});
    await page.waitForTimeout(1200);
    const initial = await page.evaluate(() => ({
      viewport:{width:innerWidth,height:innerHeight},
      overflow:document.querySelector('main').scrollWidth > innerWidth,
      fonts:['Manrope','Italiana','Marck Script'].map(font=>({font,loaded:document.fonts.check('16px "'+font+'"')})),
      videos:[...document.querySelectorAll('video')].map(v=>({loaded:v.readyState>=2,playing:!v.paused,width:v.videoWidth,height:v.videoHeight})),
      cloudFallback:[...document.querySelectorAll('img')].every(i=>i.complete && i.naturalWidth>0),
      cloudTransform:getComputedStyle([...document.querySelectorAll('section:nth-child(2) > div')].find(x=>getComputedStyle(x).display!=='none')).transform
    }));
    await page.screenshot({path:`/work/screenshots/${name}.png`});
    await page.keyboard.press('Tab');
    const keyboardFocus = await page.getByRole('button',{name:'Get started'}).evaluate(el=>el===document.activeElement);
    await page.getByRole('button',{name:'Get started'}).hover();
    await page.waitForTimeout(350);
    const hover = await page.getByRole('button',{name:'Get started'}).evaluate(el=>({background:getComputedStyle(el).backgroundColor,blur:getComputedStyle(el).backdropFilter}));
    await page.getByRole('button',{name:'Get started'}).click();
    await page.waitForFunction(() => Math.abs(document.querySelector('main').scrollTop - innerHeight)<2);
    await page.waitForTimeout(500);
    const afterClick = await page.evaluate(() => ({scrollTop:document.querySelector('main').scrollTop,overflow:document.querySelector('main').scrollWidth>innerWidth, cloudTransform:getComputedStyle([...document.querySelectorAll('section:nth-child(2) > div')].find(x=>getComputedStyle(x).display!=='none')).transform}));
    await page.screenshot({path:`/work/screenshots/${name}-section2.png`});
    await page.evaluate(()=>document.querySelector('main').scrollTo(0,document.querySelector('main').scrollHeight));
    await page.waitForTimeout(1000);
    const bottomPlayback = await page.locator('video').nth(1).evaluate(v=>({playing:!v.paused,time:v.currentTime,loaded:v.readyState>=2}));
    await page.screenshot({path:`/work/screenshots/${name}-bottom.png`});
    results.push({name,initial,keyboardFocus,hover,afterClick,bottomPlayback,errors,failedRequests,httpErrors});
    await page.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
})().catch(err=>{console.error(err);server.close();process.exit(1);});
