const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve('dist');
const base = '/motionsites-results/neon-logic/';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server = http.createServer((req,res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0].replace(base,'')) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream'); fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = { desktop:{},mobile:{}, errors:[],failedRequests:[],responses:[] };
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
    page.on('pageerror',error => report.errors.push({viewport:name,message:error.message}));
    page.on('requestfailed',request => report.failedRequests.push({viewport:name,url:request.url(),error:request.failure()?.errorText}));
    page.on('response',r => { if(r.status()>=400) report.responses.push({status:r.status(),url:r.url()}); });
    await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(4000);
    report[name].initial = await page.evaluate(() => ({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('16px "Space Mono"'),watermarkFont:document.fonts.check('16px "Anton SC"'),appleIcon:getComputedStyle(document.querySelector('.bi-apple'),'::before').content,heroPaused:document.querySelector('video').paused,videos:Array.from(document.querySelectorAll('video')).map(v=>({src:v.currentSrc,readyState:v.readyState,error:v.error?.message || null,duration:v.duration}))}));
    await page.screenshot({path:`screenshots/${name}.png`});
    if (name==='desktop') {
      await page.mouse.move(100,200); await page.mouse.move(900,200,{steps:10}); await page.waitForTimeout(1200);
      report[name].scrubbedTime = await page.locator('video').first().evaluate(v=>v.currentTime);
      await page.mouse.move(300,200,{steps:10}); await page.waitForTimeout(1000);
      report[name].reverseScrubbedTime = await page.locator('video').first().evaluate(v=>v.currentTime);
      assert(report[name].scrubbedTime > report[name].reverseScrubbedTime, 'Reverse scrubbing');
      await page.screenshot({path:'screenshots/desktop-scrubbed.png'});
    }
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(600);
    report[name].menu = await page.evaluate(()=>({expanded:document.querySelector('[aria-controls="nav-links"]').getAttribute('aria-expanded'),overflow:document.documentElement.scrollWidth>innerWidth,navRight:document.querySelector('nav').getBoundingClientRect().right,buttons:Array.from(document.querySelectorAll('nav button')).map(x=>({right:x.getBoundingClientRect().right,left:x.getBoundingClientRect().left}))}));
    await page.screenshot({path:`screenshots/${name}-menu.png`});
    await page.getByRole('link',{name:'About',exact:true}).click();
    await page.waitForTimeout(1800);
    report[name].aboutNavigation = await page.evaluate(()=>({scrollY,expected:innerHeight}));
    assert(Math.abs(report[name].aboutNavigation.scrollY-height)<2,'About navigation');
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(600);
    await page.getByRole('link',{name:'Metrics',exact:true}).click();
    await page.waitForTimeout(1800);
    report[name].metricsNavigation = await page.evaluate(()=>({scrollY,expected:innerHeight*2,menuClosed:document.querySelector('[aria-controls="nav-links"]').getAttribute('aria-expanded')==='false'}));
    await page.screenshot({path:`screenshots/${name}-metrics.png`});
    await page.getByRole('button',{name:'Download',exact:true}).click();
    report[name].downloadDialog = await page.getByRole('dialog').isVisible();
    await page.getByRole('button',{name:'Close',exact:true}).click();
    const sections=await page.locator('main > section').count();
    report[name].sections=[];
    for(let i=1;i<sections;i++) {
      await page.locator('main > section').nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1600);
      report[name].sections.push(await page.evaluate(()=>({scrollY,overflow:document.documentElement.scrollWidth>innerWidth})));
      if(name==='desktop') await page.screenshot({path:`screenshots/desktop-section-${i+1}.png`});
    }
    await page.locator('footer').scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
    if(name==='desktop') await page.screenshot({path:'screenshots/desktop-footer.png'});
    assert(!report[name].initial.overflow && !report[name].menu.overflow, 'No overflow');
    assert(report[name].initial.heroPaused,'Hero paused');
    assert(report[name].initial.videos.every(v=>v.readyState>=2 && !v.error),'Videos loaded');
    assert(report[name].initial.font && report[name].initial.watermarkFont,'Fonts loaded');
    assert(report[name].downloadDialog,'Download interaction');
    assert(Math.abs(report[name].metricsNavigation.scrollY-height*2)<2,'Metrics navigation');
    await page.close();
  }
  assert(report.errors.length===0,'No page errors');
  assert(report.responses.length===0,'No HTTP errors');
  report.passed=true;
  fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:report.passed,errors:report.errors,responses:report.responses,desktop:report.desktop,mobile:report.mobile},null,2));
  await browser.close(); server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1)});
