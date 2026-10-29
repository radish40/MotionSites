const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const data = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 240; canvas.height = 56;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#151b16'; ctx.font = '900 48px Arial, sans-serif';
    ctx.textBaseline = 'middle'; ctx.fillText('LGPSM', 0, 30);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  fs.writeFileSync('public/image.png', Buffer.from(data, 'base64'));
  await browser.close();
})();
