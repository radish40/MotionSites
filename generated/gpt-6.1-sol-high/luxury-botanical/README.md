# Luxury Botanical

Design ID: `luxury-botanical` · Page title: **Bentley — Beyond The Collection**.

A working implementation of the supplied `PROMPT.md`, using React 18.3.1, Framer Motion 11.18.2 and Tailwind CSS 3.4.17. Vite compiles the original JSX and utility styles into static files. The design includes the original botanical video, elliptical white reveal, six orbiting fragrances, scroll-driven focus and labels, blur entrances, newsletter artwork, and cream footer. Mobile spacing and reveal coverage are adapted for narrow screens.

All supplied media and the Instrument Serif, Manrope and Great Vibes fonts are hosted locally. Their original URLs are recorded in `scripts/asset-report.json` and `scripts/font-sources.json`. No runtime CDN requests are required. Great Vibes is available as specified, though the supplied composition does not apply it to any visible text.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/luxury-botanical/`.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and its assets are ready to serve at `/motionsites-results/luxury-botanical/`. The configured Vite base also applies to media paths. No deployment or push was performed. The dependency lockfile is included; `node_modules` is excluded.

## Validation

The production build was loaded in real Chromium using the image's `playwright-core`. Tests cover desktop **1440×1000** and mobile **390×844**, six scroll positions, the shop and buy controls, required email validation, both forms, all images and fonts, decoded video, browser errors, failed requests, and horizontal overflow. Each check must pass for the browser script to exit successfully.

Run the browser checks in a Docker container that is serving the production preview:

```sh
npm run preview -- --port 4173 &
node scripts/browser-check.cjs
```

The browser script requires `/app/node_modules/playwright-core` and `/usr/bin/chromium`, available in `louislam/uptime-kuma:2`. Run it from `/work` with this project mounted there.

Evidence is in `screenshots/checks.json`, `screenshots/build.log`, and `screenshots/browser.log`. The required `screenshots/desktop.png` and `screenshots/mobile.png` show the hero; additional screenshots show the orbit, fragrance focus, newsletter, and footer. Video is paused at three seconds only during screenshot capture for reproducibility. Normal page playback is muted, looping and inline.

The build emits Framer Motion's upstream `use client` directive warnings; the production build succeeds. The dependency installation audit reported zero vulnerabilities.

## Scope and limitations

Shop and buy controls navigate to the fragrance showcase. No checkout or commerce backend was supplied. Both newsletter forms validate email and explicitly report that this preview does not send subscriptions. Footer destinations retain the prompt's placeholder links; no additional pages or third-party destinations have been invented.

The original image/title assignments are preserved, including duplicate Radiant Osmanthus image content in two supplied URLs and bottle-label/title mismatches (for example, the supplied Magnetic Amber entry uses a bottle labeled Mellow Heliotrope). These are source-material inconsistencies, not failed downloads. All eight supplied media URLs and all font downloads succeeded.
