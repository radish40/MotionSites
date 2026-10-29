# Prosthetics Hero

Design ID: `prosthetics-hero`. A single React + TypeScript + Tailwind CSS hero built with Vite. The complete page, inline SVG logo, and React entry point live in `src/App.tsx`. The implementation follows the supplied copy, classes, breakpoints, colors, video URL, and micro-interactions. No additional sections or routing are included.

## Build and run

With Node.js 22 and npm available:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/prosthetics-hero/`. Vite's base is `/motionsites-results/prosthetics-hero/`. The publishable output is in `dist/`, including `dist/index.html`. The dependency lockfile is included; `node_modules/` is ignored.

This host uses the existing Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Browser verification

The real production build was served with Vite preview and tested in Chromium via the image's existing Playwright installation. Reproduce the checks and screenshots with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173 > /work/screenshots/preview.log 2>&1 & PREVIEW_PID=$!; trap "kill $PREVIEW_PID" EXIT; node scripts/check-browser.cjs'
```

Passed at desktop **1440 × 1000** and mobile **390 × 844**:

- Video loads, decodes, autoplays, advances in time, and has muted, looping, inline playback enabled.
- Exact headline and four navigation links render.
- No horizontal or vertical viewport overflow.
- CTA background/text hover colors and both arrow translations match the prompt.
- Navigation hover colors, anchor clicks, and keyboard focus work.
- No page errors, console errors, or failed requests in the final run.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and machine-readable `screenshots/browser-checks.json`. Screenshots freeze the real video at two seconds after playback verification for reproducibility; the delivered page plays continuously. Both screenshots were visually reviewed.

## Assets and limits

The exact CloudFront video specified by the prompt returned HTTP 200 and played successfully (3836 × 2160, approximately 8.04 seconds). It remains an external dependency. No recovery or extracted assets were necessary. The project's own supplied reference WebP was viewed only as a visual reference, not used as page content. The logo is the prescribed SVG; the favicon derives from the same path. Fonts use Tailwind's system sans-serif stack, with no external font requests.

Navigation, badge, and fitting anchors use `href="#"` because the prompt supplies no destinations or fitting flow. They are keyboard accessible placeholders. The prescribed centered `object-cover` video crop overlaps the bottom-left text on narrow screens, reducing contrast during some frames; exact requested layout and styling were retained. Browser checks cover Chromium at the two requested viewport sizes, not physical devices or other browser engines.

Status `ready` means built and ready for review. No deployment or push was performed.
