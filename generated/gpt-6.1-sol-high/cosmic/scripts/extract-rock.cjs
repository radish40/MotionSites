// Reconstruct a foreground cutout from the supplied video because its linked
// Cloudinary overlay is unavailable (HTTP 401: cloud name disabled).
const { chromium } = require('/app/node_modules/playwright-core');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/motionsites-results/cosmic/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('video').ended);
  const image = await page.evaluate(() => {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // Hand-traced silhouette in a 2048px-wide reference of the final frame.
    // Keep the original frame dimensions so object-cover aligns both layers.
    const points = [[729,598],[740,578],[765,555],[801,532],[832,508],[844,478],[854,449],[861,433],[888,423],[910,414],[929,380],[944,365],[959,373],[985,360],[1005,357],[1024,371],[1047,389],[1070,397],[1101,404],[1132,407],[1147,426],[1171,449],[1188,457],[1203,486],[1217,510],[1231,532],[1250,545],[1263,572],[1281,590],[1297,616],[1308,641],[1306,678],[1302,706],[1294,737],[1278,764],[1263,782],[1232,802],[1199,799],[1175,793],[1141,814],[1117,828],[1097,847],[1078,858],[1031,862],[1010,853],[1001,843],[970,836],[944,821],[923,809],[901,797],[882,779],[853,762],[826,748],[812,729],[797,701],[784,680],[761,658],[746,638],[733,620]];
    ctx.beginPath();
    points.forEach(([x,y], i) => { const px = x * canvas.width / 2048, py = y * canvas.width / 2048; if (i) ctx.lineTo(px,py); else ctx.moveTo(px,py); });
    ctx.closePath(); ctx.clip();
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  fs.writeFileSync('public/assets/rock.png', Buffer.from(image, 'base64'));
  await browser.close();
})();
