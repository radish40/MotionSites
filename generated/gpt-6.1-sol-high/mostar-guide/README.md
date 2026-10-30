# Mostar Guide

Design ID: `mostar-guide`. Page title: **Mostar city**.

A standalone vanilla HTML/CSS/JavaScript cinematic scroll page built from this project's `PROMPT.md`. The page uses real layered images, DOM text, sticky positioning, pointer parallax, the specified scroll equations, three story scenes, and the three-set infinite sights slider. Header links seek to their respective scroll scenes. No framework, bundler, or runtime dependencies are required.

## Run and package

Open `index.html` through a static HTTP server. The page itself needs no compilation. The packaging command copies the complete page and recovered font to `dist/`:

```sh
npm run check
npm run build
```

With the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install --package-lock-only && npm run check && npm run build'
```

Serve the contents of `dist/` at `/motionsites-results/mostar-guide/`. All page resources use relative paths, including the recovered font, so the page works under that prefix. No deployment was performed. No `node_modules` directory is included.

Validation result: **passed** at both required viewport sizes, with zero script errors and zero failed asset requests after font recovery. Deliverable status: **ready** for review.

## Browser validation

`browser-check.cjs` starts a temporary HTTP server restricted to this project's static files, opens the production `dist/` page at the required prefix with Chromium and Playwright, writes `browser-report.json`, and closes the server and browser. Run it inside the supplied image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run test:browser'
```

Checks cover desktop **1440×1000**, mobile **390×844**, image decoding, font loading, horizontal overflow, all 15 cloned cards, scroll-scene CSS variables, navigation, previous/next controls, forward and backward wrap normalization, card selection by click and keyboard, reduced-motion snapping and zero pointer parallax, and uncaught JavaScript errors. The test waits for scroll animation state before checking each scene rather than relying on a fixed delay.

Screenshots are in `screenshots/desktop.png` and `screenshots/mobile.png`; additional `*-bridge.png`, `*-bazaar.png`, and `*-sights.png` files capture the later scenes. Machine-readable outcomes are recorded in `browser-report.json` and `result.json`.

## Asset recovery and limitations

All seven scene layers and all three sight pin icons use their exact specified remote URLs. No preview pixels, generated replacement images, or full-page screenshots are used as webpage content. Only this design's supplied preview was viewed, to compare the composition; the explicit prompt's fullscreen layout and exact CSS take precedence over the preview's presentation wrapper.

The specified Ogg font URL returns HTTP 200 and the original 68,832-byte font, but its response lacks `Access-Control-Allow-Origin`; Chromium rejected direct cross-origin `@font-face` loading with `net::ERR_FAILED`. A cache-query retry also lacked that header. Under `TASK.md`'s asset recovery allowance, the exact original font was downloaded to `assets/OggText-Medium.woff2` and referenced locally under the required family name `"Ogg Medium"`. `recover-font.sh` reproduces that recovery. No visual substitution or approximation was made.

Source: https://dcym8fthxf5uu.cloudfront.net/fonts/247a073c-29f5-4a89-aa3a-741020f346fc/OggText-Medium.woff2

SHA-256: `b57d1cbbd6d456d35e421161bfbb614f1903dded2b4c27de26d75ebf5a448702`.

Remote photographs and icons still require internet access. Validation is limited to the available Chromium browser and specified viewport sizes. The language and old-town-notes buttons retain the exact supplied markup; the prompt specifies no translation menu, notes content, or behavior for those buttons, so none was invented. The card action selects and slides the card as specified rather than opening an additional detail view.
