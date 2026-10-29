const { chromium } = require('/app/node_modules/playwright-core');
const { writeFileSync } = require('node:fs');
const { spawn } = require('node:child_process');
(async () => {
  const server = spawn(process.execPath, ['scripts/serve.mjs']);
  let browser;
  try {
    await new Promise(resolve => server.stdout.once('data', resolve));
    browser = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:4173/motionsites-results/features/');
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2));
    const posters = await page.evaluate(async () => {
      const results = [];
      for (const video of document.querySelectorAll('video')) {
        video.pause();
        video.currentTime = 2;
        await new Promise(resolve => video.addEventListener('seeked', resolve, {once:true}));
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        results.push({ name:video.getAttribute('poster').split('/').pop(), data:canvas.toDataURL('image/jpeg', .9).split(',')[1] });
      }
      return results;
    });
    for (const poster of posters) writeFileSync(`assets/${poster.name}`, Buffer.from(poster.data, 'base64'));
    console.log('Generated 3 local video posters from the specified footage.');
  } finally { if (browser) await browser.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
