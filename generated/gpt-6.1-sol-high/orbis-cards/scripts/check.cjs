const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const assert = require('assert');
const root = '/work/dist';
const base = '/motionsites-results/orbis-cards/';
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) {res.writeHead(404);res.end();return;}
  const file = path.join(root, pathname.slice(base.length) || 'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  const size = fs.statSync(file).size;
  const type = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4'}[path.extname(file)] || 'application/octet-stream';
  const range = req.headers.range;
  if(range) {
    const [s,e] = range.replace('bytes=','').split('-');const start=Number(s),end=e?Number(e):size-1;
    res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes'});fs.createReadStream(file).pipe(res);}
});
(async () => {
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = [];
  for (const [name,width,height,columns] of [['desktop',1440,1000,3],['mobile',390,844,1],['tablet',820,1000,2]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[], failed=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
    await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-preview]')).every(v=>v.readyState>=3 && v.currentTime>0));
    const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('[aria-label="Space object collection"]')).gridTemplateColumns.split(' ').length,fonts:[document.fonts.check('60px Anton'),document.fonts.check('68px Condiment')],videos:[...document.querySelectorAll('[data-preview]')].map(v=>({playing:!v.paused,muted:v.muted,loop:v.loop,width:v.videoWidth,height:v.videoHeight}))}));
    assert(!layout.overflow);assert.equal(layout.columns,columns);assert(layout.fonts.every(Boolean));assert(layout.videos.every(v=>v.playing&&v.muted&&v.loop));
    if(name!=='tablet') await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
    for(let i=0;i<3;i++){
      await page.getByRole('button',{name:/^View /}).nth(i).click();
      await page.waitForSelector('dialog[open]');
      assert.equal(await page.locator('dialog video').getAttribute('src'),base+`assets/space-0${i+1}.mp4`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(),0);
    }
    await page.getByRole('button',{name:'See all creators',exact:true}).click();
    assert(await page.getByRole('button',{name:/^View /}).first().evaluate(e=>e===document.activeElement));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>[...document.querySelectorAll('[data-preview]')].every(v=>v.paused));
    assert.equal(errors.length,0);
    results.push({viewport:name,width,height,...layout,interactions:'3 previews, Escape dismissal, collection focus, reduced motion passed',scriptErrors:errors,failedRequests:failed});
    await page.close();
  }
  fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
