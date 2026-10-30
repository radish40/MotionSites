const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'], headless: true });
  const checks = [];
  for (const [name, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if(msg.type() === 'error') errors.push(msg.text()); });
    page.on('response', res => {if(res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);});
    await page.goto('http://localhost:3000/motionsites-results/community-superdesign-typing-animation/');
    await page.waitForFunction(() => document.querySelector('#playback-status').textContent === 'Thought complete');
    assert.equal(await page.locator('.character.visible').count(), 30);
    const layout = await page.evaluate(() => ({width:innerWidth, documentWidth:document.documentElement.scrollWidth, height:innerHeight, documentHeight:document.documentElement.scrollHeight, fonts:document.fonts.check('800 100px Manrope')}));
    assert.ok(layout.documentWidth <= layout.width, `Horizontal overflow: ${name}`);
    assert.ok(layout.fonts, 'Font not loaded');
    await page.screenshot({path:`screenshots/${name}.png`, fullPage:true});
    await page.evaluate(() => {
      window.revealTimes = [];
      new MutationObserver(records => {
        for(const r of records) if(r.type === 'attributes' && r.target.classList.contains('visible') && !r.oldValue.includes('visible')) window.revealTimes.push(performance.now());
      }).observe(document.querySelector('#headline'), {subtree:true, attributes:true,attributeOldValue:true,attributeFilter:['class']});
    });
    await page.getByRole('button', {name:'Play it again'}).click();
    await page.waitForFunction(() => document.querySelector('#playback-status').textContent === 'Thought complete');
    const timing = await page.evaluate(() => {const t=window.revealTimes; return {revealed:t.length,duration:t.at(-1)-t[0],intervals:t.slice(1).map((v,i)=>v-t[i])};});
    assert.equal(timing.revealed,30);
    const average = timing.duration / 29;
    assert.ok(average > 43 && average < 60, `Unexpected typing interval ${average}`);
    await page.getByRole('button', {name:'Play it again'}).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(160);
    const duringReplay = await page.locator('.character.visible').count();
    assert.ok(duringReplay > 0 && duringReplay < 30, 'Keyboard replay failed');
    await page.getByRole('button', {name:'Play it again'}).click();
    await page.waitForFunction(() => document.querySelector('#playback-status').textContent === 'Thought complete');
    assert.equal(await page.locator('.character.visible').count(),30);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.getByRole('button', {name:'Play it again'}).click();
    assert.equal(await page.locator('.character.visible').count(),30);
    assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'100');
    assert.deepEqual(errors,[]);
    checks.push({viewport:name, ...layout, averageCharacterDelayMs:average, revealedCharacters:timing.revealed, replay:true, keyboardReplay:true, interruptedReplay:true,reducedMotion:true, browserErrors:errors});
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('screenshots/browser-checks.json',JSON.stringify(checks,null,2)+'\n');
  console.log(JSON.stringify(checks,null,2));
})().catch(error => {console.error(error);process.exit(1);});
