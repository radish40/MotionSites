const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/urban-jungle-hero/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server = http.createServer((req,res) => {
  let relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const file = path.join('/work/dist', relative);
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  const stat = fs.statSync(file);
  const range = req.headers.range;
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges','bytes');
  if (range) {
    const [s,e] = range.replace('bytes=','').split('-');const start = Number(s), end = e ? Number(e) : stat.size-1;
    res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);
  } else {res.setHeader('Content-Length',stat.size);fs.createReadStream(file).pipe(res);}
});
function assert(value,message) {if (!value) throw new Error(message);}
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const results = {errors:[],failedRequests:[],checks:[]};
  let page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror', e => results.errors.push(e.message));
  page.on('requestfailed',req => results.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForFunction(() => !document.querySelector('.loading-overlay'),{timeout:30000});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  const initial = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.querySelector('main').offsetHeight,video:{duration:document.querySelector('video').duration,readyState:document.querySelector('video').readyState,currentTime:document.querySelector('video').currentTime},fonts:[document.fonts.check('16px Dirtyline36Daysoftype2022'),document.fonts.check('16px Manrope'),document.fonts.check('16px "Instrument Serif"')]}));
  assert(initial.scrollWidth === 1440,'Desktop horizontal overflow');assert(initial.height === 5000,'Root is not 500vh');assert(initial.video.readyState >= 2,'Video not ready');
  await page.screenshot({path:'/work/screenshots/desktop.png'});
  results.checks.push({name:'desktop initial 1440x1000',passed:true,details:initial});
  await page.getByRole('link',{name:'ABOUT',exact:true}).hover();
  await page.waitForTimeout(400);
  const hover = await page.locator('.pill').nth(1).locator('.pill-label-hover').evaluate(el=>getComputedStyle(el).transform);
  results.checks.push({name:'GSAP liquid pill hover',passed:hover === 'matrix(1, 0, 0, 1, 0, 0)',transform:hover});
  await page.getByRole('link',{name:'ABOUT',exact:true}).click();
  await page.mouse.move(0,0);
  await page.waitForTimeout(5100);
  const about = await page.evaluate(() => ({scrollY,videoTime:document.querySelector('video').currentTime,videoDuration:document.querySelector('video').duration,heading:document.querySelector('h2').getBoundingClientRect().toJSON(),panel:document.querySelector('.glass-panel').getBoundingClientRect().toJSON(),heroOpacity:getComputedStyle(document.querySelector('.char')).opacity,scrollWidth:document.documentElement.scrollWidth}));
  assert(about.scrollY >= 3995,'About did not reach bottom');assert(about.videoTime > about.videoDuration*.95,'Video did not scrub to end');assert(about.heroOpacity === '0','Hero did not animate away');assert(about.heading.top>=0 && about.heading.bottom<=1000,'Desktop about heading clipped');
  results.checks.push({name:'About scroll, headline exit, video seek, glass panel',passed:true,details:about});
  await page.screenshot({path:'/work/screenshots/desktop-about.png'});
  await page.getByRole('link',{name:'HOME',exact:true}).click();await page.waitForTimeout(5000);
  assert(await page.evaluate(()=>scrollY) === 0,'Home did not return to top');
  assert(await page.locator('video').evaluate(el=>el.currentTime) < .1,'Video did not rewind');
  results.checks.push({name:'Home scroll and video rewind',passed:true});
  for (const label of ['SERVICES','CONTACT']) {
    await page.getByRole('link',{name:label,exact:true}).click();await page.waitForTimeout(3200);
    assert(await page.evaluate(()=>scrollY)>3900,`${label} anchor failed`);
  }
  results.checks.push({name:'Services and Contact navigate to supplied About content',passed:true});
  await page.close();
  page = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  page.on('pageerror',e => results.errors.push(e.message));
  page.on('requestfailed',req => results.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
  await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
  await page.waitForFunction(() => !document.querySelector('.loading-overlay'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  await page.screenshot({path:'/work/screenshots/mobile.png'});
  const mobile = await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,mainHeight:document.querySelector('main').offsetHeight,scrollY,heroOpacity:getComputedStyle(document.querySelector('.char')).opacity,headline:document.querySelector('h1').getBoundingClientRect().toJSON()}));
  assert(mobile.scrollWidth===390,'Mobile horizontal overflow');
  assert(mobile.heroOpacity==='1' && mobile.scrollY===0,'Mobile hero not visible at top');
  await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(350);
  assert(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded') === 'true','Menu did not open');
  await page.screenshot({path:'/work/screenshots/mobile-menu.png'});
  await page.keyboard.press('Escape');await page.waitForTimeout(350);
  assert(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded')==='false','Escape did not close menu');
  await page.getByRole('button',{name:'Open menu'}).click();await page.waitForTimeout(350);
  await page.locator('.mobile-menu-link').filter({hasText:'ABOUT'}).click();await page.waitForTimeout(5000);
  const mobileAbout = await page.evaluate(()=>({scrollY,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h2').getBoundingClientRect().toJSON(),panel:document.querySelector('.glass-panel').getBoundingClientRect().toJSON()}));
  assert(mobileAbout.scrollY>=3370,'Mobile About scroll failed');assert(mobileAbout.heading.top>=0 && mobileAbout.heading.bottom<844,'Mobile About text clipped');assert(mobileAbout.scrollWidth===390,'Mobile About overflow');
  await page.screenshot({path:'/work/screenshots/mobile-about.png'});
  results.checks.push({name:'mobile 390x844, menu toggle, Escape, About scroll, overflow',passed:true,details:{initial:mobile,about:mobileAbout}});
  assert(results.errors.length===0,'Browser script errors');
  fs.writeFileSync('/work/screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
