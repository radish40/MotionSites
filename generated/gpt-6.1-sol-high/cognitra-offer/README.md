# Cognitra Offer

Design ID: `cognitra-offer`.

A faithful implementation of `PROMPT.md`: a gray, full-viewport AI services section with the exact heading, copy, three supplied looping video assets, and staggered Framer Motion reveals. At widths up to 900px the heading stacks and the cards form a single column with natural vertical scrolling.

Built with React 18, TypeScript, Vite 6, Tailwind CSS 3, and Framer Motion 12. All source, configuration, assets, verification output, and build files are contained in this project.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL path is `/motionsites-results/cognitra-offer/`. The distributable static site is `dist/`, including `dist/index.html`; serve it at that path.

The host used for this task has no Node installation. The actual build was executed using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

A dependency lockfile is included. Use `npm ci` for subsequent reproducible installs. `node_modules/` is ignored and is not a deliverable.

## Browser verification

After building, run:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

This runs a temporary HTTP server serving the actual `dist/` output at the configured subpath and uses the image's Playwright Core and Chromium. It checks desktop 1440×1000 and mobile 390×844, card reveals while scrolling, advancing video playback, muted/loop/inline attributes, loaded font, card count, background color, desktop viewport height, horizontal overflow, reduced-motion text visibility, script errors, HTTP errors, and failed requests.

Results: all assertions passed. No script errors, HTTP errors, or failed requests were recorded. Desktop content fits the 1000px viewport; mobile content naturally scrolls to about 1748px. Screenshots were visually inspected.

- `screenshots/desktop.png`: desktop screenshot.
- `screenshots/mobile.png`: full-page screenshot captured using the 390×844 mobile viewport.
- `screenshots/browser-checks.json`: machine-readable verification evidence.

The section has no buttons, links, or other interactive controls in the supplied design; the relevant behaviors are automatic video playback and viewport-triggered reveals. No additional product features were added.

## Assets and limitations

All three exact CloudFront MP4 files supplied in `PROMPT.md` downloaded successfully and are served locally from `public/assets/`. They retain their original video content and are cropped using the specified 4:3 container with `object-fit: cover`.

The exact supplied OnlineWebFonts CSS import is retained. Its Helvetica Now Var WOFF2 file is also included locally and declared after the import for resilience. Both the remote CSS and local font loaded during browser validation. The original provider CSS is retained in `public/assets/font-source.css` for provenance. Font source / attribution: [Web Fonts](https://www.onlinewebfonts.com/fonts). The provider CSS identifies its font as CC BY 4.0; no independent license audit was performed.

Reduced-motion users receive immediate text/card visibility. Video remains muted and looping as requested. Browser checks were run in Chromium; Safari and Firefox were not tested. There are no known asset failures. This is a static, review-ready build; it has not been deployed or pushed.
