# Place Saver

Native HTML, CSS, and JavaScript showcase of two animated iOS screens. Design ID: `place-saver`. Static publish path: `/motionsites-results/place-saver/`.

The 370 × 790 devices remain side by side with a 70px gap. JavaScript centers and scales the complete stage using 40px viewport padding and the specified 0.95 multiplier. The welcome screen uses the native 470 × 1008 composition scaled by 0.787234. Entrance animations wait for both videos' `loadeddata` events and loaded fonts, with a five-second fallback. Reduced motion disables entrance animations and pauses the videos.

## Build and run

With Node 22:

```bash
npm install
npm run build
npm start
```

Open `http://localhost:5173/motionsites-results/place-saver/`. The build copies the complete page and assets to `dist/`. All asset paths are relative; no Vite or framework is needed for the requested single-page HTML stack. No runtime packages or node_modules are required. `package-lock.json` is included.

This host uses the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only --ignore-scripts && npm run build'
```

## Verification

Run the real Chromium checks using the image's existing Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build && node browser-check.cjs'
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Checks loaded fonts, actual autoplay playback, video decoder readiness, device boundaries, page overflow, and JavaScript errors.
- Exercises monthly/yearly selection, both subscription previews, Apple sign-in preview, Terms preview, dialog dismissal, and Escape.
- Verifies reduced motion and the five-second fallback with intentionally failed video requests. Those expected failures are separately recorded.
- Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`, visually reviewed. Videos are paused at three seconds for consistent captures after actual playback is verified.
- Detailed evidence: `browser-report.json`; source downloads: `asset-report.json`.

## Assets and limits

Both exact supplied MP4s, both supplied PNGs, the three Cloudinary Garamond WOFF2 fonts, and Google Fonts Inter and Playfair Display are stored in `public/assets/` and copied into `dist/assets/`. No external requests are needed at runtime. The initial Python download attempt stalled; curl successfully retrieved all required assets. `fetch-assets.py` can retrieve them again. Google Fonts returned TrueType data, correctly declared as `format('truetype')` in the downloaded CSS despite the local `.woff2` file suffix.

Apple authentication, payments, and production legal terms were not supplied. Buttons display explicit preview dialogs; no account or payment is created. The light home indicator uses the exact requested translucent black, so its contrast is low on the dark welcome background. On narrow screens the entire two-device composition shrinks as explicitly requested. This is a design showcase, not a standalone mobile app.

Nothing was pushed or deployed. `ready` means ready for acceptance review.
