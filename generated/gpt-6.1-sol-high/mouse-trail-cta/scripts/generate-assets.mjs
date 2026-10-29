import { readFile, writeFile, mkdir } from 'node:fs/promises';
import gifenc from 'gifenc';
import wawoff2 from 'wawoff2';

// Original, seamless, rectangular motion studies for the cursor trail.
// Everything is generated locally; no third-party image service is needed at runtime.
const { GIFEncoder, quantize, applyPalette } = gifenc;
const width = 160, height = 120, frames = 20;
const palettes = [
  [[255, 89, 42], [255, 213, 131]], [[193, 246, 65], [21, 40, 31]],
  [[197, 181, 255], [49, 27, 147]], [[253, 136, 176], [168, 17, 57]],
  [[49, 109, 241], [211, 235, 252]], [[251, 224, 62], [253, 89, 36]],
  [[18, 57, 54], [113, 229, 196]], [[243, 228, 210], [86, 54, 221]],
];
await mkdir('public/trail', { recursive: true });
for (let design = 0; design < 8; design++) {
  const gif = GIFEncoder();
  for (let frame = 0; frame < frames; frame++) {
    const t = frame / frames * Math.PI * 2;
    const pixels = new Uint8Array(width * height * 4);
    const [a, b] = palettes[design];
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const u = (x - width / 2) / height, v = (y - height / 2) / height;
      let mix;
      switch (design) {
        case 0: { // A rotating, sculptural pinwheel.
          const angle = Math.atan2(v, u) + t;
          mix = Math.sin(angle * 6 + Math.hypot(u, v) * 8) > 0 ? 1 : 0;
          break;
        }
        case 1: // A distorted, traveling checkerboard.
          mix = (Math.floor((u + .13 * Math.sin(v * 8 + t)) * 9) + Math.floor(v * 9 + frame / frames * 2)) % 2 === 0 ? 0 : 1;
          break;
        case 2: { // Intersecting violet orbits.
          const radius = Math.hypot(u * 1.3, v);
          mix = .5 + .5 * Math.cos(radius * 42 - t * 2);
          break;
        }
        case 3: // A soft, undulating satin field.
          mix = .5 + .5 * Math.sin(u * 18 + Math.sin(v * 7 + t) * 3 + t);
          break;
        case 4: { // A luminous blue sphere.
          const cx = u - .13 * Math.cos(t), cy = v - .12 * Math.sin(t);
          const radius = Math.hypot(cx, cy);
          mix = radius < .35 ? Math.max(0, Math.sqrt(1 - (radius / .35) ** 2) * .85 + cx) : .03;
          break;
        }
        case 5: // Folded orange and yellow ribbons.
          mix = Math.sin(v * 23 + Math.sin(u * 6 + t) * 4) > 0 ? 1 : 0;
          break;
        case 6: { // A living pixel matrix.
          const px = Math.floor(x / 10), py = Math.floor(y / 10);
          mix = .5 + .5 * Math.sin(px * .9 + Math.cos(py * .8 + t) * 3 + t);
          mix = mix > .55 ? 1 : .03;
          break;
        }
        default: { // A graphic flower opening and closing.
          const angle = Math.atan2(v, u) + t / 2;
          const edge = .27 + .1 * Math.cos(angle * 8);
          mix = Math.hypot(u, v) < edge ? 1 : 0;
        }
      }
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) pixels[i + c] = Math.round(a[c] * (1 - mix) + b[c] * mix);
      pixels[i + 3] = 255;
    }
    const palette = quantize(pixels, 64);
    const indexed = applyPalette(pixels, palette);
    gif.writeFrame(indexed, width, height, { palette, delay: 60, repeat: 0 });
  }
  gif.finish();
  await writeFile(`public/trail/motion-${design + 1}.gif`, gif.bytes());
}

const otf = await readFile('public/fonts/PPMondwest-Regular.otf');
await writeFile('public/PPMondwest-Regular.woff2', await wawoff2.compress(otf));
console.log('Generated 8 animated GIFs and converted PP Mondwest to WOFF2.');
