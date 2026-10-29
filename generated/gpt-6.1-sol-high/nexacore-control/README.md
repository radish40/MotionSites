# NexaCore Control

Design ID: `nexacore-control`. A single responsive `FreedomSection` built with React, TypeScript, Tailwind CSS v3, Vite, and hls.js. It implements the exact copy, Mazzard H font, gradient heading, inline badge SVG, supplied card icons, and circular HLS video from `PROMPT.md`.

The desktop layout has negative cards, the video, and positive cards in three columns. Below the `lg` breakpoint, the video appears first and both card columns stack below it. There are no hover states, CSS animations, scroll effects, or added product controls.

## Build and run

With Node.js 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open the preview at `/motionsites-results/nexacore-control/`. Vite's base is configured for that exact path. Publishable static files are in `dist/`, including `dist/index.html`. Nothing has been deployed.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check starts a temporary local HTTP server over the real production build and uses the image's installed Chromium and playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Evidence:

- `screenshots/desktop.png`: full-page capture at viewport 1440×1000.
- `screenshots/mobile.png`: full-page capture at viewport 390×844.
- `screenshots/browser-checks.json`: assertions and measured browser results.

Checks cover ten cards, desktop column placement, mobile ordering and scrolling, both font weights, all ten external icon instances, advancing muted HLS playback, video loop completion, no CSS animations, browser script/console errors, failed network requests, and horizontal overflow. Additional overflow checks cover widths 320, 768, 1024, and 1920.

## Assets and limitations

All original asset URLs were retained and loaded successfully in Chromium. The video decoded at 1700×1700 and is cropped at the requested 160% inside the circle. No asset extraction, substitution, or screenshot-based page rendering was used. Only this design's supplied preview was inspected for visual comparison.

The font, icons, and Mux stream require internet access and continued availability of their original hosts. Native Safari HLS fallback follows the supplied implementation but has not been tested in Safari; validation used Chromium. The specified low-contrast negative text was preserved. Vite reports a nonfatal bundle-size advisory because hls.js is bundled into the entry chunk; the production build succeeds.

Source and configuration, dependency lockfile, build output, verification script, screenshots, and result metadata are all contained in this project. `node_modules` is excluded from delivery and can be restored with `npm ci`.
