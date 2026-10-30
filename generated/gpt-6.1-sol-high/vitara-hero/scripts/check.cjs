const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const results = [];
 for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors = [], requests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => requests.push({url:r.url(),error:r.failure().errorText}));
  await page.goto('http://localhost:4173/motionsites-results/vitara-hero/',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(3000);
  const visual = await page.evaluate(async () => {
   await document.fonts.load('400 16px "Inria Serif"');
   await document.fonts.ready;
   const video = document.querySelector('video');
   return { documentWidth:document.documentElement.scrollWidth, viewportWidth:innerWidth, fontLoaded:document.fonts.check('400 16px "Inria Serif"'), video:{readyState:video.readyState,paused:video.paused,time:video.currentTime,width:video.videoWidth,height:video.videoHeight,src:video.currentSrc}, navVisible:getComputedStyle(document.querySelector('.nav-links')).display !== 'none', heading:document.querySelector('h1').innerText };
  });
  await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  await page.getByRole('button',{name:'Start Wellness Check',exact:true}).click();
  if (await page.locator('textarea').inputValue() !== 'I’d like to start a wellness check.') throw new Error('Wellness action failed');
  await page.getByRole('button',{name:'Send message',exact:true}).click();
  await page.getByRole('status').waitFor();
  await page.getByRole('button',{name:'Chat with MedAI',exact:true}).click();
  if (!(await page.locator('textarea').inputValue()).includes('MedAI')) throw new Error('Chat action failed');
  await page.getByRole('button',{name:'View Insights',exact:true}).click();
  if (!(await page.locator('textarea').inputValue()).includes('insights')) throw new Error('Insights action failed');
  await page.getByRole('button',{name:'Login',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  await page.locator('#email').fill('test@example.com');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.getByRole('status').filter({hasText:'coming soon'}).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Sign up',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Close dialog'}).click();
  if(name === 'desktop') { await page.getByRole('link',{name:'Services',exact:true}).click(); await page.getByRole('dialog').waitFor(); await page.keyboard.press('Escape'); }
  results.push({name,viewport:{width,height},...visual,errors,failedRequests:requests,interactions:'passed'});
  await page.close();
 }
 await browser.close();
 fs.writeFileSync('screenshots/checks.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
