# Audio Showcase

Design ID: `audio-showcase`. A single viewport hero for fictional record label **quietpress**, built from the supplied `PROMPT.md` with React, TypeScript, Tailwind CSS, Vite, and lucide-react. No backend or additional UI library.

## Run and build

With Node 22 installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production output is `dist/`, configured for `/motionsites-results/audio-showcase/`. Open that path on the preview server. No deployment has been performed.

In the provided environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Behavior

The supplied CloudFront video is bundled locally. `BoomerangVideoBg` captures the first playback into offscreen canvases at a maximum width of 960 pixels, then displays those frames forward and backward at 30 fps. It uses `requestVideoFrameCallback` with a `requestAnimationFrame` fallback and releases animation resources on unmount.

The mobile menu, navigation and collection dialogs, empty cart, previous/next track selection, and per-track heart state are interactive. Dialogs support Escape, focus containment, and focus restoration. No audio source was supplied; the track widget is a visual listening-card demo with preset times, not an audio player or checkout.

The exact remote Helvetica stylesheet remains in `index.html`, with a local copy of its WOFF2 face for reliable rendering. Font credit: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), per the supplied stylesheet's attribution notice. Video and font provenance are the URLs in `PROMPT.md`; no generated imagery or reference screenshot is used.

## Verification

The real production build runs TypeScript checks followed by Vite. The browser check serves `dist/` at the required subpath and uses Chromium through Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node check-browser.cjs'
```

Screenshots: `screenshots/desktop.png` (1440 × 1000) and `screenshots/mobile.png` (390 × 844). Browser results are in `screenshots/checks.json`. Checks cover viewport overflow, video decoding and transition to the boomerang canvas, track selection and heart persistence, collection/cart dialogs, desktop navigation, mobile menu, Escape handling, released animation transforms, reduced-motion entrance styles, the requestAnimationFrame capture fallback, and uncaught script errors.

## Limits

This is a static fictional label concept. Dialog content and alternate tracks are local demonstration data. Likes reset on refresh. The background is muted; motion reduction disables entrance animations as specified. Capturing frames consumes memory proportional to the video length and decoded frames. The required external font stylesheet responds successfully, and the locally bundled Helvetica face loads. Its duplicate remote font-face registration remains unloaded, so the aggregate `document.fonts.check()` returns false even though the active face is loaded. Chromium also aborts superseded video preload/range requests during startup; full video decoding and canvas playback are verified. These observations are recorded in `result.json` and the raw browser report.
