const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = '/work/dist';
const prefix = '/motionsites-results/innovation-studio/';
const checks = [];
const errors = [];
const failedRequests = [];
const cancelledRequests = [];
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(prefix, '');
  const file = path.join(root, relative || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) {res.writeHead(404); return res.end();}
  const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css'};
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
function check(name, passed, details) {
  checks.push({name, passed, ...(details === undefined ? {} : {details})});
  if (!passed) throw new Error(name + ': ' + JSON.stringify(details));
}
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for (const [device, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height}, deviceScaleFactor:1});
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => {if(m.type()==='error') errors.push(m.text());});
      page.on('requestfailed', r => { const detail = {url:r.url(), error:r.failure()?.errorText}; (detail.error === 'net::ERR_ABORTED' ? cancelledRequests : failedRequests).push(detail); });
      await page.goto(`http://localhost:4173${prefix}`, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2, {timeout:30000});
      const assets = await page.evaluate(() => ({
        fontLoaded: document.fonts.check('300 20px Geist'),
        videoReady: document.querySelector('video').readyState,
        videoPlaying: !document.querySelector('video').paused,
        videoWidth: document.querySelector('video').videoWidth,
        overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
      }));
      check(`${device}: assets and layout`, assets.fontLoaded && assets.videoReady >= 2 && assets.videoPlaying && !assets.overflow, assets);
      await page.getByRole('button', {name:'Show slide 1: neural networks'}).click();
      await page.waitForTimeout(800);
      await page.screenshot({path:`/work/screenshots/${device}.png`});
      await page.getByRole('button', {name:'Show slide 3: generative tools'}).click();
      await page.waitForTimeout(800);
      check(`${device}: dot selects third slide`, await page.locator('#process').getAttribute('aria-hidden') === 'false');
      await page.waitForTimeout(3000);
      check(`${device}: dot resets timer`, await page.locator('#process').getAttribute('aria-hidden') === 'false');
      await page.waitForTimeout(1700);
      check(`${device}: automatic rotation`, await page.locator('#studios').getAttribute('aria-hidden') === 'false');
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(850);
      check(`${device}: menu opens and locks scrolling`, await page.getByRole('dialog').isVisible() && await page.evaluate(()=>document.body.style.overflow === 'hidden'));
      await page.screenshot({path:`/work/screenshots/${device}-menu.png`});
      await page.getByRole('dialog').getByRole('link', {name:'Labs',exact:true}).click();
      await page.waitForTimeout(800);
      check(`${device}: menu navigation`, await page.locator('#labs').getAttribute('aria-hidden') === 'false' && await page.locator('#studio-menu').getAttribute('aria-hidden') === 'true');
      check(`${device}: no scroll after navigation`, await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth && scrollY === 0));
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(600);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      check(`${device}: escape and focus restore`, await page.getByRole('button', {name:'Open menu'}).evaluate(el=>el===document.activeElement) && await page.evaluate(()=>document.body.style.overflow === ''));
      await page.getByRole('link',{name:'View Case Study—', exact:true}).click();
      await page.waitForTimeout(600);
      check(`${device}: CTA opens navigation`, await page.locator('#studio-menu').getAttribute('aria-hidden') === 'false');
      await page.getByRole('button',{name:'Close menu'}).click();
      await page.waitForTimeout(600);
      check(`${device}: close button`, await page.locator('#studio-menu').getAttribute('aria-hidden') === 'true');
      await page.getByRole('button', {name:'Open menu'}).click();
      await page.waitForTimeout(600);
      await page.locator('#studio-menu > div').first().click({position:{x:5,y:200}});
      await page.waitForTimeout(600);
      check(`${device}: backdrop closes menu`, await page.locator('#studio-menu').getAttribute('aria-hidden') === 'true');
      await page.close();
    }
    check('No browser script or console errors', errors.length===0, errors);
    check('No failed asset requests', failedRequests.length===0, failedRequests);
    fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify({checks, errors, failedRequests, cancelledRequests},null,2));
  } finally { await browser.close(); server.close(); }
})().catch(e=>{console.error(e);fs.writeFileSync('/work/screenshots/checks.json', JSON.stringify({checks,errors,failedRequests,failure:e.message},null,2));process.exitCode=1;server.close();});
