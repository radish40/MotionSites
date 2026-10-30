# Wellness Balance

Design ID: `wellness-balance`. A responsive TerraElix wellness hero built with React, Tailwind CSS, Vite, and Lucide React. Includes the specified word reveals, original image assets, responsive product composition, mobile navigation overlay, and four-card carousel on a 3.5-second interval. Reduced-motion preferences are supported.

## Run and build

Requires Node 22 and npm. Run `npm ci`, then `npm run dev`. Run `npm run build` to produce the complete static site in `dist/`.

The configured base URL is `/motionsites-results/wellness-balance/`. Use this path when viewing the site. `npm run preview -- --port 4173` serves the production build.

On the supplied host, use:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The verified build used `npm install && npm run build` initially, then `npm run build` for the final production build. Dependency versions are locked in `package-lock.json`. Dependencies are not included in the deliverable.

## Verification

The production build passed. Chromium with Playwright checked desktop 1440×1000, mobile 390×844, and tablet 820×1180. All images and both Google Font families loaded. There were no recorded browser errors, failed requests, or horizontal document overflows. Automatic carousel rotation, manual carousel selection, mobile menu navigation, CTA scrolling, and responsive menu visibility passed.

Screenshots are saved as `screenshots/desktop.png` and `screenshots/mobile.png` (full-page captures at the specified viewport sizes). Detailed results are in `screenshots/checks.json`. The browser check is reproducible using the container's existing Chromium and Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c '(npm run preview -- --port 4173 > /work/screenshots/server.log 2>&1 &); node scripts/browser-check.cjs'
```

Install dependencies before running this check. The script exits unsuccessfully for failed layout, asset, font, carousel, menu, or CTA checks.

## Assets and scope

All six exact image URLs in PROMPT.md were successfully recovered using curl and stored in `public/assets/`. Python urllib initially received 403 responses; curl retrieved the original files without substitutions. Sources and download outcomes are recorded in `asset-sources.json`; `scripts/fetch-assets.py` reproduces retrieval. No image was extracted from the visual reference, and no screenshot is used as page content.

DM Sans (400/500) and Inter (400/500) are imported from Google Fonts as requested. Fonts require network access; sans-serif fallbacks apply if that service becomes unavailable. All image assets ship locally. Reference inspection used only this design's supplied WebP; visual fidelity is guided primarily by the full written specification.

This is the requested single-page landing. Navigation and the exploration controls move to relevant on-page content; the carousel dots select cards. The design has no commerce, account, search service, or assessment backend. No deployment or push was performed.
