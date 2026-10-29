const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = '/work/dist';
const base = '/motionsites-results/futuristic-tech/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(base, '') || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes' };
  if (req.headers.range) {
    const [s,e] = req.headers.range.replace('bytes=','').split('-');
    const start = Number(s), end = e ? Number(e) : size - 1;
    res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${size}`, 'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
  await new Promise(resolve => server.listen(4173,resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = { errors:[], failedRequests:[], httpErrors:[], consoleErrors:[], checks:[] };
  function check(name,pass,detail) { results.checks.push({name,pass,detail}); if(!pass) throw new Error(name+': '+detail); }
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      page.on('pageerror',e=>results.errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')results.consoleErrors.push(m.text());});
      page.on('response',r=>{if(r.status()>=400)results.httpErrors.push({url:r.url(),status:r.status()});});
      page.on('requestfailed',r=>results.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
      await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>document.querySelector('video').readyState >= 2);
      const playback = await page.evaluate(async()=>{const v=document.querySelector('video'); const t=v.currentTime; await new Promise(r=>setTimeout(r,300)); return {playing:!v.paused && v.currentTime>t,muted:v.muted,loop:v.loop,inline:v.playsInline,width:v.videoWidth,height:v.videoHeight};});
      check(name+' video playback',playback.playing && playback.muted && playback.loop && playback.inline,playback);
      check(name+' no overflow',await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth && document.documentElement.scrollHeight===innerHeight));
      check(name+' Inter loaded',await page.evaluate(()=>document.fonts.check('400 16px Inter')));
      await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();v.currentTime=3;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));});
      await page.screenshot({path:`/work/screenshots/${name}.png`});
      if(name==='desktop') {
        const image = await page.evaluate(()=>{const v=document.querySelector('video');const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',.9).split(',')[1];});
        fs.writeFileSync('/work/public/assets/poster.jpg',Buffer.from(image,'base64'));
        await page.getByRole('button',{name:'Join the wait',exact:true}).first().click();
        check('waitlist dialog opens',await page.getByRole('dialog').isVisible());
        await page.keyboard.press('Escape');
        check('waitlist dialog closes',!await page.getByRole('dialog').isVisible());
      } else {
        const menu=page.getByRole('button',{name:'Open menu'});
        await menu.click();
        await page.waitForTimeout(650);
        check('mobile menu opens',await page.getByRole('navigation',{name:'Mobile navigation'}).isVisible());
        await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
        await page.keyboard.press('Escape');
        check('Escape closes menu',(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'))==='false');
        await menu.click();await page.waitForTimeout(550);
        await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'AI Defense'}).click();
        check('nav closes menu',(await menu.getAttribute('aria-expanded'))==='false');
        await menu.click();await page.waitForTimeout(550);
        await page.mouse.click(200,600);
        check('backdrop closes menu',(await menu.getAttribute('aria-expanded'))==='false');
      }
      await page.getByRole('button',{name:'See it in motion'}).click();
      check(name+' motion CTA restarts film',await page.evaluate(()=>!document.querySelector('video').paused && document.querySelector('video').currentTime<2));
      await page.close();
    }
    check('no script errors',results.errors.length===0,results.errors);
    check('no console errors',results.consoleErrors.length===0,results.consoleErrors);
    check('no HTTP asset errors',results.httpErrors.length===0,results.httpErrors);
  } finally {
    fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
    await browser.close();server.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
