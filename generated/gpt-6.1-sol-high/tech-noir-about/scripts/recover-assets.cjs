// Extract only the artwork region; no page typography or UI is included.
// Re-run inside the supplied Docker image. This is an approximation, not the original video.
const fs = require('node:fs');
const { chromium } = require('/app/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const source = fs.readFileSync('recovery/reference.webp').toString('base64');
  const assets = await page.evaluate(async (source) => {
    const img = new Image(); img.src = 'data:image/webp;base64,' + source; await img.decode();
    const cutout = document.createElement('canvas'); cutout.width = 640; cutout.height = 125;
    const ctx = cutout.getContext('2d'); ctx.drawImage(img, 0, 345, 640, 125, 0, 0, 640, 125);
    const pixels = ctx.getImageData(0, 0, 640, 125);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const r = pixels.data[i], g = pixels.data[i+1], b = pixels.data[i+2];
      // Remove the red backdrop, preserving the neutral and brown artwork.
      const redness = r - Math.max(g, b);
      if (r > 100 && redness > 70) pixels.data[i+3] = Math.round(255 * Math.max(0, 1 - (redness - 70) / 35));
    }
    ctx.putImageData(pixels, 0, 0);
    const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 320;
    const out = canvas.getContext('2d');
    const draw = (phase) => {
      out.fillStyle = '#ff0000'; out.fillRect(0, 0, 1280, 320);
      const scale = 2 + 0.012 * Math.sin(phase * Math.PI * 2);
      out.drawImage(cutout, (1280 - 640 * scale) / 2, 320 - 125 * scale, 640 * scale, 125 * scale);
    };
    draw(0);
    const poster = canvas.toDataURL('image/png');
    const stream = canvas.captureStream(24);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 2500000 });
    const chunks = []; recorder.ondataavailable = (e) => chunks.push(e.data);
    const done = new Promise(resolve => recorder.onstop = resolve);
    recorder.start();
    const start = performance.now();
    await new Promise(resolve => {
      const tick = () => { const t = (performance.now() - start) / 6000; draw(t); if (t < 1) requestAnimationFrame(tick); else resolve(); }; tick();
    });
    recorder.stop(); await done; stream.getTracks().forEach(t => t.stop());
    const bytes = new Uint8Array(await new Blob(chunks, {type: 'video/webm'}).arrayBuffer());
    let raw = ''; for (const byte of bytes) raw += String.fromCharCode(byte);
    return { cutout: cutout.toDataURL('image/png'), poster, video: btoa(raw) };
  }, source);
  fs.writeFileSync('public/assets/recovered-artwork.png', Buffer.from(assets.cutout.split(',')[1], 'base64'));
  fs.writeFileSync('public/assets/recovered-poster.png', Buffer.from(assets.poster.split(',')[1], 'base64'));
  fs.writeFileSync('public/assets/recovered-artwork.webm', Buffer.from(assets.video, 'base64'));
  await browser.close();
})();
