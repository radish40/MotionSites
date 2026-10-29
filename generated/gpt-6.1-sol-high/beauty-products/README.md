# Beauty Products

Design ID: `beauty-products`. A React + Tailwind CSS implementation of the Best Sellers section in `PROMPT.md`. The production site is built into `dist/` for `/motionsites-results/beauty-products/`.

The section includes all seven specified products, responsive card widths, the two collection tabs, conditional animated indicators, IntersectionObserver reveals, image hover zoom, wheel-to-horizontal scrolling, mouse dragging, native touch scrolling, and the specified progress indicator. The Sets tab filters to the provided Super glow set; no additional products were invented. Tab buttons also support arrow keys, Home, and End. Reduced-motion preferences are respected.

## Build and run

Requires Node.js 22 and npm, or the available Docker image. All commands run from this project directory.

```sh
npm ci
npm run build
npm run dev
```

Development URL: `http://localhost:5173/motionsites-results/beauty-products/`.

Docker build used on this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

For a production preview, run `npm run preview` and open `http://localhost:4173/motionsites-results/beauty-products/`. The configured base path is required. The dependency lockfile is included; `node_modules` is excluded from the handoff.

## Verification

`browser-check.cjs` starts a temporary local HTTP server serving the actual `dist/` output at the required subpath and checks it with Playwright and Chromium. It checks desktop 1440×1000 and mobile 390×844, seven loaded product images, background and card dimensions, reveal completion, document overflow, wheel and drag scrolling, progress movement, collection filtering, keyboard tab navigation, and a native touch swipe on mobile. It also records console errors, script errors, failed requests, and HTTP errors. The server and browser close when checks finish.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node browser-check.cjs'
```

Evidence:

- `build.log`: actual production build output.
- `browser-results.json`: browser assertions and measured dimensions.
- `screenshots/desktop.png`: desktop default collection.
- `screenshots/mobile.png`: mobile default collection.
- `result.json`: delivery status and check summary.

Both screenshots were also visually inspected.

## Assets and limitations

The supplied `images.higgs.ai` proxy requests did not finish after more than 80 seconds and were stopped. The four exact original CloudFront PNG files embedded in those proxy URLs downloaded successfully and are bundled in `public/assets/`, then copied into `dist/assets/` by Vite. Products 5–7 reuse the specified images. See `asset-report.json` and `asset-fallback-report.json` for provenance. There are no runtime external image or font dependencies. The prompt specifies no custom font, so the Tailwind default system sans-serif stack is used.

The original PNG assets total about 9.5 MiB. The scroll thumb follows the exact requested 30% width and transform formula; the track clips the thumb at the far right endpoint. Product cards are informational, as specified; no checkout or product-detail destination was supplied. The project has not been deployed or pushed.
