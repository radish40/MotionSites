const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve('dist');
const prefix = '/motionsites-results/15';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.avif':'image/avif','.jpg':'image/jpeg','.ttf':'font/ttf','.json':'application/json'};
const server = http.createServer((req,res) => {
  let file = decodeURIComponent(req.url.split('?')[0]);
  if (!file.startsWith(prefix)) { res.writeHead(404); return res.end(); }
  file = path.join(root,file.slice(prefix.length));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(3000,'0.0.0.0',r));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],headless:true});
  const report = {url:`http://localhost:3000${prefix}/`, viewports:[], errors:[], failedRequests:[]};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({viewport:{width,height}, deviceScaleFactor:1});
      const page = await context.newPage();
      page.on('pageerror',e=>report.errors.push({viewport:name,error:e.message}));
      page.on('requestfailed',req=>report.failedRequests.push({viewport:name,url:req.url(),error:req.failure()?.errorText}));
      await page.goto(report.url,{waitUntil:'domcontentloaded'});
      await page.getByRole('status').waitFor();
      if (name==='desktop') { await page.waitForTimeout(600); await page.screenshot({path:'screenshots/loading.png'}); }
      await page.getByRole('status').waitFor({state:'detached',timeout:10000});
      await page.waitForTimeout(1600);
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('h1').innerText(),'Michael Smith');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
      const before = await page.locator('.role-word').innerText();
      await page.waitForTimeout(2100);
      const after = await page.locator('.role-word').innerText();
      assert.notEqual(before,after,'role cycles');
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      await page.getByRole('button',{name:'See Works',exact:true}).click();
      await page.getByRole('dialog').waitFor({state:'visible'});
      assert.equal(await page.locator('dialog h2').innerText(),'Selected work');
      await page.keyboard.press('Escape');
      assert(!(await page.getByRole('dialog').isVisible()));
      await page.getByRole('button',{name:'Resume',exact:true}).click();
      assert.equal(await page.locator('dialog h2').innerText(),'Michael Smith');
      await page.getByRole('button',{name:'Close',exact:true}).click();
      await page.getByRole('button',{name:'Work',exact:true}).click();
      assert(await page.getByRole('dialog').isVisible());
      await page.keyboard.press('Escape');
      assert((await page.getByRole('link',{name:'Say hi'}).getAttribute('href')).startsWith('mailto:'));
      assert((await page.getByRole('link',{name:'Reach out...',exact:true}).first().getAttribute('href')).startsWith('mailto:'));
      await page.getByRole('link',{name:'Home',exact:true}).click();
      await page.getByRole('button',{name:'See Works',exact:true}).hover();
      const video = await page.locator('video').evaluate(v=>({readyState:v.readyState,currentTime:v.currentTime,paused:v.paused,videoWidth:v.videoWidth,poster:v.poster}));
      const fonts = await page.evaluate(()=>({body:document.fonts.check('16px Inter'),display:document.fonts.check('italic 60px "Instrument Serif"')}));
      report.viewports.push({name,width,height,horizontalOverflow:false,roleCycles:true,dialogs:true,contactLinks:true,fonts,video});
      await context.close();
    }
    assert.equal(report.errors.length,0,'no runtime errors');
    fs.writeFileSync('screenshots/browser-report.json',JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
