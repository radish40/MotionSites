# Kova Features

Design ID: `kova-features`. A faithful implementation of the supplied Kova Features section, built with React 18, TypeScript, Tailwind CSS 3, Framer Motion, and Lucide React.

The section includes the exact heading, four portrait cards, supplied imagery, SVG spending chart, Cooper fonts, responsive breakpoints, and scroll-triggered blur/fade animations from `PROMPT.md`. The Watch Demo button opens an accessible native dialog with a four-feature preview, previous/next controls, Escape dismissal, and focus restoration. No video was supplied, so this preview reuses the section content.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/kova-features/` on the preview server. The Vite base is configured for that path. `dist/` contains the complete static deliverable, including `dist/index.html` and local assets. No deployment has been performed.

On this host, Node/npm are provided through the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

For a local preview with that image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run preview -- --port 4173'
```

## Verification

The real TypeScript and Vite production build passes. Browser checks use Chromium and the image's preinstalled Playwright Core, serving only `dist/` under the required subpath:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node browser-check.cjs'
```

Verified at desktop 1440×1000, mobile 390×844, and tablet 768×1024:

- Correct four-, one-, and two-column layouts and 3:4 card proportions.
- No horizontal overflow or browser script errors.
- All three local images and both exact Cooper font families load.
- Scroll animations settle at full opacity and zero blur.
- Demo opens, advances through all four features, goes backward, closes with Escape or its close button, and resets on reopen.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-bottom.png`. The latter captures the lower mobile cards after scrolling. Machine-readable browser observations are saved to `screenshots/browser-report.json`.

## Assets and limits

The three exact Higgs image proxy links returned HTTP 403. The original CloudFront PNG URLs embedded in those links worked. Those exact images were downloaded, resized to 1280px wide, and converted to WebP at quality 85 to match the requested proxy parameters. Local images total approximately 622 KiB.

The two required external font stylesheet links remain verbatim in `index.html`. Local WOFF2 copies provide reliable rendering; the browser verified the Light face at weight 400 and Medium face at weight 500. Original provider stylesheets and source URLs are retained under `public/assets/`. Font attribution: [Web Fonts](http://www.onlinewebfonts.com/fonts); provider stylesheets declare CC BY 4.0. No substitute images or generated assets were used.

This is the requested standalone Features section. The chart is the specified static illustration. The demo is a feature preview, not an externally hosted video. Build dependencies are locked in `package-lock.json`; `node_modules/` is excluded from version control.
