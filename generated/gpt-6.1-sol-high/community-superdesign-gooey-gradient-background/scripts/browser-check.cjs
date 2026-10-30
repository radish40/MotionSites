const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/community-superdesign-gooey-gradient-background/';
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf'};
const server = http.createServer((req,res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length) || 'index.html';
  const file = path.resolve('dist',relative);
  if (!req.url.startsWith(base) || !file.startsWith(path.resolve('dist') + '/') || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type',types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173,'0.0.0.0',resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const checks = [];
  const errors = [];
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile'});
      const page = await context.newPage();
      page.on('pageerror',error=>errors.push(error.message));
      page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
      page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
      await page.goto(`http://localhost:4173${base}`,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(1200);
      assert(await page.evaluate(()=>document.fonts.check('300 96px Dongle')));
      assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth && document.documentElement.scrollHeight===innerHeight));
      assert.equal(await page.locator('h1').textContent(),'Bubbles');
      await page.screenshot({path:`screenshots/${name}.png`});
      const before = await page.locator('.g2').evaluate(el=>getComputedStyle(el).transform);
      await page.waitForFunction(previous => getComputedStyle(document.querySelector('.g2')).transform !== previous, before, { timeout: 20000 });
      await page.getByRole('button',{name:'Get Started',exact:true}).click();
      assert.equal(await page.getByRole('status').textContent(),'Move, touch, explore. The colors follow you.');
      await page.getByRole('button',{name:'Learn More',exact:true}).click();
      assert(await page.locator('dialog').evaluate(el=>el.open));
      await page.keyboard.press('Escape');
      assert(!(await page.locator('dialog').evaluate(el=>el.open)));
      await page.getByRole('button',{name:'Learn More',exact:true}).click();
      await page.getByRole('button',{name:'Let’s explore'}).click();
      assert(!(await page.locator('dialog').evaluate(el=>el.open)));
      await page.waitForTimeout(300);
      if(name==='mobile') {
        await page.dispatchEvent('.hero','pointermove',{clientX:300,clientY:200,pointerType:'touch'});
      } else { await page.mouse.move(1100,250); }
      await page.waitForFunction(threshold => { const match = document.querySelector('.interactive').style.transform.match(/translate\((\d+)px/); return match && Number(match[1]) > threshold; }, name === 'mobile' ? 280 : 1000, { timeout: 20000 });
      const transform = await page.locator('.interactive').evaluate(el=>el.style.transform);
      const coords = transform.match(/translate\((\d+)px, (\d+)px\)/);
      assert(coords && Number(coords[1])>(name==='mobile'?280:1000));
      await page.emulateMedia({reducedMotion:'reduce'});
      assert.equal(await page.locator('.g1').evaluate(el=>getComputedStyle(el).animationName),'none');
      await page.locator('.actions button').first().focus();
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Learn More');
      assert.equal(await page.getByRole('button',{name:'Learn More',exact:true}).evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
      checks.push({viewport:name,width,height,fontLoaded:true,noOverflow:true,animation:true,pointerTracking:true,buttons:true,dialogEscape:true,keyboardFocus:true,reducedMotion:true});
      await context.close();
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify({checks,errors},null,2)+'\n');
    console.log(JSON.stringify({checks,errors},null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error=>{ console.error(error); process.exitCode=1; server.close(); });
