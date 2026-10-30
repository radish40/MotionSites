// Isolate only the mark from the task's own visual reference; no page imagery is used.
const fs = require('node:fs');
const {chromium} = require('/app/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
  const page = await browser.newPage();
  const reference = fs.readFileSync(process.argv[2]);
  const result = await page.evaluate(async data => {
    const image = new Image(); image.src = 'data:image/webp;base64,' + data;
    await image.decode();
    const canvas = document.createElement('canvas'); canvas.width=52;canvas.height=52;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,52,52);
    ctx.drawImage(image,356,32,26,23,3,5,46,41);
    return canvas.toDataURL('image/webp',1).split(',')[1];
  }, reference.toString('base64'));
  fs.writeFileSync('assets/logo.webp',Buffer.from(result,'base64'));
  await browser.close();
})();
