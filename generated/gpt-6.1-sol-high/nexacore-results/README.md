# NexaCore Results

Design ID: `nexacore-results`. Static React + TypeScript + Tailwind CSS v3 implementation of `PrecisionSection`, following `PROMPT.md`. Includes the exact copy, inline SVG badge, Mazzard H regular/medium, gradients, absolute desktop staircase, and alternating mobile layout. Tailwind's `sm` breakpoint is 640px. No state, animations, hover styling, scroll effects, or interactive controls.

## Build and run

With Node 22.12+:

```sh
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/nexacore-results/` on the development server. Vite's base is fixed to that path. Publishable files are in `dist/`, including `dist/index.html`. No deployment was performed.

The workspace build uses the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

TypeScript and the production build passed. The final dependency installation reported zero audit vulnerabilities. Chromium/Playwright tested actual `dist/` files at the configured subpath:

- 1440×1000: four pillars rise from left to right.
- 390×844: four pillars alternate left/right; the last item is reachable by scrolling.
- 639px uses mobile; 640px uses desktop.
- All sizes: no horizontal page overflow, console/script errors, failed requests, animations, or interactive controls. Images and both font weights loaded.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Full-page mobile capture extends beyond its 844px viewport. Detailed results: `screenshots/checks.json`. Re-run:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

This script starts a temporary local HTTP server inside the container and closes it after verification. Chromium and Playwright are provided by the image.

## Assets and limits

The supplied background, logo and WOFF2 URLs all returned valid original files. Unchanged copies are in `public/assets/` and `dist/` for reliable local loading. The only asset-reference adjustment is using these local copies; original font URLs remain as fallbacks in `src/index.css`. `asset-sources.json` records sources and SHA-256 hashes. No recovery, substitutions, preview extraction, or approximated graphics were needed. Only this project's reference preview was viewed for comparison; it is not a page asset.

Verification used Chromium only. Geometry and background cropping follow the specified fixed/vw values, including desktop at 640px. The lockfile is included; generated dependencies are excluded. Status `ready` means ready for review, not published.
