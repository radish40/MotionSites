const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/digital-director/';
const types = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.woff2':'font/woff2' };
(async () => {
 const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join('/work/dist', relative || 'index.html');
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');fs.createReadStream(file).pipe(res);
 });
 await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const report = { url: 'http://localhost:4173'+base, errors:[], failedRequests:[], checks:[] };
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   page.on('pageerror', e=>report.errors.push(String(e)));
   page.on('requestfailed', r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
   await page.goto(report.url,{waitUntil:'networkidle',timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=2},{},{timeout:45000});
   const before=await page.locator('video').evaluate(v=>v.currentTime);
   await page.waitForTimeout(1200);
   const info=await page.evaluate(()=>{
    const v=document.querySelector('video');
    return {title:document.title, viewport:[innerWidth,innerHeight],scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],video:{readyState:v.readyState,time:v.currentTime,paused:v.paused,muted:v.muted,width:v.videoWidth,height:v.videoHeight,transform:getComputedStyle(v).transform},fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,status:f.status})),hero:document.querySelector('h1').getBoundingClientRect().toJSON(),footer:document.querySelector('footer').getBoundingClientRect().toJSON()};
   });
   assert(info.footer.bottom <= height-16, 'Footer must fit above bottom padding');assert(info.hero.x >= 0);assert(info.hero.right <= width);assert.equal(info.scroll[0],width); assert.equal(info.scroll[1],height);assert(info.video.time>before);assert(!info.video.paused);assert(info.video.muted);
   assert(info.fonts.some(f=>f.family==='basis33'&&f.status==='loaded'));
   assert(info.fonts.some(f=>f.family==='Inter'&&f.status==='loaded'));
   await page.screenshot({path:`/work/screenshots/${name}.png`});
   if(name==='mobile'){
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(850);
    assert.equal(await page.getByRole('dialog').isVisible(),true);
    assert.equal(await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link').count(),6);
    await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
    await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'PROJECTS',exact:true}).click();
    assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
    await page.getByRole('button',{name:'Open menu'}).click();await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
    await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('button',{name:'Close menu'}).click();
    report.checks.push('Mobile menu opens; all six links render; link, Escape, and X close it.');
   } else {
    assert.equal(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link').count(),6);
    const button=page.getByRole('button',{name:'PLAY SHOWREEL'});
    await button.hover();await page.waitForTimeout(200);
    info.showreelHover=await button.evaluate(el=>getComputedStyle(el).backgroundColor);
    await button.click();await page.waitForTimeout(500);
    assert(await page.evaluate(()=>document.fullscreenElement===document.querySelector('video')));
    await page.evaluate(()=>document.exitFullscreen());
    report.checks.push('Desktop navigation renders; showreel hover and video fullscreen work.');
   }
   report.checks.push({viewport:name,...info});await page.close();
  }
  assert.equal(report.errors.length,0);
  report.passed=true;
 } catch(e) {report.passed=false;report.error=String(e);process.exitCode=1;}
 finally {fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));await browser.close();server.close();console.log(JSON.stringify(report,null,2));}
})();
