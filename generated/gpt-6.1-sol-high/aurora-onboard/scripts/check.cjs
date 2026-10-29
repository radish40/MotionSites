const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = '/motionsites-results/aurora-onboard/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(base)) { res.writeHead(404).end(); return; }
  const target = path.resolve(root, url.slice(base.length) || 'index.html');
  if (!target.startsWith(root + '/') && target !== root) { res.writeHead(403).end(); return; }
  fs.readFile(target, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' }); res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = { base, consoleErrors: [], pageErrors: [], failedRequests: [], httpErrors: [], checks: [] };
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      page.on('pageerror', error => report.pageErrors.push({viewport:name, message:error.message}));
      page.on('console', msg => { if(msg.type() === 'error') report.consoleErrors.push({viewport:name,message:msg.text()}); });
      page.on('requestfailed', req => report.failedRequests.push({viewport:name,url:req.url(),error:req.failure()?.errorText}));
      page.on('response', response => { if(response.status() >= 400) report.httpErrors.push({viewport:name,url:response.url(),status:response.status()}); });
      await page.goto('http://127.0.0.1:4173' + base, {waitUntil:'networkidle',timeout:60000});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      const media = await page.evaluate(() => {
        const v = document.querySelector('video');
        return {fontLoaded:document.fonts.check('400 14px Inter'),videoReadyState:v.readyState,videoError:v.error?.message || null,videoWidth:v.videoWidth,videoTime:v.currentTime,videoPaused:v.paused,overflow:document.documentElement.scrollWidth > innerWidth,heroVisible:getComputedStyle(v.parentElement).display !== 'none',heroWidth:v.parentElement.getBoundingClientRect().width,mainWidth:document.querySelector('main').clientWidth};
      });
      assert.equal(media.overflow,false);
      assert.equal(media.heroVisible,name === 'desktop');
      assert.equal(media.fontLoaded,true);
      assert.equal(media.videoError,null);
      assert.ok(media.videoReadyState >= 3);
      assert.ok(media.videoTime > 0);
      assert.equal(media.videoPaused,false);
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      await page.getByRole('button',{name:'Create Account',exact:true}).click();
      assert.equal(await page.locator('input:invalid').count(),4);
      await page.getByLabel('First Name',{exact:true}).fill('Alex');
      await page.getByLabel('Last Name',{exact:true}).fill('Morgan');
      await page.getByLabel('Email',{exact:true}).fill('alex@example.com');
      await page.getByLabel('Password',{exact:true}).fill('short');
      await page.getByRole('button',{name:'Create Account',exact:true}).click();
      assert.equal(await page.getByLabel('Password',{exact:true}).evaluate(el=>el.validity.tooShort),true);
      await page.getByLabel('Password',{exact:true}).fill('Aurora123!');
      await page.getByRole('button',{name:'Show password',exact:true}).click();
      assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'text');
      await page.getByRole('button',{name:'Hide password',exact:true}).click();
      assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'password');
      await page.getByRole('button',{name:'Create Account',exact:true}).click();
      await page.getByRole('status').filter({hasText:'Your profile details are ready'}).waitFor();
      await page.getByRole('button',{name:'Google',exact:true}).click();
      assert.match(await page.getByRole('status').innerText(),/Google sign up is unavailable/);
      await page.getByRole('button',{name:'Github',exact:true}).click();
      assert.match(await page.getByRole('status').innerText(),/Github sign up is unavailable/);
      await page.getByRole('button',{name:'Log in',exact:true}).click();
      assert.match(await page.getByRole('status').innerText(),/Log in is unavailable/);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth),false);
      report.checks.push({viewport:name,width,height,...media,validation:true,passwordToggle:true,submissionFeedback:true,socialFeedback:true,loginFeedback:true});
      await page.close();
    }
    assert.equal(report.pageErrors.length,0);
    assert.equal(report.consoleErrors.length,0);
    assert.equal(report.httpErrors.length,0);
    fs.writeFileSync('screenshots/checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close(); server.close(); }
})().catch(error=>{console.error(error); server.close(); process.exitCode=1;});
