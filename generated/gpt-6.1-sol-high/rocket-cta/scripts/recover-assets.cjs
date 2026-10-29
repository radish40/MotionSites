// Isolates only the grass foreground of this project's authorized 640×468 reference.
// No page text, dashboard, or controls are included in the resulting asset.
const fs = require('node:fs');
const { chromium } = require('/app/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const source = fs.readFileSync('scripts/rocket-cta-reference.webp').toString('base64');
  const output = await page.evaluate(async source => {
    const img = new Image(); img.src = `data:image/webp;base64,${source}`; await img.decode();
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 148;
    const context = canvas.getContext('2d'); context.drawImage(img, 0, 320, 640, 148, 0, 0, 640, 148);
    const pixels = context.getImageData(0, 0, 640, 148);
    // Background above the foliage is near-neutral gray; preserve green/yellow leaves.
    // Only mask the upper edge, retaining dark undergrowth lower in the crop.
    for (let y = 0; y < 70; y++) for (let x = 0; x < 640; x++) {
      const i = (y * 640 + x) * 4;
      const [r, g, b] = pixels.data.slice(i, i + 3);
      const chroma = Math.max(r,g,b) - Math.min(r,g,b);
      const foliage = Math.max(0, Math.min(1, (chroma - 7) / 12));
      const lower = Math.max(0, Math.min(1, (y - 40) / 25));
      pixels.data[i + 3] = Math.round(255 * Math.max(foliage, lower) * Math.min(1, y / 6));
    }
    context.putImageData(pixels, 0, 0); return canvas.toDataURL('image/png').split(',')[1];
  }, source);
  fs.writeFileSync('public/assets/grass-recovered.png', Buffer.from(output, 'base64'));
  await browser.close();
})();
