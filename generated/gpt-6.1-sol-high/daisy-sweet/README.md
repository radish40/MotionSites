# Daisy Sweet

Standalone fragrance showcase implementing `PROMPT.md` with React 18, TypeScript, Tailwind CSS 3 defaults, and Vite. The reusable `ProductPanel`, `ScentFinderSection`, and `anim` helper are in `src/ScentFinderSection.tsx`.

The section uses the exact supplied copy, colors, asset URLs, layout classes, animation timings, and system font stack. At 768px and above the product and video each occupy half the viewport width. Smaller viewports stack the natural-height product panel over a 75vw video strip.

## Build and run

Requires Node 22.12+ and npm, or the supplied Docker image. From this directory:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/daisy-sweet/` on the preview server. Vite's base is configured for that path. `dist/` contains the complete static build, including `dist/index.html`.

For this host without Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The browser check serves the real `dist/` files at the required subpath and uses the image's existing Chromium and playwright-core, with no additional project packages:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'node checks/browser.cjs'
```

Evidence is in `checks/browser-report.json`, `checks/npm-audit.json`, `screenshots/desktop.png` (1440×1000), and `screenshots/mobile.png` (390×844). Screenshots use full-page capture after the animations finish.

Checks cover desktop split geometry, mobile stacking and video strip height, absence of horizontal overflow, loaded product image, advancing muted inline looping video, completed entrance animations and their transition settings, button hover fill, keyboard focus/activation, labels, system fonts, zero SVGs, and browser errors. Both requested viewports passed. TypeScript and production build passed. The final npm audit reports zero vulnerabilities.

## Scope and limitations

The exact image and video remain external URLs and require network access. Both loaded and decoded in Chromium. Chromium can abort an individual media request as it manages video range requests; those observations are recorded separately in `mediaRequestAborts`, while the visible video's readiness and advancing playback are checked directly.

SHOP NOW has the specified hover treatment and native keyboard support. The prompt supplies no shopping destination or purchase behavior, so the standalone button has no navigation or checkout handler. No custom fonts, icons, extra product features, or deployments were added. `ready` in `result.json` means ready for review, not published.
