const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/rocket-pricing/';
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(base)) { res.writeHead(404); return res.end('Outside project'); }
  const file = path.join('/work/dist', decodeURIComponent(url.pathname.slice(base.length)) || 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve=>server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = {viewports:[], interactions:[], errors:[], failedRequests:[]};
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
      const page = await context.newPage();
      page.on('pageerror', error=>report.errors.push(error.message));
      page.on('console', msg=>{if(msg.type()==='error') report.errors.push(msg.text()+' '+JSON.stringify(msg.location()));});
      page.on('requestfailed', req=>report.failedRequests.push(req.url()));
      page.on('response', res=>{if(res.status()>=400)report.failedRequests.push(res.url()+': '+res.status());});
      await page.goto('http://localhost:4173'+base,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1200);
      assert.equal(await page.title(),'Rocket Pricing');
      assert.equal(await page.locator('#pricing').count(),1);
      assert.equal(await page.locator('li').count(),10);
      assert.equal(await page.locator('.material-symbols-outlined').filter({hasText:'check'}).count(),8);
      assert.equal(await page.locator('.material-symbols-outlined').filter({hasText:'close'}).count(),2);
      const cards = page.locator('.spotlight');
      const boxes = await cards.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
      assert.equal(boxes.length,2);
      if(name==='desktop') assert.equal(boxes[0].y,boxes[1].y);
      else assert(boxes[1].y > boxes[0].y+boxes[0].height);
      const fonts = await page.evaluate(()=>({inter:document.fonts.check('14px Inter'),symbols:document.fonts.check('12px "Material Symbols Outlined"')}));
      assert(fonts.inter && fonts.symbols);
      // Scroll both cards into view to exercise the real viewport-triggered reveals.
      for(let i=0;i<2;i++) { await cards.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(1200); }
      const overflow = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
      assert(overflow.scroll<=overflow.viewport);
      await page.evaluate(()=>scrollTo(0,0));
      await page.waitForTimeout(300);
      if(name==='desktop') {
        const card=cards.first();
        await card.hover({position:{x:100,y:100}});
        const spot = await card.evaluate(el=>({x:el.style.getPropertyValue('--spot-x'),y:el.style.getPropertyValue('--spot-y')}));
        assert(Math.abs(parseFloat(spot.x)-100)<2 && Math.abs(parseFloat(spot.y)-100)<2);
        await page.mouse.move(0,0);
        assert.equal(await card.evaluate(el=>el.style.getPropertyValue('--spot-x')),'-9999px');
        const cta=page.getByRole('link',{name:'Get Started'}).first();
        await cta.hover(); await page.waitForTimeout(400);
        const transform=await cta.locator('.animated-text > span').first().evaluate(el=>getComputedStyle(el).transform);
        assert.notEqual(transform,'none');
        await page.mouse.move(0,0); await page.waitForTimeout(400);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Get StartedGet Started');
        await page.locator('body').click({position:{x:10,y:10}});
        report.interactions.push('Cursor-following spotlight coordinates and reset verified','Animated button hover transform verified','Keyboard tab reaches signup link');
      }
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      // Intercept only the external auth destination to verify navigation without inventing an auth page.
      await page.route('**/auth?mode=signup',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><head><link rel="icon" href="data:,"></head><body>Auth destination intercepted for link verification</body></html>'}));
      for(let i=0;i<2;i++) {
        if(i) {await page.goto('http://localhost:4173'+base);await page.waitForTimeout(1200);}
        const cta=page.getByRole('link',{name:'Get Started'}).nth(i);
        assert.equal(await cta.getAttribute('href'),'/auth?mode=signup');
        await cta.click(); await page.waitForURL('**/auth?mode=signup');
      }
      report.interactions.push(`${name}: both signup links navigate to /auth?mode=signup (intercepted)`);
      report.viewports.push({name,width,height,cards:boxes,fonts,horizontalOverflow:false,screenshot:`screenshots/${name}.png`});
      await context.close();
    }
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    assert.deepEqual(report.errors,[]); assert.deepEqual(report.failedRequests,[]);
    report.status='passed';
    fs.writeFileSync('/work/screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally {await browser.close();server.close();}
})().catch(err=>{console.error(err);server.close();process.exitCode=1;});
