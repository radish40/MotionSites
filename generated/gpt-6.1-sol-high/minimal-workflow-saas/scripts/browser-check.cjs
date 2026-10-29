const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], {stdio:'ignore'});
const delay = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let browser;
  try {
    await delay(1500);
    browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
    const reports = [];
    for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
      const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      const errors=[], failed=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
      page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
      await page.goto('http://127.0.0.1:4173/motionsites-results/minimal-workflow-saas/', {waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(2100);
      assert.equal(await page.title(),'Script — Minimal Workflow SaaS');
      const layout = await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight}));
      assert.ok(layout.scrollWidth<=width, 'No horizontal overflow');
      const video = await page.locator('video').evaluate(v=>({readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,videoWidth:v.videoWidth,videoHeight:v.videoHeight,muted:v.muted,loop:v.loop}));
      assert.ok(video.readyState>=3 && !video.paused && video.currentTime>0,'Video plays');
      assert.ok(await page.evaluate(()=>document.fonts.check('400 13px Inter') && document.fonts.check('700 21px Inter')));
      assert.equal(await page.getByRole('link',{name:'Resources',exact:true}).isVisible(),name==='desktop');
      await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
      const register=page.getByRole('button',{name:'Register Now!'});
      await register.hover();
      await register.click();
      await page.getByRole('button',{name:'Join us',exact:true}).click();
      await page.getByRole('link',{name:'Script home'}).focus();
      assert.ok(await page.getByRole('link',{name:'Script home'}).evaluate(e=>e===document.activeElement));
      if(name==='desktop') {
        const first=await page.locator('[data-active="true"]').innerText();
        await page.waitForTimeout(4700);
        const next=await page.locator('[data-active="true"]').innerText();
        assert.notEqual(first,next,'Queue advances');
        // Let the actual 4.5 second timer complete a full cycle and silent reset.
        await page.waitForTimeout(35500);
        const afterReset=await page.locator('[data-active="true"]').innerText();
        assert.ok(afterReset.includes('How to code an app in Python'),'Queue silently loops');
      }
      assert.deepEqual(errors,[]);
      assert.deepEqual(failed,[]);
      reports.push({viewport:name,layout,video,consoleErrors:errors,failedRequests:failed,checks:['font loading','navigation visibility','CTA hover/click','keyboard focus','no horizontal overflow','background video playback',...(name==='desktop'?['task advancement','full task cycle and silent reset']:[])]});
      await page.close();
    }
    fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(reports,null,2)+'\n');
    console.log(JSON.stringify(reports,null,2));
  } finally { if(browser) await browser.close();server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1});
