# CodeNest Coding Platform

Design ID: `codenest-hero`. Status: **ready for review**. A single responsive React and Tailwind CSS hero built from this project's complete `PROMPT.md`. Nothing has been deployed or pushed.

## Implementation

The page uses the exact Mux HLS stream through `hls.js` with `enableWorker: false`, 60% video opacity, directional dark gradients, three desktop grid lines, and an SVG ellipse with a 25px Gaussian blur. The liquid glass card is 200×200px with the exact Tailwind `translate-y-[-50px]` offset, masked gradient border, luminosity background blend, and 4px backdrop blur.

Inter, Plus Jakarta Sans, and Instrument Serif italic are served locally. The headline scales from 40px on mobile to 72px on desktop. Lucide supplies ArrowRight, Menu, and X. Mobile navigation has a full-screen overlay, focus containment, Escape handling, and focus restoration. Navigation links open local informational dialogs, and Get Started opens the learning-path overview. No external destinations, enrollment service, or backend were supplied; these dialogs are informational.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/codenest-hero/` on the Vite server. The production output is `dist/`, including `dist/index.html`, with the required base path.

On this host, use the supplied Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is excluded from the deliverable.

## Browser verification

The check serves the actual `dist/` files under the required subpath and uses the image's Chromium and `playwright-core`:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  /work/scripts/check.cjs
```

Passed checks:

- Desktop 1440×1000 and mobile 390×844, plus widths 320, 768, 1024, and 1920: no horizontal overflow.
- Live HLS playback on desktop and mobile, with decoded 1920px video and advancing playback time.
- All three local font families load; card size is 200×200px and computed translation is exactly `0px -50px`.
- All four desktop navigation links, primary CTA, dialog dismissal, mobile menu opening/closing, Escape dismissal, and mobile link selection.
- Reduced-motion mode displays the local poster without video playback.
- Zero browser script errors, console errors, failed network requests, or HTTP errors in the recorded run.

Detailed results: `screenshots/checks.json`. Screenshots were captured and visually inspected:

- `screenshots/desktop.png` — 1440×1000
- `screenshots/mobile.png` — 390×844
- `screenshots/mobile-menu.png`
- `screenshots/get-started.png`

Short viewports can scroll vertically to preserve readable content; the required desktop and mobile viewports fit without vertical overflow. Verification used Chromium, not Safari or Firefox.

## Assets and limitations

- Video: the exact stream from `PROMPT.md`, `https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8`. It played successfully in Chromium. Streaming requires Mux connectivity.
- Poster: downloaded from the same asset at `https://image.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys/thumbnail.jpg?time=0&width=1920`. Stored as `public/assets/video-poster.jpg` for loading, fallback, and reduced motion.
- Fonts: original Google Fonts declarations are preserved in `public/assets/fonts-source.css`; corresponding TTF files and rewritten `fonts.css` are local. The rendered page makes no Google Fonts requests.
- The optional reference `/home/opc/motionsites/assets/previews/codenest-hero.webp` did not exist. No preview imagery was used or extracted. Layout and unspecified supporting copy were interpreted from the written prompt; matching the absent reference could not be checked.
- The build succeeds with a nonfatal Vite advisory about the JavaScript bundle exceeding 500kB, largely due to the required HLS library.
