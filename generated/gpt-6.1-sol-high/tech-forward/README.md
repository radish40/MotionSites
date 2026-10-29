# Tech-Forward

Design ID: `tech-forward`. A full-screen NeuralKinetics hero built from `PROMPT.md` with React 19, Vite, Motion (`motion/react`), Lucide React and plain CSS. Includes the requested SVG logo, copy, responsive navigation, background video, bottom gradient, technology pills and staggered entrance animations.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite uses base `/motionsites-results/tech-forward/`. Serve the complete `dist/` directory at that prefix. `dist/index.html` exists.

On this host, build using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The actual initial build used `npm install && npm run build` to generate `package-lock.json`. It succeeded. Subsequent builds use `npm ci`. Rollup emitted nonfatal warnings about ignored Motion `use client` directives in this client-rendered application. Dependencies are excluded from delivery and restored with npm ci.

## Assets

The video uses the exact CloudFront URL in `PROMPT.md`. The identical 2,716,267-byte MP4 is bundled at `public/assets/neural-kinetics.mp4`, copied to `dist/assets/`, and used as a fallback on remote loading errors. The muted video autoplays, plays inline, loops, and uses object-fit cover. Its centered wrapper is 80% width/height on mobile and 100% on desktop.

Inter weights 300, 400, 500 and 600 load from Google Fonts. Both remote services loaded successfully during browser validation. Google Fonts requires network access; sans-serif is the CSS fallback. No generated or substitute imagery is used.

## Interactions

Menu opens a navigation popover. Its items, both CTAs and Adaptive Systems open local informational dialogs using the design's technology vocabulary. Native dialogs support focus containment, Escape, backdrop dismissal and explicit close. Controls have accessible names and visible keyboard focus. Entrance animations respect reduced motion.

## Browser verification

The real production build was served at the required subpath in a temporary Docker container and checked with Chromium and Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

- Desktop 1440 × 1000 and mobile 390 × 844 passed.
- Screenshots visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`.
- No horizontal or vertical page overflow at either size.
- No script exceptions or failed network requests.
- Video decoded at 3836 × 2160, readyState 4, duration 8.04 seconds, without errors.
- Inter loaded at both sizes.
- Menu, menu-to-details navigation, both CTAs, Adaptive Systems, close button and Escape passed at both sizes.
- Raw results are recorded in `screenshots/checks.json`.

Screenshots pause the video at the same two-second frame after entrance animations finish for consistent comparison. The delivered application plays continuously.

Ready for review. No push or deployment performed.
