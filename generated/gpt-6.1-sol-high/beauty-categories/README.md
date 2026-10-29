# Beauty Categories

Design ID: `beauty-categories`. A React + Tailwind CSS implementation of the supplied Categories section, built with Vite. The page contains the three specified video cards, vertical labels, pill buttons, one-shot grid reveal, and hover/active effects. No additional storefront features were added.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/beauty-categories/` on the preview server. Vite's base is configured for that exact path. The publishable static files are in `dist/`, including `dist/index.html`. The dependency lockfile is included; `node_modules` is excluded.

On this host, which has no Node/npm installation, the actual build was run using the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

To run the automated checks against the built static files:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The check uses the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`, starts a temporary HTTP server, and closes it on completion. On another environment, set `PLAYWRIGHT_PATH` to an installed playwright-core module and adjust the Chromium executable in `scripts/browser-check.cjs`.

## Validation

- Production build passed with Vite 6.4.5.
- Chromium desktop viewport: 1440 × 1000; three 480 × 750 cards, vertically centered with 125 px above and below.
- Chromium mobile viewport: 390 × 844; three stacked 390 × 400 cards.
- Additional responsive checks at widths 640, 768, and 1024 passed.
- All three original remote video URLs loaded, decoded, and autoplayed with muted, loop, and playsInline attributes on both tested viewports.
- Verified grid reveal threshold 0.1, one-shot unobserve, and card transition delays of 0/150/300 ms.
- Verified desktop video zoom, overlay darkening, label translation, button hover and press styles, keyboard focus and activation; mobile buttons accept taps.
- No script/console errors, failed asset requests, or horizontal overflow in the final run.
- npm installation audit reported zero vulnerabilities after updating Vite and PostCSS.
- Both screenshots were visually inspected.

Evidence: `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots use a reproducible video frame at one second, frozen only by the test after confirming playback. The mobile screenshot is full-page (390 × 1200), captured from the required 390 × 844 viewport; desktop is 1440 × 1000.

## Assets and limitations

The exact CloudFront MP4 URLs from PROMPT.md are set directly on the video elements. All were available during verification; internet access and continued CDN availability are required. No external font was specified, so the page uses Tailwind's system sans-serif stack with no font network dependency.

The prompt defines visual shop buttons without routes, product data, or shopping behavior. Buttons preserve the specified hover/active interactions and do not navigate. The inline vertical-label rotation is preserved while a CSS `translate` property supplies its hover movement.

This is a local build ready for review. Nothing has been deployed or pushed.
