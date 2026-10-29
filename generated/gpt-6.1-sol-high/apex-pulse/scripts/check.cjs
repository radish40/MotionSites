const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/app/node_modules/playwright-core');
const base = '/motionsites-results/apex-pulse/';
const root = path.resolve('dist');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp4':'video/mp4','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0].replace(base, '')) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  const stat = fs.statSync(file);
  const range = req.headers.range;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes'};
  if (range) {
    const [startText,endText] = range.replace('bytes=','').split('-');
    const start = Number(startText), end = endText ? Number(endText) : stat.size - 1;
    res.writeHead(206,{...headers, 'Content-Range':`bytes ${start}-${end}/${stat.size}`, 'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers, 'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
function assert(value, message) { if (!value) throw new Error(message); }
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {viewports:[], errors:[], failedRequests:[], checks:[]};
  try {
    const context = await browser.newContext({viewport:{width:1440,height:1000}, deviceScaleFactor:1});
    const page = await context.newPage();
    page.on('pageerror',error => report.errors.push(error.message));
    page.on('requestfailed',request => report.failedRequests.push({url:request.url(), reason:request.failure()?.errorText}));
    await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await page.waitForFunction(() => document.querySelector('[data-frames-ready]')?.getAttribute('data-frames-ready') === 'true', undefined, {timeout:180000});
    await page.waitForTimeout(1500);
    assert(await page.title() === 'AETHER_X — Where Sky Meets Machine Logic','Page title');
    assert(await page.locator('video').count() === 0,'Video handoff');
    assert(await page.locator('canvas').isVisible(),'Canvas visible');
    const firstFrame = await page.locator('canvas').evaluate(c => c.toDataURL().slice(-1000));
    await page.screenshot({path:'screenshots/desktop.png'});
    report.checks.push('120-frame extraction and visible canvas handoff');
    for (const viewport of [{width:1440,height:1000},{width:390,height:844},{width:640,height:900},{width:768,height:1000}]) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.waitForTimeout(1200);
      const layout = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight}));
      assert(layout.scrollWidth <= viewport.width,`Overflow at ${viewport.width}`);
      report.viewports.push({...viewport,...layout,overflow:false});
      if(viewport.width === 390) await page.screenshot({path:'screenshots/mobile.png'});
      await page.getByRole('link',{name:/Join The Fleet/}).click();
      await page.waitForTimeout(2000);
      assert(await page.locator('#precision').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 5),'Fleet navigation');
      if (viewport.width === 1440) {
        const lastFrame = await page.locator('canvas').evaluate(c => c.toDataURL().slice(-1000));
        assert(firstFrame !== lastFrame,'Scroll changes video frame');
        await page.screenshot({path:'screenshots/desktop-precision.png'});
      }
      if(viewport.width === 390) await page.screenshot({path:'screenshots/mobile-precision.png'});
      await page.getByRole('button',{name:/Full Details/}).click();
      assert(await page.locator('dialog').isVisible(),'Details opens');
      await page.keyboard.press('Escape');
      assert(!await page.locator('dialog').isVisible(),'Details closes with Escape');
      await page.getByRole('button',{name:/Full Details/}).click();
      await page.getByRole('button',{name:'Close details'}).click();
      assert(!await page.locator('dialog').isVisible(),'Details close control');
      assert((await page.getByRole('link',{name:'Schedule a Call'}).getAttribute('href')).startsWith('mailto:?subject='),'Call email draft');
      await page.getByRole('link',{name:'AETHER_X home'}).click();
      await page.waitForTimeout(1500);
      assert(await page.evaluate(() => scrollY) < 5,'Home link');
    }
    report.checks.push('1440x1000 and 390x844 screenshots; 640px and 768px layouts; no horizontal overflow','Fleet and home navigation','Details dialog opens, Escape dismisses, close control works','Schedule a Call uses native mail draft (recipient not supplied)','Scroll progress changes rendered frame');
    await context.close();
    const fallbackContext = await browser.newContext({viewport:{width:390,height:844}});
    const fallback = await fallbackContext.newPage();
    fallback.on('pageerror',error => report.errors.push(error.message));
    await fallback.route('**/assets/aether-flight.mp4',route => route.request().resourceType() === 'fetch' ? route.abort() : route.continue());
    await fallback.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
    await fallback.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
    assert(await fallback.locator('video').isVisible(),'Video fallback remains visible');
    await fallback.evaluate(() => window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    await fallback.waitForTimeout(2500);
    const fallbackTime = await fallback.locator('video').evaluate(v => v.currentTime);
    assert(fallbackTime > 1,'Fallback seeks on scroll');
    report.checks.push(`Forced frame-extraction failure: video stays visible and seeks to ${fallbackTime.toFixed(2)}s`);
    await fallbackContext.close();
    assert(report.errors.length === 0,'No JavaScript errors');
    report.status='passed';
  } catch(error) { report.status='failed'; report.failure=error.stack; process.exitCode=1; }
  finally { fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2)); console.log(JSON.stringify(report,null,2)); await browser.close(); server.close(); }
})();
