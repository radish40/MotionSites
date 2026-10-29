import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const directory = new URL('../public/images/', import.meta.url);
await mkdir(directory, { recursive: true });
const assets = {
  light: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/hf_20260515_092045_b654224c-4741-458f-8596-fa5bfeffabbc_1_oyfhme.jpg',
  dark: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/hf_20260515_092102_24e30358-d694-4b70-8a56-a4f0887cf8ae_1_ry5dvs.jpg',
};
await Promise.all(Object.entries(assets).map(async ([theme, url]) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset download failed (${response.status}): ${theme}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const image = await sharp(buffer).webp({ quality: 92 }).toBuffer();
  await writeFile(new URL(`hero-${theme}.webp`, directory), image);
  console.log(`Prepared hero-${theme}.webp (${image.length} bytes)`);
}));
