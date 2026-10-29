const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4173/motionsites-results/mood-tracker/');
  for (let i = 1; i <= 3; i++) {
    const video = page.locator('video').nth(i-1);
    await video.evaluate(v => new Promise((resolve, reject) => { if(v.readyState >= 2) resolve(); else {v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',reject,{once:true});} }));
    const data = await video.evaluate(v => { v.pause(); const c=document.createElement('canvas'); c.width=540; c.height=960; c.getContext('2d').drawImage(v,0,0,c.width,c.height); return c.toDataURL('image/jpeg',.88).split(',')[1]; });
    fs.writeFileSync(`/work/public/assets/screen-${i}.jpg`,Buffer.from(data,'base64'));
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
