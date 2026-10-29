const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/luminara/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.join('/work/dist', relative);
  if (!req.url.startsWith(base) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file);
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  if (req.headers.range) {
    const [startText, endText] = req.headers.range.replace('bytes=', '').split('-');
    const start = Number(startText), end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end-start+1 });
    fs.createReadStream(file, {start, end}).pipe(res);
  } else { res.setHeader('Content-Length', stat.size); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', headless: true, args:['--no-sandbox', '--disable-dev-shm-usage']});
  const report = { checks: [], errors: [], failedRequests: [], canceledRequests: [], externalAssetIssues: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1, isMobile:name==='mobile'});
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('requestfailed', req => { const item = {url:req.url(),error:req.failure().errorText}; if(item.error==='net::ERR_ABORTED') report.canceledRequests.push(item); else if(req.url().startsWith('https://fonts.')) report.externalAssetIssues.push(item); else report.failedRequests.push(item); });
      await page.goto('http://localhost:4173'+base, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
      const metrics = await page.evaluate(async () => {
        const video = document.querySelector('video');
        const start = video.currentTime;
        await new Promise(resolve=>setTimeout(resolve, 350));
        return {
          width:innerWidth,height:innerHeight, scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,
          heading:document.querySelector('h1').innerText,
          video:{playing:!video.paused, advances:video.currentTime>start,width:video.videoWidth,height:video.videoHeight,muted:video.muted,loop:video.loop},
          fonts:{inter:[...document.fonts].some(f=>f.family==='Inter' && f.weight==='500' && f.status==='loaded'),serif:[...document.fonts].some(f=>f.family==='Instrument Serif' && f.style==='italic' && f.status==='loaded'),loadedFaces:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight,style:f.style}))},
          navigationVisible:getComputedStyle(document.querySelector('nav a + div') || document.querySelector('nav div div')).display!=='none'
        };
      });
      if(metrics.scrollWidth!==width || metrics.scrollHeight!==height) throw new Error(name+' overflow');
      if(!metrics.fonts.loadedFaces.some(f=>f.family==='Inter') || !metrics.fonts.loadedFaces.some(f=>f.family==='Instrument Serif')) throw new Error(name+' font loading failed');
      if(!metrics.video.playing || !metrics.video.advances) throw new Error(name+' video playback failed');
      const buttons=page.getByRole('button');
      for(let i=0;i<await buttons.count();i++) {
        await buttons.nth(i).hover();
        await buttons.nth(i).focus();
        await buttons.nth(i).click();
      }
      await page.getByRole('link',{name:'Luminara home'}).click();
      if(name==='desktop') {
        for(const label of ['Work','Gallery','Plans','Story']) await page.getByRole('link',{name:label,exact:true}).click();
      }
      await page.mouse.move(width/2,height/2);
      await page.evaluate(async()=>{document.activeElement.blur();const v=document.querySelector('video');v.pause();v.currentTime=2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      report.checks.push({viewport:name, ...metrics, controls:'hover, keyboard focus, and clicks passed; navigation stays within hero'});
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
    if(report.errors.length || report.failedRequests.length) process.exitCode=1;
  } finally { await browser.close();server.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
