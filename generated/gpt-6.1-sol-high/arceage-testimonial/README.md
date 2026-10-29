# Arceage Testimonial

A responsive Acreage Ag customer feedback section implemented from `PROMPT.md`. It uses React 19, Vite 6, Tailwind CSS v4 with its Vite plugin, Motion (`motion/react`), and Lucide icons. The three supplied testimonials include directional carousel transitions, scroll-triggered character reveals, animated dividers, and author transitions.

## Run and build

With Node 22 and npm available:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base URL is `/motionsites-results/arceage-testimonial/`. Open that path when using the development or preview server. Publishable static files are in `dist/`, including `dist/index.html`. No deployment was performed.

The build used the provided Docker image because the host has no Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` records the resolved dependencies. `node_modules/` is ignored and is not part of the deliverable.

## Browser verification

The reproducible check serves `dist/` under the required subpath and runs real Chromium through the image's installed Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

Checked desktop 1440×1000 and mobile 390×844. Verified all three authors and avatar loads, forward wraparound, backward wraparound, keyboard Enter activation, and no horizontal overflow. Font loading, console errors, runtime errors, failed requests, and failed HTTP responses are recorded in `screenshots/checks.json`. Screenshots were visually inspected:

- `screenshots/desktop.png`
- `screenshots/mobile.png`

## Assets and limitations

The exact Google Fonts import and all three supplied Picsum avatar URLs are retained. Barlow and all avatars loaded during browser verification. These assets require network access; their future availability and Picsum content are controlled by their providers. Instrument Serif is defined globally as requested and unused in this section. The black area below the white section follows the specified black page wrapper.

Vite emits nonfatal warnings that Motion's package-level `use client` directives are ignored during bundling. The build completes and the client-side animations work in Chromium. Verification covers the two requested Chromium viewports; other browser engines were not tested.
