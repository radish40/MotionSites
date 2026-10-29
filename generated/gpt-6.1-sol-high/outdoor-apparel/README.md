# Outdoor Apparel

Design ID: `outdoor-apparel`. A single-page ALP1NE™ technical outdoor gear site implementing `PROMPT.md`. Vanilla HTML, inline CSS and JavaScript in `index.html`, served and built with Vite. Inter Tight is loaded from the exact Google Fonts stylesheet at weight 600.

The page includes the fixed scroll-scrubbed hero video, live local-time clock, responsive blurred navigation menu, animated bottom headline, olive brand statement with seven layered gear cutouts, and expanding clip-path reveal into four horizontal product cards. One requestAnimationFrame loop drives the visual animations. The menu supports keyboard focus, Escape, and closing when a link is selected.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/outdoor-apparel/` on the preview server. Vite's base is configured to this exact path. `dist/` is the complete static deliverable, including all twelve media assets. The dependency lockfile is included; `node_modules/` is ignored and is not part of the deliverable.

The task host provides Node and Chromium through Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For a temporary local preview, publish port 4173 from the container and run `npm run preview -- --port 4173`. This project has not been deployed or pushed.

## Verification

The production build was served with `scripts/serve.cjs`, including byte-range support for the video, and tested with the image's existing Playwright Core and Chromium. Reproduce from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/check.cjs'
```

The browser checks assert the page title, loaded font, paused/primed video, all eleven loaded images, changing clock, video scrubbing, headline fade, menu open and link-close behavior, four product transitions, reverse video seeking, and absence of script/network errors and horizontal document overflow. Viewports are desktop 1440×1000 and mobile 390×844. Parallax transforms and reveal clipping are recorded. Screenshots were also visually inspected.

Evidence: `browser-checks.json`, `asset-report.json`, and `screenshots/desktop.png` / `screenshots/mobile.png`. Additional screenshots show the menu, collage, collection, and final product on each applicable viewport. The final dependency install reported zero vulnerabilities.

## Assets and limits

All supplied media URLs were downloaded without substitutions into `public/assets/`; Vite copies them into `dist/assets/`. Original URLs and download results are recorded in `asset-report.json`. `scripts/download-assets.py` can refresh these copies from the prompt. An initial Python urllib attempt stalled; retrying with curl downloaded all assets successfully. The Google Fonts stylesheet remains external and loaded successfully in both browser checks.

Collection navigation scrolls directly to the first revealed product. Journal, About, and Press use anchors within the supplied brand statement because the prompt supplies no separate pages or editorial/press content. Instagram opens Instagram's public homepage because no brand account URL is supplied. The clock intentionally shows browser local time with the literal `(PST)` suffix, as requested.

Mobile testing uses Chromium device emulation, not a physical iOS device or Safari. The inline video attributes, play/pause priming, passive touch listener, and WebKit clip-path/backdrop-filter prefixes are implemented; physical Safari playback remains unverified. Animation frame rate depends on the device and video decoding performance.
