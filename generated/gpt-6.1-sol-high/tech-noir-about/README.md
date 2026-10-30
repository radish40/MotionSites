# Tech-Noir About

Design ID: `tech-noir-about`. A single red About section built with React 19, TypeScript, Vite, Tailwind CSS v4 through `@tailwindcss/vite`, and `motion/react`.

The implementation preserves the supplied SVG, copy, typography, desktop/mobile spacing, full-width uncropped media, and 100px red gradient. Motion provides a brief entrance; reduced-motion users receive static content and paused media. There are no navigation links or buttons in the supplied design.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Production base: `/motionsites-results/tech-noir-about/`. The complete static deliverable is `dist/`, including `dist/index.html` and local media/fonts. Keep this base path when hosting.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` pins dependencies. `node_modules/` is ignored and is not part of the deliverable.

## Validation

The actual TypeScript/Vite production build passed. Chromium checks against `dist/` at the configured subpath passed at desktop 1440×1000 and mobile 390×844: no horizontal overflow, no JavaScript errors, correct solid red, local Manrope and Marck Script loaded, media decoded and autoplay advanced after scrolling into view, muted/loop/inline attributes present, and `object-fit: contain`. Reduced motion disables autoplay. Chromium may defer offscreen video playback until it enters the viewport.

Full-page screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; additional `*-viewport.png` files preserve the exact viewport captures. Full-page heights exceed the viewport because the supplied section scrolls. Detailed browser observations are in `screenshots/browser-checks.json`.

Reproduce the browser checks (temporary HTTP server is internal to the script):

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

## Asset recovery and limits

On 2026-10-30 the requested Cloudinary asset returned HTTP 401 with `x-cld-error: cloud_name daklr2whx is disabled`:

`https://res.cloudinary.com/daklr2whx/video/upload/v1778602552/track-video_2_s9lp53.mp4`

The versionless URL also returned 401. The original media could not be recovered. The only supplied reference, `/home/opc/motionsites/assets/previews/tech-noir-about.webp`, is a single 640×470 image. Its visible bottom artwork was isolated from rows 345–469, with the red backdrop removed by a color mask. This crop contains no page logo, paragraphs, signature, or controls. Its small tracking annotations are intrinsic to the artwork.

`recovery/reference.webp` stores that design's source solely for reproducibility; it is not shipped in `dist/`. `scripts/recover-assets.cjs` creates the isolated PNG, a red poster, and a six-second 1280×320 WebM with a very subtle scale cycle. The page uses this local WebM as its fallback. All page typography and layout remain actual DOM. No page screenshot is rendered by the application.

The original duration, motion, full artwork below the reference boundary, and native aspect ratio cannot be verified. The substitute's 4:1 ratio, subtle motion, masking, and low-resolution detail are approximations; its lower artwork remains limited to what the reference shows. Original video fidelity is therefore not claimed. Replace the local source with the original MP4 once its host is restored.

The required Google Fonts import remains in `src/index.css`. Local copies of the exact requested fonts from Google's font servers are included for reliable rendering. Italiana and Manrope 600 are available but unused by this design's visible text. No external images are needed at runtime.

No deployment or push was performed. `ready` means ready for review with the documented media limitation.
