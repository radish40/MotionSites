const { chromium } = require('/app/node_modules/playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const base = '/motionsites-results/kova-features/';
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join('/work/dist', relative === '' ? 'index.html' : relative);
  if (!file.startsWith('/work/dist/') || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff'};
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {errors:[], failedRequests:[], responses:[], layouts:{}, interactions:{}};
  const page = await browser.newPage();
  page.on('pageerror', e=> report.errors.push(e.message));
  page.on('requestfailed', req=> report.failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
  page.on('response', r=>{if(r.status()>=400)report.responses.push({url:r.url(),status:r.status()})});
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024]]){
    await page.setViewportSize({width,height});
    await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle',timeout:60000});
    await page.evaluate(async()=>{await document.fonts.load('400 16px "Cooper BT W01 Light"');await document.fonts.load('500 36px "Cooper BT W01 Medium"');await document.fonts.ready;});
    await page.waitForTimeout(1300);
    const initialAnimation = await page.locator('section .grid > div').evaluateAll(els=>els.map(el=>({opacity:getComputedStyle(el).opacity,y:getComputedStyle(el).transform})));
    for(const el of await page.locator('section .grid > div').all()) {await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(1600);}
    const finalAnimation = await page.locator('section .grid > div').evaluateAll(els=>els.map(el=>({opacity:getComputedStyle(el).opacity,filter:getComputedStyle(el).filter})));
    assert(finalAnimation.every(el=>el.opacity==='1'),name+' animation did not settle');
    if(name==='mobile') await page.screenshot({path:'/work/screenshots/mobile-bottom.png',fullPage:false});
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(200);
    const layout = await page.evaluate(()=>({
      width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      columns:getComputedStyle(document.querySelector('section .grid')).gridTemplateColumns,
      cards:[...document.querySelectorAll('section .grid > div > div')].map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height}}),
      images:[...document.querySelectorAll('section img')].map(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0})),
      fonts:{light:document.fonts.check('400 16px "Cooper BT W01 Light"'),medium:document.fonts.check('500 36px "Cooper BT W01 Medium"')},
      headingFont:getComputedStyle(document.querySelector('h2')).fontFamily
    }));
    report.layouts[name]={...layout, initialAnimation, finalAnimation};
    assert.equal(layout.width,layout.scrollWidth, name+' overflows');
    assert(layout.images.every(i=>i.loaded),name+' images failed');
    assert(layout.cards.every(c=>Math.abs(c.width/c.height-.75)<.01),name+' card aspect ratio');
    assert(layout.fonts.light && layout.fonts.medium, 'Cooper fonts did not load');
    if(name!=='tablet') {
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:false});
      
    }
    await page.getByRole('button',{name:'Watch Demo'}).click();
    await assertDialog(page);
    for(let i=0;i<3;i++)await page.getByRole('button',{name:'Next feature'}).click();
    assert(await page.getByRole('button',{name:'Next feature'}).isDisabled());
    await page.getByRole('button',{name:'Previous feature'}).click();
    await page.keyboard.press('Escape');
    assert(!(await page.locator('dialog').isVisible()));
    await page.getByRole('button',{name:'Watch Demo'}).click();
    assert(await page.getByRole('button',{name:'Previous feature'}).isDisabled());
    await page.getByRole('button',{name:'Close demo'}).click();
    report.interactions[name]='Demo opens, advances through four features, goes back, closes with Escape and close button, and resets on reopen.';
  }
  assert.equal(report.errors.length,0,'Browser script errors');
  fs.writeFileSync('/work/screenshots/browser-report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
async function assertDialog(page){assert(await page.locator('dialog').isVisible());}
