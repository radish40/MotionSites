# Nexora Features

Design ID: `nexora-features`. A responsive Nexora Features section implemented from `PROMPT.md` with TanStack Start, React, TypeScript, Vite, and Tailwind CSS v4. The page lives in `src/routes/index.tsx`; global tokens and the exact glass-button CSS live in `src/styles.css`.

The original four MP4s are bundled without edits in `public/videos/`. Their source URLs, byte sizes, and SHA-256 hashes are recorded in `asset-sources.json`. Videos autoplay muted, loop, and fill each card at full opacity without overlays. The only UI animation is the specified button hover scale of 1.02.

## Run and build

Use Node 22.12+ and npm. Dependencies are pinned by `package-lock.json`.

```bash
npm ci
npm run dev
npm run build
npm run check
npm run preview
```

Open `http://localhost:3000/motionsites-results/nexora-features/` for the static preview. The dev server uses Vite's default port 5173 and the same path. `npm run build` prerenders the TanStack Start route and packages its static output directly into `dist/`, including `dist/index.html`, JS, CSS, and all four videos. No production Node server is required. Vite base and router basepath are configured for `/motionsites-results/nexora-features/`.

In the provided environment, Node and Chromium are available through the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && npm run check'
```

## Browser verification

Real headless Chromium checks use the image's installed Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs > preview.log 2>&1 & preview_pid=$!; trap "kill $preview_pid" EXIT; sleep 1; node scripts/browser-check.cjs'
```

Verified at desktop 1440×1000 and mobile 390×844: four cards and video playback, advancing video times, muted/loop/inline/autoplay attributes, full opacity, desktop grid proportions, mobile single-column sizing, no horizontal overflow, button hover scaling, pointer/touch/keyboard activation, and no JavaScript errors or failed requests. Detailed measurements are in `browser-checks.json`. Build and browser output are in `build.log` and `browser.log`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. These are full-page captures at the required viewports. The check pauses and seeks videos to 1.5 seconds only for consistent screenshots, after verifying normal playback. Visually inspected both screenshots.

## Limits and design decisions

- The optional original reference WebP was absent at its specified location; fidelity was checked against the complete written prompt. No substitute images or extracted reference material were needed.
- The required system font stack is preserved. Helvetica Neue is platform dependent; Chromium on Linux uses an available fallback. No external font request is made.
- The prompt gives no click destination or application workflow for “Start Using Nexora.” Buttons retain the specified visual, hover, and native button behavior; no additional feature or destination is invented.
- Mobile card heights follow the exact content-driven classes from the prompt, including the compact fourth card.
- Chromium desktop and mobile emulation were tested; physical iOS/Safari was not tested.
- Output is ready for review and has not been deployed or pushed.

Framework setup follows the official [TanStack Start guide](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) and [static prerendering documentation](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).
