# Disruptor Beta Launch

A responsive Neo-Brutalist landing page built from this project's `PROMPT.md`. Project ID: `community-superdesign-disruptor-beta-launch`.

React 19 + Vite 6, plain CSS, local Ranchers, Space Mono, Plus Jakarta Sans (including an italic face), and Archivo fonts. The page includes the fixed desktop section rails, volt hero, illustrated engine sticker, testimonials, comparison grid, process blueprint, live countdown, FAQ, and two email forms. Artwork and avatars are original inline SVG; the page is real DOM, not a reference screenshot.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

Open the Vite URL with the configured base path: `/motionsites-results/community-superdesign-disruptor-beta-launch/`.

On the provided Docker host, from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` contains the complete static deliverable, including `dist/index.html` and all font assets. Serve it under the base path above. No deployment was performed. `package-lock.json` pins dependencies; `node_modules` is excluded.

## Browser verification

The repeatable check serves the production build at its actual base path and launches the image's Chromium through Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

- Desktop: 1440 × 1000. Mobile: 390 × 844.
- Additional horizontal overflow checks: 320, 768, and 1024 pixels wide.
- Checks local font loading, script errors, failed requests, header CTA focus, required/invalid email rejection, valid submissions, duplicate handling, both forms, FAQ expansion/collapse, desktop section navigation, and the ticking countdown.
- Visually reviewed desktop/mobile viewport screenshots and complete desktop/mobile pages. Motion respects `prefers-reduced-motion`.
- Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, full-page variants, and `screenshots/browser-report.json`.
- Final dependency installation reported zero vulnerabilities.

## Asset provenance and limits

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-disruptor-beta-launch.webp` was absent. Composition and artwork were created from the written prompt, so direct reference-image matching could not be verified. No other designs were read.

Fonts were obtained from Google Fonts (the original normal-face CSS is recorded in `font-source.css`; italic source in `public/fonts/italic-source.css`), downloaded from fonts.gstatic.com, and served locally. All four SIL Open Font License files are included in `public/fonts/`. No external runtime assets are required. Initial Python font retrieval stalled; bounded curl downloads recovered all required files, subsequently verified in Chromium.

This is a frontend build. Waitlist emails are stored only in browser localStorage, with an explicit device-local confirmation and FAQ explanation; there is no mailing provider or shared registration backend. The countdown is a per-browser demonstration of the next beta wave, initialized about three days ahead and persisted locally, not a confirmed release date. Testimonials and illustrated people are sample launch content. Real registrations, release scheduling, and verified endorsements would need production content/services.
