# Integration SaaS

Design ID: `integration-saas`. A single full-screen DataVio hero built with React, Tailwind CSS, Vite, Geist, and lucide-react. Implements the specified CloudFront video, responsive gradients and video positioning, typography, CTA links, Pexels avatar pill, and animated mobile navigation.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Visit `/motionsites-results/integration-saas/` on the preview server. Vite's base is set to this path. The publishable static output is `dist/`, including `dist/index.html`.

On this host, Node/npm and Chromium are provided by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The test starts a temporary HTTP server for the actual `dist/` build at its required subpath and uses headless Chromium through the image's playwright-core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.mjs'
```

Checks cover desktop 1440×1000 and mobile 390×844; fullscreen sizing and horizontal overflow; actual font, avatar, and video loading; muted autoplay; the mobile menu, scroll lock, close button, backdrop dismissal, Escape, focus trapping/restoration, and navigation closure. Browser console/script errors and failed asset requests are recorded in `screenshots/browser-checks.json`. Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`.

## Scope and limitations

- Exactly one hero; no additional page sections or backend.
- The brief supplies no destination URLs or authentication/integration/scheduling services. Navigation and CTA links are named hash placeholders for later wiring; they do not provide product or account workflows.
- Video, avatars, and font use the exact external services requested and require internet access. They loaded in browser verification. Chromium can cancel video range requests with `net::ERR_ABORTED` while the video continues playing; the test records these separately from asset failures and verifies playback independently.
- The remaining paragraph copy was composed around the exact supplied bold phrases because the prompt does not specify its complete wording.
- The hero uses a stable mobile viewport height; very short screens have a minimum height to preserve readable content.
- No deployment or push was performed. `ready` means ready for review.
