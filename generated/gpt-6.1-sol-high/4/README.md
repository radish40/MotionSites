# Datacore SaaS Hero

Design ID **4**. A responsive, full-screen Datacore hero built with React, Tailwind CSS, Lucide React, and hls.js. The page uses the specified copy, colors, Google Fonts, Mux stream, and a 60% black overlay. Fonts are imported through CSS: Manrope for body copy, Inter for headings, Cabin for buttons and badges, and italic Instrument Serif for “Interface”.

## Run and build

With Node 22 and npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The development and preview page is at `/motionsites-results/4/`. Vite's base is set to that exact publication path. The complete static build is in `dist/`, including `dist/index.html` and the bundled poster. No deployment has been performed.

This host uses the provided Docker image for Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The lock file is included. `node_modules/` is a local, ignored installation and is not a delivery artifact.

## Behavior

The background uses native HLS when supported and a separate, lazily loaded hls.js light bundle otherwise. It autoplays muted, loops, and plays inline. The local poster remains visible until the video emits `playing`, then fades out. Playback rejection and fatal stream failure preserve the poster; recoverable network/media failures have bounded recovery. Reduced-motion users see the still image.

Desktop Services opens a popover with access, logs, and server information. Mobile navigation is a full-screen black overlay with focus trapping, Escape dismissal, and scroll locking. Dialogs support keyboard dismissal and native focus management. Buttons have visible keyboard focus and hover feedback.

Only the hero was requested. No backend, booking URL, account service, customer reviews, or contact destination was supplied. CTA/navigation dialogs explicitly disclose the preview state; they do not collect data or pretend to book, authenticate, or submit requests.

## Asset recovery

- Original stream: `https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8` — reachable and played in Chromium.
- Original poster: `https://customer-cbeadsgr09pnsezs.cloudflarestream.com/257c7359efd4b4aaebcc03aa8fc78a36/thumbnails/thumbnail.jpg` — returned HTTP 404 on 2026-10-30.
- Replacement: a clean 1920×1080 frame at time zero from the **same Mux video**, saved as `public/assets/video-poster.jpg`. Reproduce with `sh scripts/recover-poster.sh`. It contains only the abstract video artwork, with no webpage text or controls. The original Cloudflare poster's exact frame cannot be confirmed.
- The optional reference `/home/opc/motionsites/assets/previews/4.webp` did not exist. Implementation follows the full written prompt; no other designs were read.
- Google Fonts and live streaming require network access. Poster fallback is bundled locally; system fonts provide a fallback if Google Fonts is unavailable.

## Verification

A real Vite production build passed. The final build has separate application and HLS bundles with no size warnings. npm reported zero vulnerabilities during installation.

The repeatable Chromium check runs against the production preview using the Playwright already installed in the supplied container:

```sh
# Terminal 1
 docker run --rm --name datacore-4-check -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
# Terminal 2
 docker exec datacore-4-check node scripts/check.cjs
```

Checks include desktop 1440×1000, mobile 390×844, overflow at 320/375/768/1024/1920px, actual video playback, font loading, all desktop CTA dialogs, service navigation, mobile menu open/close/Escape/contact navigation, reduced-motion behavior, unavailable-stream fallback, and uncaught script errors. Results are saved in `screenshots/browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`

The animated background means frames vary between captures. Safari native HLS and Firefox were implemented through supported playback paths but were not directly browser-tested; the available test browser is Chromium. No backend integrations are included.
