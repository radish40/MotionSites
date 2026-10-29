# Travel Journal

React + TypeScript mobile travel UI built with Vite, Tailwind CSS, and Lucide React. The page follows `PROMPT.md`: white centered wrapper, dark 375 × 780 phone, Dynamic Island, blurred header, four 200px destination cards, liquid-glass controls, clipped 96px destination names, and timed staggered entrance animations.

The phone scales to 94% on narrow screens to keep its bezel visible. Content scrolls within the phone; the header and navigation stay fixed. Reduced-motion preferences disable transition duration.

## Run and build

Requires Node 22 and npm, or the provided Docker image. All commands run from this project directory.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

For the host environment without Node:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The release files are in `dist/`, including `dist/index.html`. Vite is configured for `/motionsites-results/travel-journal/`. Open that path when using the development or preview server. No deployment was performed.

## Assets

All four photos are downloaded from the exact supplied image URLs, with source mappings in `public/assets/sources.json`. The supplied assets show a mountain, green hills, desert dunes, and purple hills, respectively; they are intentionally retained under the prompt's Tokyo, Seoul, Bali, and Rome labels.

The requested Google Fonts links remain in the HTML head. Local copies of Inter weights 300–900 are also bundled and used through a later font stylesheet, so the design does not depend on the font service being available. All photos and fonts loaded successfully during the final browser checks.

## Validation

Production compilation and TypeScript checking passed. The reproducible Chromium check uses the image's existing Playwright installation, serves `dist/` under the required subpath, and checks 1440 × 1000 desktop and 390 × 844 mobile layouts:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

Checks cover successful document loading, four loaded images, loaded Inter, completed card entrances, card height, page overflow, region and calendar panels, Escape dismissal, favorite toggling, navigation selection, and scrolling to Rome. Final run: zero console/script errors and zero failed requests.

Screenshots were visually inspected:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-scrolled.png`
- `screenshots/mobile-scrolled.png`

Detailed measured results: `screenshots/browser-report.json`.

## Scope and limitations

This is a UI mockup with local component state. Controls expose lightweight preview panels; favorites reset on reload. No authentication, travel data service, or persistent account system is connected. Asia remains the specified default header, including when Rome is visible. The original fixed phone dimensions are retained internally while scaling on smaller viewports. `node_modules/` is excluded from delivery; install using the saved lockfile.
