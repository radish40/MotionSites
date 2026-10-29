# SAAS Software

Design ID: `convix-software-hero`. A responsive, full-viewport hero for **Convix Software**, built with React, TypeScript, Vite, and lucide-react. Includes the supplied background video, flower logo, floating navigation, Instrument Serif headline, and interactive dashboard preview.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/convix-software-hero/` on the displayed development or preview origin. Vite uses this exact base path. The complete static output is in `dist/`, including `dist/index.html`.

On the provided host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The production output was served at its configured subpath and checked in real Chromium with Playwright at 1440×1000, 390×844, and 768×1000. Checks cover the 3/1/2-column layouts, document overflow, muted looping video playback, both font families, hamburger navigation, metric toggles, target editing, period selectors, Save confirmation, Cancel/reset, and the Get Started anchor. No custom animation is used.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Detailed browser results: `screenshots/browser-report.json`.

Reproduce browser verification after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

This command creates a temporary HTTP server inside the container, checks the real build, writes the screenshots/report, and exits.

## Assets and scope

The exact MP4 and Unsplash poster from `PROMPT.md` were successfully downloaded to `public/assets/` and bundled locally in `dist/assets/`. The MP4 is approximately 33 MB. Google Fonts supplies Inter 400/500/600/700 and Instrument Serif regular/italic through `src/styles/fonts.css`; network access is required for these fonts, with sans-serif/serif fallbacks defined.

The rounded hero intentionally clips the dashboard at the viewport boundary, including lower cards on narrow screens. Navigation and CTA links point within this hero; additional pages, checkout, and an access-registration backend were not specified. Dashboard interactions are local React state and reset on reload. The target labels preserve the prompt's exact “Ste targets” wording.

No deployment or push was performed. `ready` in `result.json` means ready for review.
