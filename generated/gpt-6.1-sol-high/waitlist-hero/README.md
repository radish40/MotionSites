# Waitlist Hero

Design ID: `waitlist-hero`. A full-viewport micro hero built with React 18, TypeScript, Tailwind CSS and Vite. The page implements the supplied copy, dark dotted shell, responsive three-panel landscape, centered portrait pill, decorative orbs, gradient, and button transitions. The original reference image is used only for visual comparison; the page uses real DOM and canvas elements.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The configured base path is `/motionsites-results/waitlist-hero/`. The complete static release is in `dist/`, including `dist/index.html` and local media/fonts. Serve this directory at that path. Nothing has been deployed or pushed.

On this host, the build runs in the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Assets and animation

- `public/boomerang.mp4`: original 28,819,684-byte CloudFront MP4 specified in `PROMPT.md`, downloaded intact. Served locally with Vite's base prefix.
- `public/portrait.webp`: original Higgs image endpoint from `PROMPT.md`, downloaded intact at 1280 × 1714. No extraction or substitute artwork was needed.
- `public/inter-{400,500,600}.ttf` and `public/inter.css`: Inter from Google Fonts, hosted locally so the finished page makes no external requests.
- `public/favicon.svg`: small local micro initial favicon.

A single muted offscreen video plays forward once. `requestVideoFrameCallback`, with a `requestAnimationFrame` fallback, captures unique presented frames into canvases capped at 960px wide. The live capture is visible during initialization. After `ended`, a 30 FPS render loop walks the buffered frames forward and backward without assigning `video.currentTime`. Visible canvas panels share one continuous cover-fitted source rectangle. The mobile breakpoint displays one canvas.

## Verification

The production output is tested by `scripts/check.cjs`, using the image's Playwright Core and Chromium. The script serves only this project's `dist/` under the required base path.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

Evidence:

- `screenshots/desktop.png`: 1440 × 1000.
- `screenshots/mobile.png`: 390 × 844.
- `screenshots/checks.json`: measured layout, visible canvas count, font/image loading, captured-frame count, reverse frame progression, keyboard focus, hover opacity/text color, pressed scale, browser errors, failed requests and external requests.
- `npm-audit.json`: zero reported dependency vulnerabilities after updating compatible Vite 6 and PostCSS patch releases.

Both sizes have no document overflow. Desktop shows three canvas panels; mobile shows one. The original media and local Inter load. Browser checks exercise all three buttons and verify the requested visual interactions. Screenshot composition was also inspected directly.

## Scope and limits

The prompt specifies button appearance and states, but supplies no login or waitlist destination, form, or backend. Buttons retain their specified visual/keyboard interactions; they do not authenticate or submit personal data. No additional product flows were invented.

Frame capture depends on the frames delivered by the browser during the initial video playback. Busy software-rendered Chromium can drop source frames, producing a smaller buffer and a shorter boomerang cycle. The check report records actual captured counts; it does not establish that every encoded source frame was delivered. The browser checks cover desktop Chromium at the two specified viewport sizes, not physical mobile devices or every browser. Muted autoplay can still be restricted by user settings. Initial buffering uses memory proportional to the presented frame count. The source video retains its original landscape colors; interface colors do not introduce purple or indigo.
