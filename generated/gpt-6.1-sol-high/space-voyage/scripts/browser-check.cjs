const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const assert = require('node:assert/strict');
const http = require('http');
const path = require('path');
const root = '/work';
const prefix = '/motionsites-results/space-voyage/';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const target = url === '/poster-source' ? '/work/public/media/voyage.mp4' : path.join(root, 'dist', url.startsWith(prefix) ? url.slice(prefix.length) || 'index.html' : url);
  fs.stat(target, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end(); return; }
    const headers = { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    if (req.headers.range) {
      const [a,b] = req.headers.range.replace('bytes=','').split('-');
      const start = Number(a), end = b ? Number(b) : stat.size - 1;
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end-start+1 }); fs.createReadStream(target, {start,end}).pipe(res);
    } else { res.writeHead(200, {...headers, 'Content-Length':stat.size}); fs.createReadStream(target).pipe(res); }
  });
});
(async () => {
  await new Promise(r => server.listen(4173,'0.0.0.0', r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  if (process.argv.includes('--poster')) {
    const page = await browser.newPage();
    await page.goto('http://localhost:4173/poster-source');
    const data = await page.evaluate(async () => {
      const video = document.querySelector('video');
      video.muted = true;
      await new Promise((resolve,reject) => { if(video.readyState >= 2) resolve(); else {video.onloadeddata=resolve;video.onerror=reject;} });
      video.pause(); video.currentTime = .1;
      await new Promise(r=>video.onseeked=r);
      const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);
      return canvas.toDataURL('image/jpeg',.94).split(',')[1];
    });
    fs.writeFileSync('/work/public/images/hero_bg.jpeg', Buffer.from(data,'base64'));
    console.log('Poster generated from original video.');
  } else {
    const report={};
    for(const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
      const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
      const page=await context.newPage();const errors=[],failed=[],warnings=[];
      page.on('pageerror',e=>errors.push(e.message)); page.on('requestfailed',req=>failed.push({url:req.url(),error:req.failure()?.errorText})); page.on('console',msg=>{if(msg.type()==='warning'||msg.type()==='error')warnings.push(msg.text())});
      await page.goto('http://localhost:4173'+prefix,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2000);
      const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,heading:document.querySelector('h1').innerText,fonts:{heading:document.fonts.check('italic 88px "Instrument Serif"'),body:document.fonts.check('16px Barlow')},video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,width:document.querySelector('video').videoWidth,time:document.querySelector('video').currentTime}}));
      assert.equal(initial.overflow,false);assert.equal(initial.fonts.heading,true);assert.equal(initial.fonts.body,true);assert.ok(initial.video.readyState>=2);assert.equal(initial.video.paused,false);
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      await page.getByRole('button',{name:'Start Your Voyage'}).click(); await page.getByRole('heading',{name:'Your voyage starts here'}).waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'View Liftoff',exact:true}).first().click();await page.locator('dialog video').waitFor();
      const liftoff=await page.locator('dialog video').evaluate(v=>({controls:v.controls,src:v.currentSrc}));
      await page.getByRole('button',{name:'Close dialog'}).click();
      if(name==='mobile')await page.getByRole('button',{name:'Open menu'}).click();
      await page.getByRole('button',{name:'Worlds',exact:true}).click();await page.getByRole('heading',{name:'A universe to discover'}).waitFor();await page.keyboard.press('Escape');
      if(name==='mobile')await page.getByRole('button',{name:'Open menu'}).click();
      await page.getByRole('button',{name:'Claim a Spot',exact:false}).click();await page.getByRole('heading',{name:'Your voyage starts here'}).waitFor();await page.keyboard.press('Escape');
      for (const [link,heading] of [['Voyages','Your next horizon'],['Innovation','Extraordinary by engineering'],['Plan Launch','Your voyage starts here']]) {
        if(name==='mobile')await page.getByRole('button',{name:'Open menu'}).click();
        await page.getByRole('button',{name:link,exact:true}).click();await page.getByRole('heading',{name:heading,exact:true}).waitFor();await page.keyboard.press('Escape');
      }
      if(name==='mobile')await page.getByRole('button',{name:'Open menu'}).click();
      await page.getByRole('button',{name:'Home',exact:true}).click();assert.equal(await page.locator('dialog').isVisible(),false);
      assert.equal(errors.length,0);assert.equal(failed.length,0);
      report[name]={...initial,interactions:{startVoyage:true,liftoff,worlds:true,voyages:true,innovation:true,planLaunch:true,home:true,claimSpot:true,escapeClosesDialog:true,mobileMenu:name==='mobile'},errors,failed,warnings};
      await context.close();
    }
    const fallbackPage=await browser.newPage();await fallbackPage.route('https://d8j0ntlcm91z4.cloudfront.net/**',route=>route.abort());
    await fallbackPage.goto('http://localhost:4173'+prefix);
    await fallbackPage.waitForFunction(()=>{const v=document.querySelector('video');return v.currentSrc.includes('/media/voyage.mp4')&&v.readyState>=2&&!v.paused});
    report.localVideoFallback={passed:true};await fallbackPage.close();
    fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  }
  await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
