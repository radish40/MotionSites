# AKOR Security

React + Tailwind CSS + Vite implementation of **AKOR — Intelligent Security Systems**, design ID `akor-security`. The page includes the fixed navigation, full-screen video hero, inverted services grid, and video About section from `PROMPT.md`.

## Build and run

Requires Node.js 22 and npm, or the available Docker image. All commands run from this directory.

```bash
npm ci
npm run build
npm run dev
```

On this host, use:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`. The configured resource and page base is `/motionsites-results/akor-security/`. To preview, run `npm run preview` and open that path. No deployment was performed.

## Assets

Both original MP4 videos, all four original service PNGs, and Google Fonts Sora weights 300/400/500/600/700 are downloaded into `public/assets/` and included in the build. The browser needs no third-party asset requests. `asset-report.json` records exact source URLs and download sizes. `scripts/fetch-assets.py` reproduces downloads using IPv4 curl; Python's original network requests stalled. For the three Higgs proxy image URLs, their encoded original CloudFront URLs were used to retrieve the exact original PNG files.

The optional reference `/home/opc/motionsites/assets/previews/akor-security.webp` was absent. No screenshot extraction, replacement media, or reference-page embedding was used. An unused CSS illustration is available only as a video error fallback. Service descriptions and the mission paragraph were written to match the specified subject because the prompt did not supply their exact text.

## Validation

The production build was executed inside `louislam/uptime-kuma:2`. Chromium checks use `/app/node_modules/playwright-core` against an HTTP server that serves `dist/` at the specified subpath and supports video range requests:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Desktop **1440×1000** and mobile **390×844** were checked for script errors, failed HTTP assets, horizontal overflow, all five font weights, video loading/playback, navigation, inquiry dialogs, required-field validation, confirmation, and keyboard dismissal. See `browser-checks.json`. Full-page screenshots are saved as `screenshots/desktop.png` and `screenshots/mobile.png`.

## Interaction scope and limits

Services and Learn More lead to the services section; About Us leads to About. Projects links to the solutions grid and Team links to the company copy, keeping the four requested sections without inventing additional project or team content. Contacts, Get Quote, and Get Consultation open accessible inquiry dialogs. The form validates locally and explicitly states that it does not transmit requests; no backend was provided. Browser visibility optimizations pause the offscreen About video and resume it when visible. Autoplay remains subject to browser preferences. Reduced-motion preferences disable the decorative entrance animation and smooth scrolling.

The optional visual reference was unavailable, so comparison was made against the written specification. Validation covers Chromium at the requested viewport sizes, not a full cross-browser matrix. `ready` in `result.json` means ready for review, not published.
