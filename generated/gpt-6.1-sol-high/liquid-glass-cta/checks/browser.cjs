const { chromium } = require('/app/node_modules/playwright-core');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const base = '/motionsites-results/liquid-glass-cta/';
const root = path.resolve('dist');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(base, '');
  const file = path.join(root, relative || 'index.html');
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(4173, '0.0.0.0', resolve));
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const results = { url: `http://localhost:4173${base}`, viewports: [], errors: [], failedRequests: [], badResponses: [] };
  for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    const page = await browser.newPage({viewport, deviceScaleFactor:1});
    page.on('pageerror', e => results.errors.push(e.message));
    page.on('requestfailed', r => results.failedRequests.push({url:r.url(),failure:r.failure()}));
    page.on('response', r => { if(r.status() >= 400) results.badResponses.push({url:r.url(),status:r.status()}); });
    await page.goto(results.url, {waitUntil:'networkidle',timeout:60000});
    await page.evaluate(() => document.fonts.ready);
    let videoReady = true;
    try { await page.waitForFunction(() => { const v=document.querySelector('video'); return v.readyState >= 2 && v.currentTime > 0; }, {timeout:30000}); } catch { videoReady=false; }
    const state = await page.evaluate(() => {
      const v=document.querySelector('video');
      const footer=document.querySelector('.border-t');
      return {
        title: document.title,
        heading: document.querySelector('h2').textContent.trim(),
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        fontHeading: document.fonts.check('italic 72px "Instrument Serif"'),
        fontBody: document.fonts.check('300 16px "Barlow"'),
        headingSize: getComputedStyle(document.querySelector('h2')).fontSize,
        footerDirection: getComputedStyle(footer).flexDirection,
        video: {readyState:v.readyState,currentTime:v.currentTime,width:v.videoWidth,height:v.videoHeight,paused:v.paused,muted:v.muted,loop:v.loop,autoplay:v.autoplay,playsInline:v.playsInline},
        buttons: Array.from(document.querySelectorAll('button')).map(b=>({text:b.textContent.trim(),width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height})),
        links: Array.from(document.querySelectorAll('a')).map(a=>({text:a.textContent,href:a.getAttribute('href')}))
      };
    });
    const primary = page.getByRole('button',{name:'Book a Call'});
    await primary.hover();
    await page.waitForTimeout(200);
    const hoverBackground = await primary.evaluate(e=>getComputedStyle(e).backgroundColor);
    await primary.click();
    await page.getByRole('button',{name:'View Pricing'}).click();
    for(const link of ['Privacy','Terms','Contact']) await page.getByRole('link',{name:link,exact:true}).click();
    await page.evaluate(()=>{ window.scrollTo(0,0); if(document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
    await page.mouse.move(0,0);
    await page.waitForTimeout(200);
    await page.screenshot({path:`screenshots/${viewport.width===1440?'desktop':'mobile'}.png`,fullPage:true});
    await page.keyboard.press('Tab');
    const keyboardFocus = await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent.trim(),outline:getComputedStyle(document.activeElement).outlineStyle}));
    results.viewports.push({viewport,videoReady,...state,interactions:{buttonClicks:'passed; source buttons have no configured destinations',footerClicks:'passed; source links retain # destinations',hoverBackground,keyboardFocus}});
    await page.close();
  }
  fs.writeFileSync('checks/browser-results.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify(results,null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
})().catch(e=>{console.error(e);server.close();process.exit(1)});
