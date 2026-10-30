# Power AI

Design ID: `power-ai`. A responsive, full-screen hero built with React, Vite, Geist Sans (`@fontsource/geist-sans`), General Sans from Fontshare, and Lucide icons. The original MP4 plays behind live DOM content, using a requestAnimationFrame-controlled 0.5-second fade at each end and a 100 ms pause before replay. The bottom marquee repeats all six specified brands every 20 seconds. Includes the specified liquid-glass treatment, center blur, gradient headline, navbar and buttons.

## Run and build

Requires Node 22/npm, or the supplied Docker image. All commands run from this project directory.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Production output is in `dist/`, including `dist/index.html`. The Vite base is `/motionsites-results/power-ai/`; serve that directory at that exact URL path.

Build using the available Docker environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser verification

A real production build was served in a temporary Docker container and checked with Playwright Core and Chromium. To repeat after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs & SERVER_PID=$!; node scripts/check.cjs; CHECK_STATUS=$?; kill $SERVER_PID; exit $CHECK_STATUS'
```

- Desktop: 1440×1000; mobile: 390×844.
- No horizontal or vertical overflow at either required size.
- No JavaScript errors or failed network requests in the completed run.
- Verified video decoding/playback (1764×1176, 14.042 seconds), opacity of 0.4 at 0.2 seconds from either end, and successful replay after ending.
- General Sans confirmed loaded; desktop headline is 220px.
- Verified animated marquee, all four navigation panels, mobile menu, both action dialogs, and Escape dismissal.
- Visually inspected `screenshots/desktop.png` and `screenshots/mobile.png`.
- Machine-readable evidence: `screenshots/checks.json`.

The test uses the provided image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. Reduced-motion users receive a stationary logo marquee. Dialogs use native modal behavior, keyboard focus containment, and return focus on close.

## Assets and limitations

The exact specified CloudFront MP4 was retrieved successfully and is self-hosted at `public/assets/power-ai.mp4`. No screenshot or reference video substitutes for the page DOM. The video has no gradient overlay; the specified centered blurred shape sits behind the content.

General Sans is imported from the exact Fontshare CSS endpoint in the prompt. Its original 400/500/600/700 WOFF2 files were also downloaded and registered locally so the headline can render when the external service is unavailable. `fontshare.css` preserves the source CSS. Geist is bundled from the required npm package. `scripts/recover-assets.py` reproduces video and font recovery.

The referenced `src/assets/logo.png` was not supplied. The optional Power AI reference preview at `/home/opc/motionsites/assets/previews/power-ai.webp` was also absent. A small original white “power” wordmark with an asterisk mark was created in `src/assets/logo-source.svg` and rasterized to the required `src/assets/logo.png` using `scripts/rasterize-logo.cjs`. This logo is an approximation; exact logo fidelity and comparison with the unavailable reference cannot be verified. No other design was used.

The prompt provides no navigation targets, registration endpoint, or scheduling service. Navigation buttons open local information panels; Sign Up and Schedule a Consult open accessible informational dialogs that clearly state availability is coming soon. No registration or booking is submitted or simulated. These panel/dialog contents are supporting copy, not additional page sections.

Status `ready` means ready for review, not deployed. No deployment, push, external messages, or agent delegation was performed.
