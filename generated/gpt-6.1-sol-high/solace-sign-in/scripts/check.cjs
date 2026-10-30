const { chromium } = require('/app/node_modules/playwright-core');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const server = spawn('node', ['node_modules/vite/bin/vite.js', 'preview', '--host', '0.0.0.0', '--port', '4173'], { stdio: 'inherit' });
  let browser;
  try {
    await new Promise(r => setTimeout(r, 1500));
    browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const results = { url: '/motionsites-results/solace-sign-in/', viewports: [], errors: [], requestFailures: [] };
    for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name === 'mobile' });
      page.on('pageerror', e => results.errors.push(e.message));
      page.on('requestfailed', r => results.requestFailures.push({url:r.url(), error:r.failure().errorText}));
      await page.goto('http://127.0.0.1:4173' + results.url, { waitUntil: 'networkidle' });
      await page.locator('h1').waitFor();
      await page.waitForFunction(() => document.querySelector('video').readyState >= 3);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      const sample = () => page.evaluate(() => {
        const c = document.querySelector('canvas');
        const data = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
        let sum = 0, opaque = 0;
        for(let i=0;i<data.length;i+=4) {sum+=data[i]+data[i+1]+data[i+2]; if(data[i+3]) opaque++;}
        return { sum, opaque, canvasWidth:c.width, time:document.querySelector('video').currentTime };
      });
      const first = await sample();
      await page.waitForTimeout(600);
      const second = await sample();
      assert(first.opaque > 10000, 'Refraction canvas must contain pixels');
      assert.notEqual(first.sum, second.sum, 'Canvas must animate');
      assert(second.time > first.time, 'Background must play');
      const layout = await page.evaluate(() => ({
        viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        fontLoaded: document.fonts.check('400 16px Inter') && [...document.fonts].some(f => f.family === 'Inter' && f.status === 'loaded'),
        video: { width: document.querySelector('video').videoWidth, height: document.querySelector('video').videoHeight, loop: document.querySelector('video').loop },
        canvas: { width: document.querySelector('canvas').width, height: document.querySelector('canvas').height },
        title: document.title,
        buttonCount: document.querySelectorAll('button').length
      }));
      assert(layout.documentWidth <= width, 'No horizontal overflow');
      assert(layout.documentHeight <= height, 'Content fits target viewport');
      assert(layout.fontLoaded, 'Inter must load');
      await page.screenshot({ path: `screenshots/${name}.png`, fullPage:true });
      await page.getByLabel('Email', {exact:true}).fill('test@gmail.com');
      await page.getByLabel('Password', {exact:true}).fill('Mindful123!');
      assert.equal(await page.locator('#password').getAttribute('type'), 'password');
      await page.getByRole('button', {name:'Show password', exact:true}).click();
      assert.equal(await page.locator('#password').getAttribute('type'), 'text');
      await page.getByRole('button', {name:'Hide password', exact:true}).click();
      assert.equal(await page.locator('#password').getAttribute('type'), 'password');
      await page.getByText('Stay signed in', {exact:true}).click();
      assert(await page.getByRole('checkbox').isChecked());
      await page.getByText('Stay signed in', {exact:true}).click();
      assert.equal(await page.getByRole('checkbox').isChecked(), false);
      const beforeURL = page.url();
      await page.getByRole('button', {name:'Sign In', exact:true}).click();
      assert.equal(page.url(), beforeURL);
      assert.equal(await page.locator('#email').inputValue(), 'test@gmail.com');
      await page.locator('#email').fill('invalid');
      await page.getByRole('button', {name:'Sign In', exact:true}).click();
      assert.equal(await page.locator('#email').evaluate(e=>e.validity.typeMismatch), true);
      for(const label of ['Reset password?', 'Continue with Google', 'Join Now']) {
        await page.getByRole('button', {name:label, exact:true}).click();
        assert.equal(page.url(), beforeURL);
      }
      results.viewports.push({name, width, height, ...layout, animatedCanvas:true, interactions:'Password show/hide, checkbox on/off, prevented form submit, email validity, secondary buttons checked', first, second});
      await page.close();
    }
    assert.equal(results.errors.length, 0, 'No script errors');
    fs.writeFileSync('screenshots/checks.json', JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally {
    if(browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch(e => {console.error(e); process.exitCode=1;});
