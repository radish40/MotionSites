const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/velorah/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if (!url.pathname.startsWith(base)) {res.writeHead(404).end(); return;}
  const target = path.join('/work/dist',decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!fs.existsSync(target)) {res.writeHead(404).end(); return;}
  const size = fs.statSync(target).size;
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  const headers = {'Content-Type':mime[path.extname(target)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if (range) {
    const start = +range[1], end = range[2] ? +range[2] : size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    fs.createReadStream(target,{start,end}).pipe(res);
  } else {res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(target).pipe(res);}
});
(async () => {
  await new Promise(r => server.listen(4173,'127.0.0.1',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
  const report = {};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
      const errors = [], failed = [];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error') errors.push(m.text());});
      page.on('requestfailed',r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
      page.on('response',r=>{if(r.status()>=400) failed.push({url:r.url(),status:r.status()});});
      await page.goto(`http://127.0.0.1:4173${base}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.querySelector('video').readyState>=3);
      await page.waitForTimeout(1300);
      const before = await page.locator('video').evaluate(v=>v.currentTime);
      await page.waitForTimeout(500);
      const video = await page.locator('video').evaluate(v=>({playing:!v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline,source:v.currentSrc}));
      assert(video.playing && video.time>before && video.width>0,'Background video plays');
      assert(video.loop && video.muted && video.autoplay && video.playsInline,'Video attributes');
      assert.equal(await page.locator('h1').innerText(),'Where dreams rise\nthrough the silence.'.replace('\n', name==='desktop'?'\n':' '));
      const fonts = await page.evaluate(()=>({display:document.fonts.check('96px "Instrument Serif"'),body:document.fonts.check('16px Inter')}));
      assert(fonts.display && fonts.body);
      const nav = page.locator('nav > div');
      assert.equal(await nav.isVisible(),name==='desktop');
      if(name==='desktop') {
        for(const label of ['Studio','About','Journal','Reach Us','Home']) {
          await page.getByRole('link',{name:label,exact:true}).click();
          assert.equal(await page.getByRole('link',{name:label,exact:true}).getAttribute('aria-current'),'page');
        }
      }
      for (let i=0;i<2;i++) {
        await page.getByRole('button',{name:'Begin Journey'}).nth(i).click();
        await page.waitForTimeout(1300);
        assert.equal(new URL(page.url()).hash,'#journey');
        assert.equal(await page.evaluate(()=>document.activeElement.id),'hero-heading');
      }
      await page.getByRole('link',{name:'Velorah home'}).click();
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
      assert(overflow.content<=width,'No horizontal overflow');
      await page.locator('video').evaluate(async v=>{v.pause();v.currentTime=4;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));});
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      assert.deepEqual(errors,[],'No browser errors');
      assert.deepEqual(failed,[],'No failed assets');
      report[name]={viewport:{width,height},video,fonts,overflow,errors,failedRequests:failed,navigation:name==='desktop'?'all five links checked':'hidden as specified',journeyButtons:'both checked; headline focus and entrance replay',screenshot:`screenshots/${name}.png`};
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el).animationName),'none');
      report[name].reducedMotion='entrance animations disabled';
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close(); server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
