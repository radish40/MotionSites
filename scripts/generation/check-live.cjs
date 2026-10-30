const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const [url, output, previewSelector, previewDelayArgument] = process.argv.slice(2);
  const canvasCapture = process.env.MOTIONSITES_CANVAS_CAPTURE === '1';
  const previewDelayMs = previewDelayArgument === undefined ? null : Number(previewDelayArgument);
  if (previewDelayMs !== null && (!Number.isFinite(previewDelayMs) || previewDelayMs < 0 || previewDelayMs > 4000)) {
    throw Error('Preview delay must be between 0 and 4000ms; settled-page validation still runs after 5000ms');
  }
  if (!url || !output) throw Error('Usage: check-live.cjs URL OUTPUT');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox',
    ...(canvasCapture ? ['--disable-dev-shm-usage','--enable-unsafe-swiftshader'] : [])] });
  const results = [];
  try {
    for (const [name, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      if (canvasCapture) await page.addInitScript(() => {
        window.__captureDrawCalls = 0;
        for (const type of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
          if (!type) continue;
          for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
            const original = type.prototype[name];
            if (!original) continue;
            type.prototype[name] = function(...args) {
              const result = original.apply(this, args);
              window.__captureDrawCalls++;
              return result;
            };
          }
        }
        const raf = window.requestAnimationFrame.bind(window);
        window.requestAnimationFrame = callback => raf(time => {
          if (!window.__freezeCanvasCapture) callback(time);
        });
      });
      const errors = [], consoleErrors = [], failedRequests = [], badResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {if(message.type()==='error') consoleErrors.push(message.text());});
      page.on('requestfailed', request => failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
      page.on('response', response => {if(response.status() >= 400) badResponses.push({url:response.url(),status:response.status()});});
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // A loader's preview should show the actual loading component. Keep the
      // settled-page checks unchanged so later errors cannot escape acceptance.
      if (previewDelayMs !== null) {
        await page.waitForTimeout(previewDelayMs);
        if (previewSelector) {
          const subject = page.locator(previewSelector).first();
          await subject.waitFor({state:'visible',timeout:2000});
          let opaque = false;
          for (let attempt=0;attempt<30;attempt++) {
            opaque = await subject.evaluate(element => Number(getComputedStyle(element).opacity) >= 0.95);
            if (opaque) break;
            await page.waitForTimeout(50);
          }
          if (!opaque) throw Error('Animated preview subject never became readable');
        }
        await page.screenshot({ path: path.join(output, `${name}.png`) });
        await page.waitForTimeout(5000 - previewDelayMs);
      } else {
        await page.waitForTimeout(5000);
      }
      let introWait = 'not-applicable';
      if (await page.locator('video[autoplay]:not([loop])').count()) {
        const introState = await page.evaluateHandle(() => {
          const states = [...document.querySelectorAll('video[autoplay]:not([loop])')]
            .map(video => ({video, ended:video.ended}));
          for (const state of states) state.video.addEventListener('ended', () => {state.ended = true;}, {once:true});
          return states;
        });
        const deadline = Date.now() + 30000;
        introWait = 'timed-out';
        while (Date.now() < deadline) {
          // Direct evaluation works with the site's CSP; waitForFunction uses eval.
          // Remember ended events even when an app immediately restarts its video.
          const settled = await introState.evaluate(states => states
            .every(state => state.ended || state.video.paused || state.video.error));
          if (settled) { introWait = 'settled'; break; }
          await page.waitForTimeout(250);
        }
        await introState.dispose();
        // Headlines often enter after an introductory clip's ended event.
        await page.waitForTimeout(2000);
      }
      if (previewSelector && previewDelayMs === null) {
        await page.locator(previewSelector).first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
      }
      // Original animated GIFs can still be downloading after the entrance
      // animation. Allow a bounded load window; failed images remain failures.
      const imageWaitStarted = Date.now();
      while (Date.now() - imageWaitStarted < 20000) {
        const visibleImagesLoaded = await page.evaluate(() => [...document.images].every(image => {
          const rect = image.getBoundingClientRect();
          const visible = rect.width>0 && rect.height>0 && rect.bottom>0 && rect.top<innerHeight &&
            rect.right>0 && rect.left<innerWidth && getComputedStyle(image).visibility!=='hidden';
          return !visible || (image.complete && image.naturalWidth>0);
        }));
        if (visibleImagesLoaded) break;
        await page.waitForTimeout(200);
      }
      const visibleImageWaitMs = Date.now() - imageWaitStarted;
      const measureLayout = () => ({
        title: document.title,
        bodyChars: document.body.innerText.trim().length,
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        images: [...document.images].map(i => {
          const rect=i.getBoundingClientRect();
          return {src:i.currentSrc,loaded:i.complete && i.naturalWidth>0,
            visible:rect.width>0 && rect.height>0 && rect.bottom>0 && rect.top<innerHeight && rect.right>0 && rect.left<innerWidth && getComputedStyle(i).visibility!=='hidden'};
        }),
        videos: [...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,readyState:v.readyState,
          paused:v.paused,currentTime:v.currentTime,duration:v.duration,ended:v.ended,loop:v.loop,autoplay:v.autoplay})),
      });
      const layout = await page.evaluate(measureLayout);
      layout.frames = [];
      for (const frame of page.frames()) {
        if (frame === page.mainFrame() || !frame.url().startsWith(new URL(url).origin + '/')) continue;
        const frameElement = await frame.frameElement();
        const box = await frameElement.boundingBox();
        await frameElement.dispose();
        const visible = !!box && box.width>0 && box.height>0 && box.y<viewport.height && box.y+box.height>0;
        const child = await frame.evaluate(measureLayout);
        layout.frames.push({url:frame.url(),visible,title:child.title,bodyChars:child.bodyChars,horizontalOverflow:child.horizontalOverflow});
        if (visible) layout.bodyChars += child.bodyChars;
        layout.images.push(...child.images.map(image => ({...image,visible:visible && image.visible})));
        layout.videos.push(...child.videos);
      }
      let canvasRendering = null;
      if (canvasCapture) {
        const deadline = Date.now() + 60000;
        let before = 0;
        while (Date.now() < deadline) {
          before = await page.evaluate(() => window.__captureDrawCalls);
          if (before > 0) break;
          await page.waitForTimeout(250);
        }
        // Spline may use demand rendering: real pointer input must also be able
        // to produce another frame even when the scene is otherwise stationary.
        await page.mouse.move(viewport.width*.75,viewport.height*.35);
        await page.mouse.move(viewport.width*.55,viewport.height*.6,{steps:6});
        await page.waitForTimeout(1200);
        const after = await page.evaluate(() => window.__captureDrawCalls);
        canvasRendering = {before,after,drawCallsAdvanced:after>before,canvas:await page.locator('canvas').count()};
        if (!before || after <= before || !canvasRendering.canvas) {
          console.error(JSON.stringify({viewport:name,canvasRendering,errors,consoleErrors,failedRequests,badResponses}));
          throw Error('Original WebGL scene did not produce initial and subsequent frames');
        }
        // Freeze only the injected validation browser after real GPU draw calls
        // advance. Production source and normal error/layout checks stay intact.
        await page.evaluate(() => { window.__freezeCanvasCapture = true; });
        await page.waitForTimeout(300);
      }
      if (previewDelayMs === null) await page.screenshot({ path: path.join(output, `${name}.png`),timeout:60000 });
      results.push({ viewport:name,status:response.status(),introWait,visibleImageWaitMs,canvasRendering,...layout,errors,consoleErrors,failedRequests,badResponses });
      await context.close();
    }
  } finally { await browser.close(); }
  const sameOrigin = target => new URL(target).origin === new URL(url).origin;
  const passed = results.every(r => r.status === 200 && r.bodyChars > 0 && r.horizontalOverflow <= 3 && !r.errors.length &&
    !r.consoleErrors.some(e=>/content security policy|content-security-policy|refused to (execute|apply)|evalerror/i.test(e)) &&
    !r.badResponses.some(e=>sameOrigin(e.url)) && !r.images.some(i=>i.visible && !i.loaded));
  const report = { url, previewSelector:previewSelector || null, previewDelayMs, checked_at: new Date().toISOString(), passed, results };
  fs.writeFileSync(path.join(output, 'live-check.json'), JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({url,passed,results:results.map(r=>({viewport:r.viewport,status:r.status,
    horizontalOverflow:r.horizontalOverflow,errors:r.errors,consoleErrors:r.consoleErrors,
    brokenVisibleImages:r.images.filter(i=>i.visible && !i.loaded),failedRequests:r.failedRequests,badResponses:r.badResponses}))}));
  if (!passed) process.exitCode = 1;
})().catch(error => {console.error(error);process.exitCode=1;});
