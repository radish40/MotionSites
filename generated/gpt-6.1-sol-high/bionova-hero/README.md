# Bionova Biotech

Design ID: `bionova-hero`. A responsive BIONOVA biotech consulting hero built with React, Vite, Poppins, and hls.js. The desktop hero occupies exactly 100vh; mobile uses a scrollable single column. Includes the requested three animated video cards, headline image pill, navigation, partner wordmarks, and fade-up entrance animation.

## Run and build

Requires Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

This host uses the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/bionova-hero/`. Serve the output at that path. No deployment was performed.

## Validation

Run the production browser checks with the provided Chromium and Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

The script starts a temporary HTTP server in the container and checks the production output at its configured subpath. Results are recorded in `screenshots/browser-report.json`. Screenshots are `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×844 viewport, full page).

Verified desktop height of exactly 1000px, mobile scrolling, no horizontal overflow, all three HLS videos playing without media errors, Google Poppins loading, no uncaught script errors or failed network requests, and contact/process/location dialogs on both viewports. Desktop navigation, login, call request, dialog close buttons and Escape dismissal were also verified. Both screenshots were visually reviewed. Safari native HLS fallback is implemented but was not tested in Safari.

## Assets and scope

- The three exact Mux HLS URLs from PROMPT.md are used in a single effect with three video refs, hls.js cleanup, and native HLS fallback. Videos autoplay muted, loop, play inline, and preload automatically.
- `public/assets/bioventure.jpg`, `locations.jpg`, and `scientists.jpg` are loading posters fetched from the corresponding original Mux thumbnail endpoints at time=1. The headline image pill reuses the isolated locations asset. No screenshot is used as page content.
- Poppins weights 400, 500, 600, and 700 are imported from Google Fonts. Font and streaming playback require network access; local posters remain visible while video loads or if streaming fails.
- The optional reference `/home/opc/motionsites/assets/previews/bionova-hero.webp` was absent. Implementation follows the complete written prompt. Unspecified descriptive copy and the image pill subject were composed from the design context; no extraction or replacement of unavailable video assets was necessary.
- CTA and navigation controls open accessible native dialogs. No live booking, authentication, article service, or backend was supplied. The contact email uses the reserved `.example` domain and is explicitly labeled illustrative in the UI.
- Vite reports the hls.js-containing JavaScript bundle exceeds its 500kB advisory threshold. The build completes successfully.

All project files were written within this directory. Dependencies are locked in `package-lock.json`; `node_modules/` is ignored and is not part of the deliverable.
