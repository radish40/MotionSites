# Digital Experiences

A single-page agency landing page implemented from this project's `PROMPT.md`. Design ID: `digital-experiences`. Built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

The page contains exactly two sections: Hero and Capabilities. It includes the specified copy, custom SVG icons, Instrument Serif italic and Barlow typography, masked gradient glass borders, word-by-word blur animation, staggered entrances, and both supplied cinematic videos with fade-and-restart playback.

## Build and run

With Node 22 available:

```bash
npm ci
npm run build
npm run preview
```

The production base path is `/motionsites-results/digital-experiences/`. Vite preview serves the page at `http://localhost:4173/motionsites-results/digital-experiences/`.

On the supplied host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

For an interactive local preview, expose port 4173:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run preview -- --port 4173'
```

All publishable static files are in `dist/`, including local video fallbacks. `package-lock.json` is included. `node_modules/` is ignored and is not a deliverable.

## Validation

A real TypeScript/Vite production build passed. Chromium with Playwright checked the production output at the configured subpath at 1440×1000 and 390×844.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script starts and stops a temporary Vite preview server. It checks two-section structure, font loading, video decoding and autoplay, video fade/restart, navigation, dialog open/close and Escape, clipboard output, mobile CTA, responsive grid, trust-bar fit, overflow, script errors, and failed asset requests. All 20 checks passed. No script or console errors and no failed asset loads were observed. Chromium canceled two video range requests (`net::ERR_ABORTED`); successful 206 responses and video decoding were verified and cancellations are recorded separately.

Screenshots were captured from the rendered page and visually reviewed:

- `screenshots/desktop.png` — 1440×1000 hero.
- `screenshots/mobile.png` — 390×844 hero.
- `screenshots/desktop-capabilities.png` — desktop second section.
- `screenshots/mobile-capabilities.png` — mobile second section.
- `screenshots/browser-checks.json` — machine-readable browser evidence.

Background videos are paused at three seconds only for stable screenshots; normal page playback remains automatic.

## Assets and scope

Google Fonts are loaded through the specified `index.html` link. Both font families loaded successfully. Both exact supplied CloudFront video URLs are used as primary sources and returned successful partial-content responses. Identical video files in `public/assets/` provide local fallbacks if the remote video errors. All local URLs respect the configured production subpath.

The navigation stays within the two-section page: Work links to Design, Studio/Services to Capabilities, and Journal to Growth. Contact and Start a Project open an accessible native dialog; Watch Showreel opens the supplied hero film with native playback controls. No separate portfolio, journal page, or additional page sections were introduced.

The prompt supplies no contact address, submission endpoint, or separate showreel asset. The project dialog therefore creates and copies a local brief, clearly indicating that nothing is submitted. Clipboard copying needs localhost or HTTPS. There is no backend or delivery integration. Google Fonts remain an external dependency. Video autoplay depends on browser policy; the atmospheric videos are muted and inline.

On narrow screens, Capabilities grows beyond one viewport to accommodate the three stacked cards, as specified by `min-h-screen`. Reduced-motion preferences suppress text transitions and smooth scrolling. No deployment or push was performed. `ready` means ready for review.
