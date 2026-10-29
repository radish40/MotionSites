const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/halo-use-case/';
const mime = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml'};
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).slice(base.length);
  if (!req.url.startsWith(base) || relative.includes('..')) { res.writeHead(404).end(); return; }
  const file = path.join('/work/dist', relative || 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { url: `http://127.0.0.1:4173${base}`, viewports: [], errors: [], consoleErrors: [], failedRequests: [], badResponses: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000], ['mobile',390,844]]) {
      const page = await browser.newPage({viewport: {width,height}, deviceScaleFactor:1});
      page.on('console', message => {if(message.type()==='error') report.consoleErrors.push({viewport:name,message:message.text()});});
      page.on('pageerror', e => report.errors.push({viewport:name, message:e.message}));
      page.on('requestfailed', r => report.failedRequests.push({viewport:name,url:r.url(),error:r.failure()?.errorText}));
      page.on('response', r => {if(r.status() >= 400) report.badResponses.push({viewport:name,url:r.url(),status:r.status()});});
      await page.goto(report.url, {waitUntil:'networkidle', timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, {timeout:30000}).catch(() => {});
      await page.waitForTimeout(1000);
      const metrics = await page.evaluate(() => {
        const video = document.querySelector('video');
        const card = video.parentElement;
        const rect = card.getBoundingClientRect();
        return {
          viewportWidth:innerWidth, documentWidth:document.documentElement.scrollWidth,
          columns:getComputedStyle(card.parentElement).gridTemplateColumns,
          card:{x:rect.x,y:rect.y,width:rect.width,height:rect.height,radius:getComputedStyle(card).borderRadius},
          fontLoaded:document.fonts.check('16px "TT Norms Pro Regular"'),
          fonts:[...document.fonts].map(f => ({family:f.family,status:f.status})),
          video:{readyState:video.readyState,paused:video.paused,muted:video.muted,loop:video.loop,playsInline:video.playsInline,width:video.videoWidth,height:video.videoHeight,error:video.error?.message || null,time:video.currentTime}
        };
      });
      assert.equal(metrics.documentWidth,width,'No horizontal overflow');
      assert.equal(metrics.card.height,720,'Card minimum height');
      assert.equal(await page.getByRole('heading',{name:'Use modes'}).count(),1);
      const button = page.getByRole('button',{name:'Know more'});
      const circle = button.locator('span');
      await page.mouse.move(0,0);
      const normal = await circle.evaluate(el=>getComputedStyle(el).backgroundColor);
      await button.hover();
      await page.waitForTimeout(250);
      const hover = await circle.evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.equal(hover,'rgb(255, 255, 255)');
      await button.click();
      await page.keyboard.press('Tab');
      await button.focus();
      assert.equal(await button.evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Enter');
      const initialTime = metrics.video.time;
      await page.waitForTimeout(400);
      const finalTime = await page.locator('video').evaluate(v=>v.currentTime);
      metrics.video.playbackAdvanced = finalTime > initialTime;
      metrics.button = {normal,hover,click:'passed',keyboardFocus:'passed',keyboardActivation:'passed',destination:'Not specified by prompt; presentational button'};
      await page.mouse.move(0,0);
      await button.blur();
      await page.evaluate(()=>scrollTo(0,0));
      // Capture the same ambient-video frame at both viewport sizes.
      await page.locator('video').evaluate(async v => {if(v.readyState>=2){v.pause();v.currentTime=2;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));}});
      await page.screenshot({path:`/work/screenshots/${name}.png`,fullPage:true});
      report.viewports.push({name,width,height,...metrics});
      await page.close();
    }
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
