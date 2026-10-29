# Financial Suite

Design ID: `financial-suite`. A single-page **Infinite** premium credit card experience, implemented from this directory's `PROMPT.md`. Browser title: **Infinite - Premium Credit Card**.

React 18, Vite, TypeScript, Tailwind CSS 3.4, and lucide-react. No additional runtime dependencies. The supplied images and MP4 are bundled in `public/assets/`, with source URLs and checksums in `asset-report.json`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/financial-suite/`. Vite's base is configured for that path. The deployable static output is `dist/`, including `dist/index.html`. No deployment was performed.

On this host, build with the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Experience

The hero uses staggered entrance animations, a parallax SVG grid, and a canvas-generated, feathered 260px cursor mask to reveal the second background image. Scrolling scrubs the supplied video across 1,800 pixels, then fades in the fixed card section. Scrolling back restores the hero. The card section has independent cursor tracking and image reveal.

The mobile menu has icon crossfades and staggered items. See Features and Get Started scroll to the card; How It Works moves into the video sequence. Navigation and secondary buttons open small keyboard-accessible detail dialogs. Account, support, and application controls disclose that live services are not connected; no information is collected or submitted.

## Validation

The production build and TypeScript check pass. `npm-audit.json` records zero dependency vulnerabilities. Chromium checks use the built output under the required subpath at **1440×1000** and **390×844**. The checks cover image loading, Geist loading, video metadata and scrubbing, section fades, reverse scrolling, canvas masking, mobile menu, detail dialogs, and primary buttons. The browser check rejects every HTTP error response (including fonts) and unexpected failed requests; only Chromium-cancelled media range requests are allowed. It also asserts all four background images decode successfully. No JavaScript errors or horizontal overflow were observed.

Run the reproducible browser check:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check.cjs'
```

The script serves `dist/` temporarily inside its container and writes `browser-checks.json` and screenshots. Required captures are `screenshots/desktop.png` and `screenshots/mobile.png`; additional captures show the spotlight, video, card, and mobile menu. Screenshots were visually reviewed.

## Asset limitations

The prompt references `HelveticaNeue-Roman.woff2` and `.woff`, but neither file exists in this project and the prompt provides no downloadable source for them. The hero-only font utility retains `'Helvetica Neue Roman', 'Helvetica Neue', Helvetica, Arial, sans-serif`. Its `@font-face` retains `local('Helvetica Neue')` and omits unresolved URL sources, so the page never requests the absent files. The hero uses an installed local font or the specified fallback stack. No substitute file is supplied or renamed as Helvetica Neue. To enable the original asset later, supply licensed font files and explicitly configure their URLs before rebuilding.

Geist loads successfully through the exact Google Fonts CSS URL in the prompt. It remains an external dependency and needs network access. All five specified image/video assets loaded successfully from local copies. Chromium can cancel redundant MP4 range requests; the checked video nevertheless reaches readyState 4 and scrubs correctly. The layout moves the mobile More button below the heading to avoid overlap at 390px. Reduced-motion settings shorten entrance animations.

`ready` in `result.json` means ready for management-session review, not published or connected to financial services.
