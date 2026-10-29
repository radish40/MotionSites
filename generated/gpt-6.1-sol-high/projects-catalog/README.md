# Projects Catalog

Design ID: `projects-catalog`. A React, Tailwind CSS and framer-motion implementation of the supplied Projects section, with Kanit typography, nine original project images, rounded bordered cards, responsive image columns, heading reveal and scroll-driven sticky stacking.

The visible heading is “Project”; the three projects, categories and “Live Project” labels follow PROMPT.md. The white surface behind the section demonstrates the specified negative-margin overlap. This is a standalone section, without additional navigation or invented project pages.

## Build and run

Requires Node 22 and npm. Dependencies are pinned and package-lock.json is included.

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/projects-catalog/` on the preview server. Vite's base is set to that exact path. The complete static build is in `dist/`, including `dist/index.html`, local fonts and images.

On this host, the actual build used `npm install && npm run build` in the existing container image. Reproduce it from the lockfile with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

Real Chromium checks use the production build and an HTTP server at the required subpath. The browser script uses the image's existing playwright-core and Chromium:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

`browser-checks.json` records desktop 1440×1000 and mobile 390×844 results: all nine images decoded, Kanit loaded, three links opened in new tabs at each viewport, keyboard focus worked, scroll sweeps had no horizontal overflow, and no page errors or failed requests occurred. It also records sticky positions and transforms, including final desktop scales 0.94 / 0.97 / 1. Reduced-motion mode disables translation and scaling.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-stacked.png`
- `screenshots/mobile-stacked.png`

The initial screenshots were visually inspected against this design's reference. The page is live DOM and real image elements; no reference screenshot is used in the rendered page.

## Assets and implementation details

The specified images.higgs.ai proxy requests stalled. All nine originals were recovered unchanged from the CloudFront source URLs encoded in those exact proxy links. `asset-report.json` maps every specified URL to its original and local file. `scripts/recover-assets.py` reproduces the recovery. Original PNGs are retained, so the static output is approximately 22 MB; no substitute imagery or reference extraction was necessary.

The exact Google Fonts head links are retained. Kanit weights 300–900 are also copied locally from Google Fonts and loaded through `public/assets/kanit-local.css`, so the rendered design can use its font without a successful external font request. The original Google font stylesheet is retained as provenance.

Desktop wrappers retain the specified 85vh height and 32px sticky inset. Below 768px, wrappers expand to fit the single-column content and the sticky inset adjusts when a card exceeds the viewport, so the full set of images remains reachable. The right image gets an explicit responsive height on mobile. The 28px card offsets and scroll scale formulas are retained. No extra product features were added.

An initial build exposed incompatible newer motion-dom resolution; overrides pin the compatible motion-dom 12.23.23 and motion-utils 12.23.6. Vite emits harmless framer-motion “use client” directive warnings; the production build and browser runtime pass.

## Limits

All “Live Project” destinations intentionally remain `#`, opening a new tab with noopener/noreferrer, as specified. No destination websites were supplied. Validation covers the installed Chromium at the requested viewport sizes; other browser engines were not tested. This deliverable has not been deployed or pushed.
