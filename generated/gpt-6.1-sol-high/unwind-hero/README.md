# Unwind Hero

Design ID: `unwind-hero`. A WoodNest cabin hero built with React, Tailwind CSS, and Framer Motion. All source, assets, checks, and build output belong to this project. No deployment or push was performed.

The page includes the original cabin video, embedded PP Mori 400/600 fonts, responsive navigation, staggered entrance animations, the glass reservation card, both February/March 2025 date pickers, and the specified hover/tap effects. Video autoplays muted and inline without looping. The mobile page scrolls to accommodate the stacked content.

## Run and build

Use Node 22.12+ and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Production files are in `dist/`, including `dist/index.html`. Vite uses `/motionsites-results/unwind-hero/`; open that path on the preview server. All production assets are local and support this subpath.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`package-lock.json` pins the installed dependency tree. `node_modules/` is ignored and is not part of the deliverable.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

The check serves the real `dist/` files at the required subpath, using Chromium and `/app/node_modules/playwright-core` from the image. It checks 1440×1000 desktop, 390×844 mobile, 1545×997 reference, 768×1024 tablet, and 1024×768 small desktop viewports. Assertions cover font availability, decoded video, actual autoplay, muted/nonlooping playback, page overflow, date selections, outside-click/Escape dismissal, Book Now/Reserve date entry, cabin title editing, and mobile navigation.

Evidence:

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page captures at the required viewport sizes. The mobile image is taller than 844px because its content is stacked.
- `screenshots/desktop-calendar.png` and `screenshots/mobile-menu.png`: interactive states.
- `screenshots/checks.json`: machine-readable browser measurements and results.
- `build.log`, `browser-check.log`, `npm-audit.json`: build, check, and dependency audit output.

Screenshots show the actual DOM with the original video paused at 1 second for reproducibility. Production playback is not paused by this test behavior. Chromium may cancel an in-flight MP4 range request when seeking; these `net::ERR_ABORTED` events are recorded separately from unexpected request failures. Video decoding and autoplay are checked before capture. Browser validation is Chromium-only.

## Asset provenance and limitations

The starting directory contained only `TASK.md` and `PROMPT.md`. No original `src/styles/fonts.css` or existing SVG component was supplied.

- The exact specified [CloudFront MP4](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260620_140846_aef8cb19-5ec8-4b45-974b-020aed20f297.mp4) returned HTTP 200 and is preserved unchanged at `public/assets/evergreen.mp4`.
- PP Mori [regular](https://aesthetic.computer/assets/fonts/PPMori-Regular.woff2) and [semibold](https://aesthetic.computer/assets/fonts/PPMori-SemiBold.woff2) were recovered as WOFF2 files and embedded as data URLs in `src/styles/fonts.css`. Their identity against the missing original embedded font bytes cannot be verified.
- The WoodNest logo was reconstructed as an inline SVG with a PP Mori wordmark, orange geometric mark, and translucent gradient details using this design's reference. Its exact original vector paths were unavailable. Star, edit, calendar, chevron, and menu SVGs were recreated; exact path equivalence cannot be claimed.
- Only this design's `/home/opc/motionsites/assets/previews/unwind-hero.webp` was viewed for comparison. No page screenshot, reference video, or extracted screenshot background is used in the implementation.
- `scripts/recover-assets.py` reproduces downloads and font embedding. `asset-manifest.json` records URLs, sizes, and SHA-256 hashes.

No booking service or contact destination was supplied. Book Now and Reserve open date selection; they do not submit a paid booking. Navigation links target existing hero regions. The pencil enables inline cabin title editing, committed on blur/Enter. No extra marketing sections or checkout UI were added.

Framer Motion's `use client` directives produce nonfatal bundler warnings in this browser-only Vite application. The production build and browser execution are validated independently.
