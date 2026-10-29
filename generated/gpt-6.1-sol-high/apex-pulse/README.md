# Apex Pulse

Design ID: `apex-pulse`. Delivered brand: **AETHER_X — Where Sky Meets Machine Logic**. Built from `PROMPT.md` with React, Vite, TypeScript, Tailwind CSS, PostCSS, and Autoprefixer. Runtime dependencies are limited to the four requested packages.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/apex-pulse/` on the dev or preview server. Vite uses that exact base path. `dist/` is the complete static deliverable. Nothing has been deployed or pushed.

This host uses the supplied Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Implementation

The visible video follows scroll immediately while a separate extractor fetches the bundled source and creates 120 ImageBitmaps at up to 1280px width. The canvas is painted before the video-to-canvas handoff. Extraction failure leaves the live video fallback active. Progress uses 0.1 interpolation, cover fitting, and a device pixel ratio capped at 2. Cleanup releases frames, object URLs, listeners, and animation callbacks. Text uses threshold-0.15 intersection reveals with the specified delays. Reduced-motion preferences disable reveal transitions and smooth anchor scrolling.

## Browser checks

After building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The check serves the production build at its exact publication path and uses Playwright Core with Chromium. It checks 1440×1000 and 390×844, intermediate 640px and 768px layouts, horizontal overflow, extracted-frame handoff, scroll-driven frame changes, navigation, details dialog controls, and script errors. A fresh browser context intentionally rejects the extraction fetch to check that the video remains visible and seeks on scroll. Extraction can take over a minute on CPU-only Chromium; the fallback stays visible during loading.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-precision.png`, and `screenshots/mobile-precision.png`. Detailed results: `screenshots/browser-checks.json`.

## Assets and limitations

- The exact supplied CloudFront MP4 is bundled unchanged in `public/assets/aether-flight.mp4`. It loads and decodes, but depicts a floral humanoid rather than a drone. The upstream content mismatch is retained to honor the required asset.
- The prescribed onlinewebfonts stylesheet remains linked in `index.html`. Its matching Helvetica Neue Regular WOFF2 is bundled locally for reliable loading. Attribution: [Web Fonts](https://www.onlinewebfonts.com/fonts), under the CC BY 4.0 notice in the supplied stylesheet, preserved in `public/assets/font-source.css`.
- Tailwind sans and mono reference Flexo Soft Medium as required; no Flexo asset was supplied. The body uses the required Helvetica Neue stack.
- “Join The Fleet” navigates to the precision section. “Full Details” opens the supplied specifications in a native dialog with Escape and close-button dismissal.
- “Schedule a Call” opens a native email draft with a prefilled subject. No contact address or booking endpoint was supplied, so its recipient is intentionally empty. It is not a connected booking service.

Validation result: **passed**. All four viewport sizes had no horizontal overflow and no JavaScript errors. Two canceled media byte requests reported by Chromium during seeking/source cleanup are retained in the browser report; video decoding, handoff, and the forced-failure fallback passed.
