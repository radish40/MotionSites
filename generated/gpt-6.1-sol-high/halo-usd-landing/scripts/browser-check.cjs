const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/halo-usd-landing/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  if (!pathname.startsWith(base)) { res.writeHead(404); return res.end(); }
  const file = path.resolve('dist', pathname.slice(base.length) || 'index.html');
  if (!file.startsWith(path.resolve('dist') + path.sep) || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
  const stat=fs.statSync(file);
  const range=req.headers.range;
  const headers={'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if(range){const [a,b]=range.replace('bytes=','').split('-');const start=Number(a),end=b?Number(b):stat.size-1;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res);}
});
(async()=>{
  await new Promise(r=>server.listen(4173,'0.0.0.0',r));
  const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report={served_directory:path.resolve('dist'),checked_at:new Date().toISOString(),font_responses:[],url:`http://localhost:4173${base}`,viewports:[],script_errors:[],console_errors:[],failed_requests:[]};
  try {
    for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
      const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
      const page=await context.newPage();
      page.on('pageerror',e=>report.script_errors.push(String(e)));
      page.on('console',msg=>{if(msg.type()==='error')report.console_errors.push({viewport:name,message:msg.text()});});
      page.on('response',res=>{if(res.url().endsWith('.woff2'))report.font_responses.push({viewport:name,url:res.url(),status:res.status(),content_type:res.headers()['content-type']});if(res.status()>=400)report.failed_requests.push({viewport:name,url:res.url(),status:res.status()});});
      await page.goto(report.url,{waitUntil:'networkidle'});
      await page.locator('video').first().evaluate(v=>new Promise((resolve,reject)=>{if(v.readyState>=2)return resolve();v.addEventListener('loadeddata',resolve,{once:true});setTimeout(()=>reject(new Error('Video did not load')),15000);}));
      await page.evaluate(()=>document.fonts.ready);
      const fonts = await page.evaluate(async () => {
        await Promise.all([document.fonts.load('400 16px "TT Norms Pro"'), document.fonts.load('600 16px "TT Norms Pro"')]);
        return [...document.fonts].filter(f => f.family === 'TT Norms Pro').map(f => ({family:f.family,weight:f.weight,status:f.status,display:f.display}));
      });
      assert.deepEqual(fonts.map(f=>f.weight).sort(),['400','600']);
      assert(fonts.every(f=>f.status==='loaded' && f.display==='swap'),'Both actual TT Norms Pro faces must load');
      const cdp=await context.newCDPSession(page);
      await cdp.send('DOM.enable');
      await cdp.send('CSS.enable');
      const {root}=await cdp.send('DOM.getDocument');
      const renderedFonts=[];
      for (const [selector,expected] of [['#hero-title','TTNormsPro-DmBd'],['#usd-halo p','TTNormsPro-Rg']]) {
        const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});
        const {fonts:actual}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
        assert(actual.some(f=>f.isCustomFont && f.postScriptName===expected && f.glyphCount>0),`Expected actual ${expected} glyphs at ${selector}: ${JSON.stringify(actual)}`);
        renderedFonts.push({selector,fonts:actual});
      }
      await cdp.detach();
      const videos=await page.locator('video').evaluateAll(vs=>vs.map(v=>({readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,playsInline:v.playsInline,paused:v.paused,currentTime:v.currentTime,error:v.error?.message || null})));
      assert(videos.every(v=>v.readyState>=2 && v.width>0 && v.muted && v.loop && v.playsInline && !v.paused && !v.error));
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert.equal(overflow,false,'Horizontal overflow');
      await page.getByRole('button',{name:'Open Wallet',exact:true}).click();
      await page.getByRole('dialog').waitFor({state:'visible'});
      await page.getByRole('button',{name:'Close wallet'}).click();
      assert.equal(await page.getByRole('dialog').count(),0);
      await page.getByRole('button',{name:'Open Wallet',exact:true}).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(),0);
      await page.getByRole('link',{name:'Join us',exact:true}).click();
      await page.waitForTimeout(750);
      assert.equal(new URL(page.url()).hash,'#usd-halo');
      await page.getByRole('link',{name:'Discover it',exact:true}).click();
      await page.waitForTimeout(750);
      assert.equal(new URL(page.url()).hash,'#savings');
      await page.getByRole('link',{name:'Know more',exact:true}).click();
      await page.waitForTimeout(750);
      assert.equal(new URL(page.url()).hash,'#usd-halo');
      const invalidAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.querySelector(a.getAttribute('href'))).map(a=>a.textContent));
      assert.deepEqual(invalidAnchors,[]);
      const animations=await page.locator('.marquee-track,.backers-track').evaluateAll(els=>els.map(e=>({name:getComputedStyle(e).animationName,duration:getComputedStyle(e).animationDuration})));
      assert.deepEqual(animations.map(x=>x.duration),['22s','30s']);
      if(name==='desktop'){
        for(const label of ['Network','Ecosystem','Rewards','Help','News']){await page.getByRole('link',{name:label,exact:true}).click();await page.waitForTimeout(650);}
      }
      // Decode the chosen frame while each video is visible before full-page capture.
      for (const video of await page.locator('video').all()) {
        await video.scrollIntoViewIfNeeded();
        await video.evaluate(v => new Promise((resolve,reject) => {
          v.pause();
          if (Math.abs(v.currentTime - 1) < 0.01 && !v.seeking) return resolve();
          const timeout=setTimeout(()=>reject(new Error('Screenshot video seek timed out')),10000);
          v.addEventListener('seeked',()=>{clearTimeout(timeout);resolve();},{once:true});
          v.currentTime=1;
        }));
        await page.waitForTimeout(150);
      }
      await page.getByRole('link',{name:'Halo home'}).click();
      await page.waitForTimeout(800);
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
      report.viewports.push({name,width,height,horizontal_overflow:overflow,fonts,rendered_fonts:renderedFonts,videos,animations,interactions:'passed',reduced_motion:'passed',screenshot:`screenshots/${name}.png`});
      await context.close();
    }
    assert.deepEqual(report.script_errors,[]);
    assert.deepEqual(report.console_errors,[]);
    assert.deepEqual(report.failed_requests,[]);
    assert.equal(report.font_responses.length,4);
    assert(report.font_responses.every(f=>f.status===200 && f.content_type==='font/woff2'));
    report.passed=true;
    fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
