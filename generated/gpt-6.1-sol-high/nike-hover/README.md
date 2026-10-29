# Nike Hover

Design ID: `nike-hover`. A single full-height Nike section built with React, TypeScript, Tailwind CSS v4, Vite, and GSAP. `react-player` and `gsap` are installed as requested; the reveal uses the prompt's native video element. All copy, SVG chart, Nike mark, glass card, six-circle SVG mask, and responsive layouts are live DOM elements.

The desktop spotlight follows the pointer using the specified 0.2/0.35 easing. Two invisible hover zones control playback. Mobile uses muted autoplay, a full-area touch zone, a 280px spotlight, and vertically stacked content. Desktop uses the specified 520px radius and positions. GSAP animates the initial text/card entrance and respects reduced-motion preferences.

## Run and build

Requires Node 22/npm (or the provided Docker image).

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite's configured base is `/motionsites-results/nike-hover/`. The complete static deliverable is `dist/`, including `dist/index.html` and local artwork/video assets. Open the configured subpath when running the development or preview server.

Build in the supplied environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

Real Chromium browser checks run against the production files under the exact configured subpath, using the supplied image's Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script starts a temporary internal HTTP server and closes it after checking desktop 1440×1000, mobile 390×844, and tablet 768×1024. Results are in `screenshots/browser-checks.json`. Checked viewport height, document dimensions, content bounds, Google font loading, video readiness, desktop hover play/pause for both zones, advancing playback time, mobile autoplay, touch coordinates, script errors, and failed requests. Desktop and mobile have no document overflow. Browser errors and failed requests were empty.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/desktop-hover.png`
- `screenshots/mobile.png`
- `screenshots/tablet.png`

## Asset recovery and limitations

The exact supplied PNG URL returned HTTP 404. The equivalent raw GitHub URL, repository URL, and jsDelivr mirror also returned 404. The supplied signed MP4 returned HTTP 403; the unsigned URL also returned 403. The original MP4 could not be recovered, so its precise motion cannot be verified.

The authorized reference `/home/opc/motionsites/assets/previews/nike-hover.webp` is a single-frame 640×472 WebP. Its project-local copy is `scripts/source-reference.webp`. `scripts/recover-assets.cjs` uses Chromium Canvas and manually traced clipping paths to isolate the shoe and rocks. It excludes all reference text, chart, label, Nike logo, and cursor. The top rock is slightly repositioned to align its occluded area with the live desktop card. The artwork beneath the original card and label cannot be fully recovered; those regions are omitted. The resulting assets are `public/assets/rocks.png`, `shoe.png`, and `overlay.png`. The overlay is a freshly composed background made only of the isolated artwork on a plain dark field; it contains no page text or controls.

The recovery script also records a six-second local VP9 WebM using MediaRecorder, with subtle shoe/rock drift and orange ambient light. This is an approximation of the unavailable original video, not a recovery of its frames. The real HTML video plays behind the real SVG mask. Recovered artwork is limited by the reference resolution, so large displays appear softer than the missing original PNG. Mobile and tablet crop the scene toward the shoe to preserve the focal subject.

To regenerate the local artwork and approximate video:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/recover-assets.cjs'
```

The exact requested Google Fonts import remains in `src/index.css`. Both families loaded successfully during browser checks; runtime font loading requires access to Google Fonts. No deployment or push was performed. `ready` means ready for management-session review.
