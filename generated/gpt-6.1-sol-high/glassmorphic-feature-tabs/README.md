# Glassmorphic Feature Tabs

Design ID: `glassmorphic-feature-tabs`. A single UI Rocket `CoreFeaturesSection`, built from the supplied `PROMPT.md` using React 18, TypeScript, Vite, TailwindCSS, framer-motion, clsx, and tailwind-merge.

The section includes four cross-fading previews, a five-second rotation timer that stops after navigation, animated captions, three cursor-following spotlight borders, and dashboard mockups that preserve their 900×562 design canvas. Desktop tabs support arrow keys, Home, and End. Mobile uses the previous/next controls. Scroll reveals and caption motion respect reduced-motion preferences. The dashboard contents are visual previews.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the Vite server at `/motionsites-results/glassmorphic-feature-tabs/`. The production build is in `dist/`, with `dist/index.html` and hashed assets. Vite's base is configured for that exact subpath.

On this host, Node and Chromium are supplied by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The lockfile is included; `node_modules` is excluded from the deliverable. Nothing was deployed or pushed.

## Verification

The real TypeScript/Vite production build passed. Chromium checks ran against `dist/` served at the configured subpath, using viewports of 1440×1000 and 390×844. Run them again with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The check script uses the image's existing Playwright and Chromium and starts a temporary HTTP server inside that container. It checks rotation, pause after interaction, all tabs, arrow wrap, keyboard controls, matching dashboard/sidebar state, all three spotlight coordinates, image transition duration, fonts, rendered images, mobile controls, fixed-canvas scaling, reduced motion, horizontal overflow, and JavaScript errors.

Evidence:

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page captures from the requested viewport sizes.
- `screenshots/tab-*.png`: desktop captures of all four previews.
- `screenshots/browser-checks.json`: browser assertions, network observations, fonts, image loading, and scale measurements.
- `screenshots/asset-curl-checks.json`: direct HTTP status checks for all supplied media URLs.
- `screenshots/dependency-audit.json`: zero dependency vulnerabilities after updating Vite and PostCSS within their existing major versions.

## Asset limitations

All assets remain direct external URLs; no assets were locally imported or replaced with a screenshot. Google Inter, Material Symbols Rounded, all four Higgs images, module covers 1–2, the play SVG, and the avatar loaded successfully.

The exact supplied module-cover-3.png through module-cover-6.png URLs return HTTP 400. Each is attempted first, then its card reuses supplied cover 1 or 2 on image error. All six supplied CloudFront MP4 URLs return HTTP 403. The video elements attempt these exact sources with autoplay/muted/loop/playsInline, then recover to the supplied Higgs poster images on error. Consequently, background tiles currently display static posters. Chromium reports these inaccessible requests as `net::ERR_BLOCKED_BY_ORB`; no JavaScript errors or broken rendered images remain. The original all-URLs-load acceptance item cannot pass until the upstream assets are repaired. The section is ready for review with these recorded asset limitations.
