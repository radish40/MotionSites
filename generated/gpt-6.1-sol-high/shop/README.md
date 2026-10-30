# Daisy Shop

Design ID: `shop`. A single-page Wild Daisy Fragrances landing page built with React, TypeScript, Vite and stock Tailwind CSS 3. The three sections, responsive ordering, product copy, colors, system fonts, video presentation, hover effects and staggered entrance animations follow `PROMPT.md`.

## Run and build

Use Node 22 with npm:

```sh
npm ci
npm run dev
npm run build
```

The production files are in `dist/`. Vite uses the required base path `/motionsites-results/shop/`. Serve `dist/` at that path.

This host's existing Docker image can build the project without installing host tools:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Assets

All six original assets were successfully downloaded from the exact URLs in the prompt. Original videos and returned product WebPs are included under `public/assets/` and copied into `dist/assets/` by Vite. Local URLs use Vite's base path. No asset was reconstructed or extracted from the reference screenshot. There are no external fonts, SVGs or icon graphics. `asset-report.json` records the source URLs and byte counts. Run `python3 scripts/fetch-assets.py` to download the originals again (requires curl).

## Browser verification

The browser check runs the real production build in Chromium through the image's existing Playwright installation. Its temporary HTTP server serves the required subpath, including video byte ranges.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/verify.cjs'
```

It checks desktop 1440×1000 and mobile 390×844, navigation, adding all three products, cart open/close and removal, loaded product images, video metadata and playback, JavaScript errors, failed HTTP requests, and horizontal overflow. It scrolls through both product sections to trigger their observers before saving full-page screenshots. Reports: `browser-checks.json`. Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`; additional hero-only captures are included.

## Interaction and limits

Shop Now in the header scrolls to ScentFinder. Add to Cart and product Shop Now buttons open a small accessible native cart dialog; items can be removed, and Escape or Continue shopping closes it. This minimal in-memory cart has no checkout, payments, persistence, or backend. Initial landing-page styling follows the prompt; the prompt does not specify a cart view. Native reduced-motion preferences suppress entrance transitions. Videos remain the supplied autoplaying, muted loops.

Verified in the provided desktop Chromium environment with mobile viewport emulation; physical iOS/Safari and other browser engines were not available. Screenshot video frames vary because the original videos play continuously. This project has not been deployed or pushed.
