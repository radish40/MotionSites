const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/ai-workflow/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.mp4':'video/mp4', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  const file = path.resolve('dist', relative || 'index.html');
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + '/')) { res.writeHead(404).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) {res.writeHead(404).end(); return;}
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {url:base, viewports:{}, errors:[], assetResponses:[], failedRequests:[]};
  try {
    for (const [name, viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
      const page = await browser.newPage({viewport, deviceScaleFactor:1});
      page.on('pageerror', e => report.errors.push({viewport:name,message:e.message}));
      page.on('requestfailed', r => report.failedRequests.push({viewport:name,url:r.url(),error:r.failure()?.errorText}));
      page.on('response', r => { if (!r.url().startsWith('http://localhost')) report.assetResponses.push({viewport:name,url:r.url(),status:r.status()}); });
      await page.goto('http://localhost:4173'+base, {waitUntil:'networkidle', timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2, {timeout:45000}).catch(()=>{});
      const video = await page.locator('video').evaluate(v => ({width:v.videoWidth,height:v.videoHeight,duration:v.duration,readyState:v.readyState,error:v.error?.message || null}));
      console.log(name, 'video metadata:', JSON.stringify(video));
      await page.waitForFunction(() => getComputedStyle(document.querySelector('canvas')).display === 'block', {timeout:45000}).catch(()=>{});
      await page.waitForTimeout(300);
      const layout = await page.evaluate(() => ({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,canvasVisible:getComputedStyle(document.querySelector('canvas')).display === 'block',canvasWidth:document.querySelector('canvas').width,canvasHeight:document.querySelector('canvas').height,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status}))}));
      assert.equal(layout.scrollWidth, viewport.width, 'No horizontal overflow');
      assert.equal(layout.scrollHeight, viewport.height, 'Hero fits viewport');
      await page.screenshot({path:`screenshots/${name}.png`, fullPage:true});
      const checks = ['Correct heading visible','No horizontal or vertical overflow','Screenshot saved'];
      assert(await page.getByRole('heading',{name:'Close the rift linking signals and action'}).isVisible());
      if (name === 'mobile') {
        const toggle = page.getByRole('button',{name:'Open menu'});
        await toggle.click();
        await page.waitForTimeout(650);
        assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
        assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
        await page.getByRole('link',{name:'The Process',exact:true}).last().click();
        await page.waitForTimeout(600);
        assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
        assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
        assert(page.url().endsWith('#how'));
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.waitForTimeout(650);
        await page.mouse.click(15,450);
        await page.waitForTimeout(600);
        assert.equal(await page.getByRole('button',{name:'Open menu'}).getAttribute('aria-expanded'),'false');
        await page.getByRole('button',{name:'Open menu'}).click();
        await page.getByRole('button',{name:'Close menu'}).click();
        checks.push('Menu opens and closes with icon toggle','Drawer link closes menu and sets #how','Backdrop closes menu','Body scroll lock resets');
      } else {
        await page.getByRole('link',{name:'Purpose',exact:true}).first().click();
        assert(page.url().endsWith('#mission'));
        await page.getByRole('link',{name:'Sign Me Up!',exact:true}).first().click();
        assert(page.url().endsWith('#signup'));
        await page.getByRole('link',{name:'Enter',exact:true}).first().click();
        assert(page.url().endsWith('#login'));
        await page.getByRole('button',{name:'Try it Live',exact:true}).first().hover();
        await page.waitForTimeout(200);
        assert.equal(await page.getByRole('button',{name:'Try it Live',exact:true}).first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(42, 56, 39)');
        checks.push('Desktop navigation and account hash links work','Button hover color matches prompt');
      }
      report.viewports[name]={viewport,video,layout,checks};
      console.log(name, 'checks passed');
      await page.close();
    }
    assert.equal(report.errors.length,0,'No runtime errors');
  } finally {
    fs.writeFileSync('screenshots/browser-report.json', JSON.stringify(report,null,2)+'\n');
    await browser.close();
    server.close();
  }
})().catch(error => {console.error(error);server.close();process.exitCode=1;});
