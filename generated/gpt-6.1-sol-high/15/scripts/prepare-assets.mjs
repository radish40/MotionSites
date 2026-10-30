// The Mux thumbnail.avif endpoint returns 404. Preserve a frame of the
// specified video, then encode that isolated background as AVIF locally.
import sharp from 'sharp';
await sharp('public/assets/hero-source.jpg').avif({ quality: 65 }).toFile('public/assets/hero-poster.avif');
