const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/creative-studio/';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mp4':'video/mp4','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join(process.cwd(), 'dist', relative || 'index.html');
  if (!file.startsWith(path.join(process.cwd(), 'dist') + '/') || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const stat = fs.statSync(file);
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges':'bytes'};
  if (req.headers.range) {
    const [startString,endString] = req.headers.range.replace('bytes=','').split('-');
    const start = Number(startString), end = endString ? Number(endString) : stat.size-1;
    res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${stat.size}`, 'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
(async () => {
 await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report = {url: `http://localhost:4173${base}`, errors:[], failedRequests:[], viewports:[]};
 try {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
   const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
   page.on('pageerror', error => report.errors.push(error.message));
   page.on('console', message => {if(message.type()==='error') report.errors.push(message.text());});
   page.on('requestfailed', req => report.failedRequests.push({url:req.url(),error:req.failure()}));
   await page.goto(report.url,{waitUntil:'networkidle'});
   await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
   await page.evaluate(() => document.fonts.ready);
   await page.waitForTimeout(1600);
   const layout = await page.evaluate(() => ({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,font:document.fonts.check('600 14px Inter'),video:{readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused,time:document.querySelector('video').currentTime,width:document.querySelector('video').videoWidth,height:document.querySelector('video').videoHeight},heading:document.querySelector('h1').getBoundingClientRect().toJSON()}));
   assert.equal(layout.scrollWidth,width,'Horizontal overflow');
   assert.equal(layout.scrollHeight,height,'Vertical overflow');
   assert.equal(layout.font,true);
   assert.equal(layout.video.paused,false);
   await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('dialog').waitFor();
   await page.waitForTimeout(250);
   assert.equal(await page.getByRole('navigation',{name:'Menu navigation'}).getByRole('link').count(),4);
   await page.keyboard.press('Escape');
   await page.getByRole('dialog').waitFor({state:'detached'});
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('button',{name:'Close menu'}).click();
   await page.getByRole('dialog').waitFor({state:'detached'});
   await page.getByRole('button',{name:'Open menu'}).click();
   await page.getByRole('navigation',{name:'Menu navigation'}).getByRole('link',{name:'Expertise'}).click();
   await page.getByRole('dialog').waitFor({state:'detached'});
   assert.equal(new URL(page.url()).hash,'#expertise');
   assert.equal(await page.getByRole('link',{name:'Work With Us'}).getAttribute('href'),'mailto:');
   report.viewports.push({name,...layout,menu:'open, close, Escape, and navigation passed',cta:'mailto link verified'});
   await page.close();
  }
  report.responsive = [];
  for (const width of [320,360,640,768,820,1024]) {
   const page = await browser.newPage({viewport:{width,height:900}});
   await page.goto(report.url,{waitUntil:'networkidle'});
   await page.waitForTimeout(1400);
   const layout = await page.evaluate(() => {
    const heading = document.querySelector('h1').getBoundingClientRect();
    const description = document.querySelector('#studios').getBoundingClientRect();
    return {width:innerWidth, gap:heading.left-description.right, right:heading.right, scrollWidth:document.documentElement.scrollWidth,padding:parseFloat(getComputedStyle(document.querySelector('h1').parentElement.parentElement).paddingRight)};
   });
   report.responsive.push(layout);
   await page.close();
  }
  assert.ok(report.responsive.every(item => item.gap >= 10 && item.right <= item.width - item.padding + 0.5), 'Responsive heading overlaps description');
  assert.deepEqual(report.errors,[]);
  assert.deepEqual(report.failedRequests,[]);
  report.status='passed';
 } catch (error) {report.status='failed'; report.failure=error.stack; process.exitCode=1;}
 finally {fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2)+'\n'); console.log(JSON.stringify(report,null,2)); await browser.close(); server.close();}
})();
