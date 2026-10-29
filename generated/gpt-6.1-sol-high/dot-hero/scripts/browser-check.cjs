const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const base = '/motionsites-results/dot-hero/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join(root, pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors = [], failures = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failures.push({url:r.url(),error:r.failure().errorText}));
    await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});
    await page.waitForTimeout(2500);
    const assets = await page.evaluate(async () => {
      await document.fonts.ready;
      const video=document.querySelector('video');
      return {video:{readyState:video.readyState,paused:video.paused,currentTime:video.currentTime,width:video.videoWidth,height:video.videoHeight,error:video.error?.message || null},fonts:{instrument:document.fonts.check('16px "Instrument Serif"'),inter:document.fonts.check('16px Inter'),nokia:document.fonts.check('16px "Nokia Cellphone FC Small"')},overflow:document.documentElement.scrollWidth > innerWidth,bodyHeight:document.body.scrollHeight};
    });
    const samples=[];
    for(let i=0;i<18;i++){samples.push(await page.locator('[data-typing]').innerText());await page.waitForTimeout(300);}
    await page.getByRole('link',{name:'Link up',exact:true}).click();
    const ctaWorks = new URL(page.url()).hash === '#access';
    if(name==='desktop'){
      for(const label of ['Philosophy','Trust','Access','Tribe']){
        await page.getByRole('link',{name:label,exact:true}).click();
        if(new URL(page.url()).hash !== '#'+label.toLowerCase())throw new Error('Broken navigation '+label);
      }
    }
    await page.getByRole('link',{name:'dot. home'}).click();
    await page.evaluate(() => window.scrollTo(0,0));
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
    results.push({viewport:{width,height},name,assets,errors,failures,ctaWorks,typingChanges:new Set(samples).size>3,typingSamples:samples});
    await page.close();
  }
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();server.close();
  if(results.some(r=>r.errors.length || r.assets.overflow || !r.ctaWorks || !r.typingChanges || r.assets.video.readyState<2))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
