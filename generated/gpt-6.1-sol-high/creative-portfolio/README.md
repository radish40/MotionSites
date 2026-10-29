# Creative Portfolio

Design ID: `creative-portfolio`. A responsive, full-screen creative portfolio for **Viktor.**, built with React, Vite, Tailwind CSS, and the Figtree Google Font. The project implements only the Navbar and Hero described in `PROMPT.md`.

The three supplied CloudFront videos render simultaneously, preload into object URLs, and crossfade over 1.2 seconds. The switcher changes the availability dot and name punctuation from pink to white. The navigation includes a live local-time CUP clock, mobile Menu/Close panel, and hover effects. IntersectionObserver triggers the text reveals once. Reduced motion disables animations and pauses background playback.

## Build and run

Requires Node 22 and npm. Dependencies are pinned in `package-lock.json`.

```bash
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/creative-portfolio/`. Vite uses the required base `/motionsites-results/creative-portfolio/`; the publishable static output is `dist/`, including `dist/index.html`.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

Real production build and Chromium checks completed. `scripts/browser-check.cjs` uses the image's existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`, without adding browser-testing packages to the project. Run it inside that image while the preview server is listening on port 4173.

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Additional overflow checks: 1024 × 768 and 320 × 740.
- All three 1920 × 1080 supplied videos preload as blobs and play without media errors.
- All switcher states, opacity transitions, accent changes, clock updates, CTA hover, and mailto destination pass.
- Mobile menu expansion, Escape dismissal, and closing after navigation pass.
- Reduced motion disables animation and pauses all videos.
- Google Figtree loads; no failed requests, browser script errors, or console warnings in the checked session.
- Dependency audit: zero vulnerabilities after updating Vite and PostCSS.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`, `screenshots/browser-report.json`, and `screenshots/dependency-audit.json`.

## Scope and limitations

Videos and Google Fonts use the exact external providers required by the prompt and need network access. Video blob fetch failures retain the original media URLs. Screenshots show a live video frame, so the frame varies between visits. The prompt supplies only the opening phrase of the paragraph; its continuation has been completed in the same voice. Works, Services, and About link to the matching areas within this single hero; Contact and the project CTA open `Davies@gmail.com`. No additional pages or sections were added. The clock uses the visitor's local timezone, as specified by the prompt's formatter. Nothing has been deployed or pushed.
