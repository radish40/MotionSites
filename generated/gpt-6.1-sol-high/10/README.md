# AI Automation Hero

Design ID **10**. A single full-screen hero built from this project's `PROMPT.md` with React, Vite, Tailwind CSS, Framer Motion, Lucide React, and hls.js. All copy, the dark background, responsive type sizes, spacing, video transform, bottom fade, word animation, and blur entrances follow the supplied prompt. Text and controls are real DOM elements.

## Run and build

Requires Node 22 and npm, or the provided Docker image. From this directory:

```sh
npm ci
npm run dev
npm run build
```

Docker build used successfully:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

The lockfile is included. Vite's base is `/motionsites-results/10/`. The complete static build is in `dist/`, including `dist/index.html`. Serve that directory at the configured path. Nothing has been deployed or pushed.

## Verification

Real headless Chromium checks run against the built static files using the image's Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

- Desktop: 1440 × 1000; mobile: 390 × 844. No horizontal or vertical overflow at either viewport.
- HLS video decoded and advanced on both viewports; autoplay, muted playback, and loop configuration confirmed.
- No page script errors or failed network requests during these checks.
- CTA destinations, Learn now click/focus behavior, keyboard focus, and reduced-motion heading visibility checked.
- Screenshots visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Detailed browser measurements: `screenshots/checks.json`.
- Production build passed; dependency installation reported zero vulnerabilities. Vite reports one advisory about a JavaScript chunk over 500 kB, primarily due to the bundled HLS player.

## Assets and limits

The exact specified Mux HLS URL is used, with native HLS support where available and hls.js elsewhere. The stream returned HTTP 200 and played in Chromium. It remains a network dependency; long-term service availability and offline video playback are not guaranteed. No source assets were substituted or extracted. The optional `/home/opc/motionsites/assets/previews/10.webp` reference was absent, so comparison used the written specifications.

No specific font file was supplied: sans-serif text uses Arial/Helvetica and italic serif text uses Georgia/Times New Roman, all local system fonts. No font CDN is required. Entrance animations honor reduced-motion preferences; video remains autoplaying as requested.

The booking link preserves the exact `/book-call` destination. A booking page/backend was not included in the supplied hero scope, and its destination was checked as a link only. The prompt supplies no secondary destination, so Learn now targets and focuses the existing platform description without adding a page or feature. Mobile CTAs wrap naturally under the specified spacing.

Browser validation covers Chromium, not Safari or Firefox. Video loop configuration was inspected; an entire video cycle was not timed. The page remains the specified viewport-height composition at the required sizes; a 620px minimum height keeps content accessible on unusually short screens.
