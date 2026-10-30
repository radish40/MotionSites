# Velorah Focus

Design ID: `velorah-focus-hero`.

React + TypeScript + Tailwind CSS v4, built with Vite. The two posts in PROMPT.md appear side by side on wide screens. Each has a 600×800 canvas, its exact video source, staggered copy, glass button, Velorah branding, SVG static, scanlines, moving VHS bar and RGB flicker. The left content offset is −180px; the right is −358px. Small screens stack and proportionally scale the canvases. Text and controls are real DOM elements.

## Run and build

With Node 22/npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

In the provided host environment:

```sh
docker run --rm -e HOME=/work/.npm-home -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --cache /work/.npm-cache && npm run build'
```

The publishable output is `dist/`. Vite's base is `/motionsites-results/velorah-focus-hero/`. This project has not been deployed or pushed.

## Validation

A real TypeScript check and Vite production build passed. Chromium via the provided image's Playwright inspected the production preview at the required subpath:

- Desktop viewport 1440×1000: both canvases measure exactly 600×800.
- Mobile viewport 390×844: both measure approximately 358×477.33; document width is 390px, without horizontal overflow.
- Both original videos autoplay muted and loop, with decoded 1244×1664 frames.
- Instrument Serif and Inter load through the specified Google Fonts import.
- Entrance and RGB animations run simultaneously; keyboard focus, glass-button hover scale and clicking were checked.
- Deliberately blocking the remote videos verifies local MP4 fallbacks. Expected network errors from this test are recorded separately from ordinary browsing errors.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png` (full-page capture from the mobile viewport), and `screenshots/browser-checks.json`. The reproducible browser script is `scripts/browser-check.cjs`, using `/app/node_modules/playwright-core` and `/usr/bin/chromium` from the specified Docker image. Run it alongside `npm run preview -- --port 4173` in that container.

## Assets and limits

Both exact CloudFront MP4 URLs returned HTTP 200 and were downloaded unchanged to `public/assets/`, copied into `dist/assets/`. The video elements retain the exact remote URLs, switching to local originals if those fail. No asset extraction or approximation was needed. The optional project preview WebP was absent, so visual review used the original prompt and actual rendered page.

Google Fonts remains an external dependency as explicitly supplied by the prompt; CSS provides serif and system-sans fallback stacks. Screenshots capture a moment in continuously animated video and VHS effects. Reduced-motion preferences disable decorative CSS animation. The prompt specifies no CTA destination or journey workflow; the two native buttons implement its visual, hover and keyboard-focus behavior without adding an unrelated flow.

The requested model configuration is controlled by the session runner; project code cannot switch or independently certify its model or reasoning settings.
