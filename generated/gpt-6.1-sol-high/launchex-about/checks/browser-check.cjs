const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/launchex-about/';
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.ttf':'font/ttf' };
const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) { res.writeHead(404); res.end(); return; }
  const file = path.join(process.cwd(), 'dist', pathname.slice(base.length) || 'index.html');
  fs.readFile(file, (err,data) => {
    res.writeHead(err ? 404 : 200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(err ? 'Not found' : data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox','--disable-dev-shm-usage']});
  const report = { url: `http://127.0.0.1:4173${base}`, viewports: [], errors: [], failedRequests: [], interactions: {} };
  try {
    for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024],['small-desktop',1024,900]]) {
      const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
      page.on('pageerror',err=>report.errors.push(err.message));
      page.on('console',msg=>{if(msg.type()==='error') report.errors.push(msg.text());});
      page.on('requestfailed',req=>report.failedRequests.push(req.url()));
      page.on('response',res=>{if(res.status()>=400) report.errors.push(`${res.status()} ${res.url()}`);});
      await page.goto(report.url, {waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const info = await page.evaluate(async () => {
        const section = document.querySelector('#about');
        const grid = section.querySelector('.grid');
        const cards = [...grid.children];
        const assets = await Promise.all(cards.map(async card=>{
          const image = card.firstElementChild;
          const src = getComputedStyle(image).backgroundImage.slice(5,-2);
          return await new Promise(resolve=>{const i=new Image(); i.onload=()=>resolve({src,loaded:true,width:i.naturalWidth}); i.onerror=()=>resolve({src,loaded:false}); i.src=src;});
        }));
        return {
          viewport: innerWidth, documentWidth:document.documentElement.scrollWidth,
          sectionHeight: section.getBoundingClientRect().height,
          background:getComputedStyle(section).backgroundColor,
          columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          cards:cards.map(c=>({x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,height:c.getBoundingClientRect().height,clipPath:getComputedStyle(c).clipPath})),
          assets, interLoaded:document.fonts.check('400 18px Inter') && document.fonts.check('600 54px Inter'),
        };
      });
      assert.equal(info.documentWidth,width,'horizontal overflow');
      assert.ok(info.sectionHeight>=height);
      assert.equal(info.columns,width>=1024?3:width>=768?2:1);
      assert.ok(info.assets.every(a=>a.loaded&&a.width===1280));
      assert.ok(info.interLoaded);
      assert.equal(await page.locator('section').count(),1);
      assert.equal(await page.locator('h2').innerText(),'ABOUT\nTHE FOUNDERS');
      if(width>=1024) assert.equal(info.cards[1].y-info.cards[0].y,96);
      const link=page.getByRole('link',{name:'Launchex.Hub website'});
      assert.equal(await link.getAttribute('href'),'https://base.launchex.vc/');
      assert.equal(await link.getAttribute('target'),'_blank');
      assert.equal(await link.getAttribute('rel'),'noreferrer');
      if(name==='desktop') {
        await link.focus();
        assert.ok(await link.evaluate(el=>el.matches(':focus-visible')));
        await link.hover();
        await page.waitForTimeout(250);
        const transform=await link.locator('span').evaluate(el=>getComputedStyle(el).transform);
        assert.equal(transform,'matrix(1, 0, 0, 1, 0, -2)');
        report.interactions.hoverTransform=transform;
        await page.route('https://base.launchex.vc/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>External link destination</title>'}));
        // Route on the context also covers the popup's first request.
        await page.context().route('https://base.launchex.vc/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>External link destination</title>'}));
        const popupPromise=page.waitForEvent('popup');
        await link.click();
        const popup=await popupPromise;
        await popup.waitForLoadState();
        assert.equal(popup.url(),'https://base.launchex.vc/');
        await popup.close();
        report.interactions.externalLink='New tab opened at exact destination (network response intercepted)';
        report.interactions.keyboardFocus=true;
        await link.evaluate(el=>el.blur());
        await page.mouse.move(0,0);
        await page.waitForTimeout(250);
      }
      if(name==='desktop'||name==='mobile') await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      report.viewports.push({name,width,height,...info});
      await page.close();
    }
    assert.deepEqual(report.errors,[]);
    assert.deepEqual(report.failedRequests,[]);
    report.status='passed';
    fs.writeFileSync('checks/browser-report.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(err=>{ console.error(err); process.exitCode=1; server.close(); });
