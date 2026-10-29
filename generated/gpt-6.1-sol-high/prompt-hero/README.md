# PROMPT

Design ID: `prompt-hero`. A full-screen fashion archive for **prmpt**, implemented from the local PROMPT.md. The deliverable is a static site at `/motionsites-results/prompt-hero/`; `dist/index.html` is its entry point.

React 19, TypeScript, Vite 6, Tailwind CSS 4 with the Vite plugin, GSAP 3.15 / ScrollTrigger / @gsap/react, and Motion 12. Inter Tight weight 500 is downloaded from Google Fonts and bundled locally. Both supplied CloudFront videos and all ten supplied Higgs gallery images are stored in `public/assets/`. Original URLs and download results are in `asset-report.json`.

The desktop hero scrubs opposite videos from the cursor position, waits for pending seeks, and retains the active side in the center dead zone. Touch devices alternate video playback. Scroll raises the black panel, moves and scales the scattered archive grid, and reveals the white outro. The layout uses two, three, or four columns. Reduced motion disables video playback and entry animation and removes card scaling.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/prompt-hero/` on Vite's local server. The dependency lockfile is included. No deployment is required.

On the provided host, build using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The real production build was served with `scripts/serve.cjs` and tested using the image's Chromium and playwright-core. To reproduce the checks within that image:

```sh
node scripts/serve.cjs &
node scripts/check.cjs
```

The script expects the project mounted at `/work`. It checks the actual nested publication path, not the Vite development server. Results are saved in `browser-checks.json` and asserted before success:

- Desktop 1440 × 1000: paused initial videos, cursor scrubbing in both directions, zero-time center dead zone, four gallery columns.
- Touch mobile 390 × 844: automatic playback, alternating videos after an ended event, playback resumes after scrolling back, two columns.
- Both sizes: decoded videos, all gallery images loaded, Inter Tight loaded, panel halfway and fully raised, white outro and footer visible, no horizontal overflow, no console/script errors or failed requests.
- Reduced-motion touch context: videos remain paused.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`, with supplementary gallery and outro views for each size. Hero, gallery, and outro captures were visually reviewed.

## Scope and limitations

Navigation, cart, and the view pill retain the prompt's non-interactive `pointer-events: none` behavior; no destination or shopping flow was specified. The wordmark and cursor are original inline SVG paths because the prompt describes their form without supplying vector path data. The videos, photographs, exact caption, collection text, and price use the supplied content. Touch verification uses Chromium emulation, not a physical device; browser autoplay policies may vary.

All assets are available locally. An initial Python HTTPS download attempt stalled; downloading the same supplied URLs using curl succeeded. No unresolved asset issues remain. Nothing was pushed or deployed.
