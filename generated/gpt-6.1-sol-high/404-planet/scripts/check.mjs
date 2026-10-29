import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/app/node_modules/playwright-core');
const server = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--host', '0.0.0.0', '--port', '4173'], { stdio: 'ignore' });
const base = 'http://127.0.0.1:4173/motionsites-results/404-planet/';
let browser;
const report = { errors: [], failedRequests: [], responses: [], checks: [] };
try {
  for (let i=0;i<50;i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  if (process.env.CREATE_POSTER) {
    await page.goto(base);
    const poster = await page.evaluate(async () => {
      const video = document.createElement('video');
      video.src = `${location.pathname}assets/earth.mp4`; video.muted = true; video.preload = 'auto';
      await new Promise((resolve,reject)=>{ video.onloadedmetadata=resolve;video.onerror=reject; });
      video.currentTime = 3;
      await new Promise(resolve=>video.onseeked=resolve);
      const canvas=document.createElement('canvas'); canvas.width=video.videoWidth; canvas.height=video.videoHeight;
      canvas.getContext('2d').drawImage(video,0,0);
      return canvas.toDataURL('image/jpeg',0.9).split(',')[1];
    });
    await writeFile('public/assets/earth-poster.jpg', Buffer.from(poster,'base64'));
    console.log('Generated poster from supplied video.');
  } else {
    page.on('pageerror', error=>report.errors.push(error.message));
    page.on('console', message=>{ if(message.type()==='error') report.errors.push(message.text()); });
    page.on('requestfailed', request=>report.failedRequests.push({url:request.url(), error:request.failure()?.errorText}));
    page.on('response', response=>{ if (response.status()>=400) report.responses.push({url:response.url(),status:response.status()}); });
    await page.goto(base, {waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>document.querySelector('video').readyState>=2, {timeout:30000});
    await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.paused && v.currentTime>0;});
    report.checks.push({name:'muted background video autoplays',passed:true});
    await page.evaluate(()=>{ const v=document.querySelector('video'); v.pause(); v.currentTime=3; });
    await page.waitForTimeout(500);
    report.fontLoaded=await page.evaluate(()=>document.fonts.check('16px "Helvetica Now Var"'));
    report.video=await page.locator('video').evaluate(v=>({readyState:v.readyState,width:v.videoWidth,height:v.videoHeight,source:v.currentSrc}));
    assert(report.video.width>0);
    const measure=async label=>{
      const value=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}));
      assert(value.scrollWidth<=value.width, `${label} horizontal overflow`);
      report.checks.push({name:label,...value});return value;
    };
    const desktop=await measure('desktop 1440x1000');
    assert.equal(desktop.scrollHeight,1000,'Desktop fills one viewport');
    assert(await page.getByRole('navigation',{name:'Main navigation',exact:true}).isVisible());
    assert.equal(await page.getByRole('link',{name:'Return to Main Page'}).getAttribute('href'),'/');
    await page.screenshot({path:'screenshots/desktop.png',fullPage:true});
    await page.getByRole('button',{name:'SEND IT'}).click();
    assert.equal(await page.locator('#newsletter-email').evaluate(el=>el.validity.valueMissing),true);
    await page.locator('#newsletter-email').fill('hello@example.com');
    await page.getByRole('button',{name:'SEND IT'}).click();
    await page.getByRole('status').filter({hasText:'Newsletter signup is currently unavailable'}).waitFor();
    report.checks.push({name:'newsletter native validation and unavailable-service status',passed:true});
    await page.reload({waitUntil:'networkidle'});
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>{const v=document.querySelector('video');v.pause();v.currentTime=3;});
    await page.waitForTimeout(400);
    await measure('mobile 390x844');
    assert(await page.getByRole('button',{name:'Open menu'}).isVisible());
    await page.screenshot({path:'screenshots/mobile.png',fullPage:false});
    await page.screenshot({path:'screenshots/mobile-full.png',fullPage:true});
    const toggle=page.getByRole('button',{name:'Open menu'});
    await toggle.click();
    await page.waitForTimeout(1100);
    assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
    assert(await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Privacy',exact:true}).isVisible());
    await page.screenshot({path:'screenshots/mobile-menu.png',fullPage:true});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#mobile-menu').count(),0);
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(1100);
    await page.mouse.click(10,570);
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#mobile-menu').count(),0);
    await page.getByRole('button',{name:'Open menu'}).click();
    await page.waitForTimeout(1100);
    await page.getByRole('button',{name:'Close menu'}).click();
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#mobile-menu').count(),0);
    report.checks.push({name:'mobile staggered menu opens and closes by toggle, Escape, backdrop',passed:true});
    for (const width of [320,640,768,1024]) { await page.setViewportSize({width,height:1000}); await measure(`responsive ${width}px`); }
    await writeFile('screenshots/browser-checks.json',JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
    assert.equal(report.errors.length,0,'No browser errors');
    assert.equal(report.responses.length,0,'No HTTP errors');
    assert.equal(report.failedRequests.length,0,'No failed requests');
  }
} finally { await browser?.close(); server.kill(); }
