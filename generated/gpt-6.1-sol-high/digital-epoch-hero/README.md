# Digital Epoch

A React + TypeScript landing page built from this project's `PROMPT.md`. Uses Tailwind CSS v4, Motion, Lucide React, clsx, and tailwind-merge. The hero keeps the specified 600px height, original video URL without overlays, typography, floating navigation, and eight duplicated logo cards in a seamless CSS marquee.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/digital-epoch-hero/`. Vite uses this exact base path; `dist/` contains the deployable static build. No deployment was performed.

On this host, use the provided existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script temporarily serves the real production build at the required subpath and checks Chromium at 1440×1000 and 390×844. It saves `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`. Checks cover the 600px hero, horizontal overflow, loaded Inter/Outfit font weights, all 16 rendered logo images, active video playback, contact dialog and form validation, Docs panel, Escape dismissal, navigation, hover gradients, marquee pause/resume, and reduced-motion behavior. Screenshots were also visually inspected. No runtime JavaScript errors were observed.

## Assets and limitations

- The original CloudFront MP4, all eight `https://svgl.app/library/…` SVGs, and the exact specified Google Fonts CSS import are used directly. External resources require network access. No substitute imagery or screenshot-backed layout is used.
- Chromium recorded aborted video range requests while continuing successful playback (`readyState: 4`, positive playback time, 1920×1080 source). These are retained in the browser report rather than hidden.
- The optional reference file `/home/opc/motionsites/assets/previews/digital-epoch-hero.webp` was absent. Construction follows the complete written specification; no visual reference asset was extracted.
- On narrow screens the video crop shifts toward its light area for text readability. No overlay is added. Reduced-motion preference pauses the video and CSS marquee.
- No contact destination or documentation URL was supplied. Contact opens an accessible native dialog and prepares an email in the visitor's mail app, explicitly requiring a recipient. There is no backend or claimed delivery. Docs opens a clearly labeled preview notice; Products scrolls to the ecosystem strip. External mail delivery was not tested.
- Verification uses headless desktop Chromium with the requested viewports; physical mobile devices and other browser engines were not tested.

`package-lock.json` is included. `node_modules/` is excluded from the handoff.
