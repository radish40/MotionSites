const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/tech-forward/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
  const file = path.join('/work/dist', decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors = [], failed = [];
    page.on('pageerror',err => errors.push(err.message));
    page.on('requestfailed',req => failed.push({url:req.url(),error:req.failure().errorText}));
    await page.goto(`http://localhost:4173${base}`, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2500);
    const media = await page.evaluate(async () => {
      const v = document.querySelector('video');
      if (v.readyState >= 2) { v.pause(); v.currentTime = Math.min(2, v.duration / 2); await new Promise(r => v.addEventListener('seeked',r,{once:true})); }
      return {readyState:v.readyState, width:v.videoWidth, height:v.videoHeight, duration:v.duration, error:v.error?.message || null, source:v.currentSrc, fontLoaded:document.fonts.check('300 16px Inter')};
    });
    await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    const overflow = await page.evaluate(() => ({horizontal:document.documentElement.scrollWidth > innerWidth, vertical:document.documentElement.scrollHeight > innerHeight}));
    await page.getByRole('button',{name:'Menu', exact:true}).click();
    await page.locator('#main-menu').waitFor({state:'visible'});
    await page.locator('#main-menu button').first().click();
    await page.getByRole('dialog').waitFor({state:'visible'});
    await page.getByRole('button',{name:'Close details'}).click();
    await page.getByRole('button',{name:'How It Works',exact:true}).click();
    await page.getByRole('heading',{name:'Designed to adapt.'}).waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'See Features',exact:true}).click();
    await page.getByRole('heading',{name:'One card. More possibilities.'}).waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Explore Adaptive Systems'}).click();
    await page.getByRole('heading',{name:'Adaptive Systems',exact:true}).waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    results.push({name,viewport:{width,height},media,overflow,errors,failed,interactions:'Menu, both CTAs, Adaptive Systems, close button and Escape passed'});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close(); server.close();
})().catch(e => {console.error(e);process.exit(1)});
