# EMBER.dsgn

A single-page, full-screen studio hero built with React 19, TypeScript, Vite 6, Tailwind CSS 4 via `@tailwindcss/vite`, Motion 12, Lucide React, and hls.js. No router.

The supplied Mux video plays muted, looped, mirrored, and at 0.7× speed. SVG luminance masks cut the responsive EMBER lettering through the left panel's 20px backdrop blur. The right panel has outlined circles and the white STUDIO wordmark. On mobile, the panels scroll vertically and navigation opens a spring-animated overlay with keyboard dismissal, focus containment, and focus restoration.

## Run and build

With Node 22/npm installed:

```sh
npm ci
npm run dev
npm run build
```

The development script runs Vite on `0.0.0.0:3000`. Open `/motionsites-results/ember-dsgn-hero/`. The production output is `dist/`; Vite's base is `/motionsites-results/ember-dsgn-hero/`.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser validation

The reproducible browser check serves the actual production output at its configured subpath and uses Chromium plus the image's installed playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 \
  browser-check.mjs
```

Verified desktop 1440×1000 and mobile 390×844: no horizontal overflow; video loads and advances at 0.7×; mirror scale is `-1 1`; Inter loads; the computed backdrop blur is 20px. Menu opening, closing, Escape, focus restoration, menu navigation, language selection, work link, and mobile scrolling were checked. No page script errors, console errors, failed asset requests, or HTTP errors were observed in the final run.

Screenshots and machine-readable browser observations:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`
- `screenshots/mobile-studio.png`
- `screenshots/browser-checks.json`

The desktop, mobile, and menu screenshots were also visually inspected. Keeping the prefixed and unprefixed backdrop filters in React's inline style prevents the CSS optimizer from discarding Chromium's filter property.

## Limits and source details

- The provided PROMPT.md ends at “Mobile (” and has empty markup fragments. Its complete preceding layout, copy, stack, assets, and behavior instructions were used.
- Video and Google Fonts remain the exact external assets specified. Both loaded during validation; an Internet connection is needed. Safari's native HLS fallback is implemented but was not tested on Safari.
- No portfolio pages, studio-specific social URLs, translated copy, or contact endpoint were supplied. Navigation uses local section anchors; social links open their platform homepages. EN/RU controls select the displayed active language without inventing translated content.
- Vite reports a non-blocking bundle-size warning for the approximately 966 kB minified entry containing hls.js and Motion (approximately 304 kB gzip).
- `package-lock.json` preserves dependency versions. `node_modules` is excluded from the deliverable.
- Built and checked locally only; no deployment or push was performed.
