const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required']});
  const results = { errors: [], requestFailures: [], checks: [] };
  for (const [name, viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
    const context = await browser.newContext({viewport, deviceScaleFactor:1, isMobile:name==='mobile', hasTouch:name==='mobile'});
    const page = await context.newPage();
    page.on('pageerror',error => results.errors.push({viewport:name,message:error.message}));
    page.on('requestfailed',request => results.requestFailures.push({viewport:name,url:request.url(),error:request.failure()?.errorText}));
    page.on('response',response => { if(response.status()>=400) results.requestFailures.push({viewport:name,url:response.url(),status:response.status()}); });
    await page.goto('http://localhost:4173/motionsites-results/visual-hero/',{waitUntil:'networkidle'});
    await page.evaluate(async () => {
      await document.fonts.ready;
      await document.fonts.load('italic 100px "Instrument Serif"', 'MicroVisuals');
      await document.fonts.load('300 14px Barlow', "Forma's AI");
    });
    await page.waitForTimeout(1500);
    const initial = await page.evaluate(() => ({
      title: document.querySelector('h1').textContent,
      width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
      video: { width:document.querySelector('video').videoWidth, height:document.querySelector('video').videoHeight, duration:document.querySelector('video').duration, time:document.querySelector('video').currentTime },
      fonts: { heading:document.fonts.check('italic 100px "Instrument Serif"', 'MicroVisuals'), body:document.fonts.check('300 14px Barlow', "Forma's AI") },
      controls:[...document.querySelectorAll('.hero-actions button')].map(x=>({text:x.textContent,bounds:x.getBoundingClientRect().toJSON()}))
    }));
    if (initial.scrollWidth>initial.width) throw new Error(name+' horizontal overflow');
    if (!initial.fonts.heading || !initial.fonts.body) throw new Error(name+' fonts not loaded');
    if (!initial.video.width) throw new Error('Video unavailable');
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
    if (name==='desktop') {
      await page.mouse.move(1420,980);
      await page.waitForTimeout(1000);
      const transform = await page.locator('video').evaluate(el=>getComputedStyle(el.parentElement).transform);
      await page.getByRole('button',{name:'Start generating'}).hover();
      await page.waitForTimeout(300);
      const hover = await page.getByRole('button',{name:'Start generating'}).evaluate(el=>({transform:getComputedStyle(el).transform,shadow:getComputedStyle(el).boxShadow}));
      await page.getByRole('button',{name:'Start generating'}).click();
      await page.getByRole('button',{name:'See templates'}).click();
      await page.keyboard.press('Tab');
      results.checks.push({name:'parallax and CTA hover/press',transform,hover});
    } else {
      await page.getByRole('button',{name:'Open navigation'}).click();
      if(!await page.locator('#mobile-links').isVisible()) throw new Error('Menu did not open');
      await page.screenshot({path:'screenshots/mobile-menu.png'});
      await page.keyboard.press('Escape');
      if(await page.locator('#mobile-links').count()) throw new Error('Menu did not close');
      await page.getByRole('button',{name:'Open navigation'}).click();
      await page.locator('#mobile-links').getByRole('link',{name:'Gallery',exact:true}).click();
      if(await page.locator('#mobile-links').count()) throw new Error('Navigation did not close menu');
      results.checks.push({name:'mobile menu open, Escape close, and link close',passed:true});
    }
    await page.waitForFunction(()=>document.querySelector('main').dataset.playback==='boomerang',{},{timeout:60000});
    await page.screenshot({path:`screenshots/${name}-boomerang.png`});
    const frames = await page.locator('canvas').evaluate(el=>({count:Number(el.dataset.frameCount),width:el.width,height:el.height}));
    await page.waitForFunction(()=>document.querySelector('canvas').dataset.direction==='-1',{},{timeout:60000});
    const reverse = await page.locator('canvas').getAttribute('data-frame');
    await page.waitForTimeout(120);
    const next = await page.locator('canvas').getAttribute('data-frame');
    if(Number(next)>=Number(reverse)) throw new Error('Canvas reverse playback not observed');
    await page.waitForFunction(()=>document.querySelector('canvas').dataset.direction==='1',{},{timeout:60000});
    results.checks.push({name,initial,frames,reversePlayback:true,forwardPlayback:true});
    await context.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  if(results.errors.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
