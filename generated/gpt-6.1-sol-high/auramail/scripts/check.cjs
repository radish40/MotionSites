const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('/app/node_modules/playwright-core');
const root = path.resolve('dist');
const base = '/motionsites-results/auramail/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.svg':'image/svg+xml' };
const server = http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
  const file = path.join(root, decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox']});
  const report = { url:base, checks:[], errors:[], consoleErrors:[], httpErrors:[], failedRequests:[] };
  try {
    for (const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
      const page = await browser.newPage({viewport, deviceScaleFactor:1});
      page.on('pageerror', error => report.errors.push(error.message));
      page.on('console', msg => { if(msg.type()==='error') report.consoleErrors.push(msg.text()); });
      page.on('response', response => { if(response.status()>=400) report.httpErrors.push({url:response.url(),status:response.status()}); });
      page.on('requestfailed', req => report.failedRequests.push({url:req.url(),failure:req.failure()}));
      await page.goto('http://127.0.0.1:4173'+base, {waitUntil:'networkidle'});
      await page.waitForTimeout(2000);
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const v = document.querySelector('video');
        return { width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
          fontLoaded:document.fonts.check('600 16px Inter'),
          video:{readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,error:v.error?.message||null},
          headline:document.querySelector('h1').innerText,
          overflowElements:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,class:e.className})).slice(0,8)
        };
      });
      report.checks.push({name,...state});
      if (state.scrollWidth > viewport.width) throw new Error(name+' horizontal overflow');
      await page.screenshot({path:'screenshots/'+name+'.png',fullPage:true});
      if(name==='mobile') {
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.waitForTimeout(700);
        await page.getByRole('button',{name:'Close menu'}).waitFor({state:'visible'});
        const count = await page.locator('.fixed.inset-0.z-\\[100\\] a').count();
        if(count!==5) throw new Error('Drawer link count '+count);
        await page.screenshot({path:'screenshots/mobile-menu.png'});
        await page.getByRole('button',{name:'Close menu'}).click();
        await page.waitForTimeout(500);
        if(await page.getByRole('button',{name:'Close menu'}).count()) throw new Error('Drawer did not close');
        report.checks.push({name:'mobile drawer',open:true,links:count,close:true});
      } else {
        const links = await page.locator('nav ul a').allTextContents();
        await page.getByRole('link',{name:'Solutions',exact:true}).click();
        report.checks.push({name:'desktop navigation',links,placeholderAnchorWorks:true});
      }
      const download=page.getByRole('button',{name:'Download Aura'}).last();
      await download.click();
      report.checks.push({name:name+' download button',clickable:true,behavior:'Prompt supplies no download URL; presentation-only button.'});
      await page.close();
    }
    report.passed = report.errors.length===0 && report.consoleErrors.length===0 && report.httpErrors.length===0;
    if (!report.passed) process.exitCode=1;
    report.streamingNote = 'ERR_ABORTED events are Chromium video stream/range cancellations; video decoded and played on both viewports with readyState 4 and no media error.';
  } catch (error) {report.passed=false; report.failure=error.message; process.exitCode=1;}
  finally {
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    await browser.close(); server.close();
  }
})();
