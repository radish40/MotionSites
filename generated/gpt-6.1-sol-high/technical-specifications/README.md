# Technical Specifications

EngineTech's responsive propulsion statistics section, implemented from the complete `PROMPT.md` requirements. Design ID: `technical-specifications`.

Uses native HTML, CSS, and JavaScript, with all four supplied datasets, a horizontally scrolling mobile tab bar, range indicators, six spark points per bar, and staggered animations that replay after each tab change. Tabs also support arrow keys, Home, and End. Reduced-motion preferences are respected.

## Build and run

Requires Node 22; there are no npm dependencies. The dependency lockfile is included.

```sh
npm ci
npm run build
npm start
```

Open `http://localhost:5173/motionsites-results/technical-specifications/`. The build produces a standalone static site in `dist/`, configured for exactly that subpath.

On the supplied host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

A real build and Chromium checks were performed using the supplied Docker image. The reusable browser script is `scripts/browser-check.cjs`, which uses the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. Start `npm start` inside the same container before running it.

Validated desktop 1440×1000 and mobile 390×844: exact values for all four datasets, active tab/ARIA states, animation completion, rapid-switch cancellation, keyboard navigation, local font loading, axis breakpoints, and no document horizontal overflow. Console errors and failed requests are checked. Full-page screenshots use the required viewport sizes; the mobile section extends vertically beyond its viewport.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

## Assets and limits

Geist fonts were downloaded from Google Fonts and bundled in `public/fonts/`, with the upstream CSS and SIL Open Font License. The delivered page has no external asset requests. The source visual reference `/home/opc/motionsites/assets/previews/technical-specifications.webp` was inspected only for this design; no preview pixels were used in the page. All gradients, chart layers, spark traces, labels, and controls are live DOM/CSS.

An initial missing favicon request was fixed with an inline empty favicon before final verification. No unavailable required assets or known implementation blockers remain. Verification covers Chromium at the two required sizes; other browser engines were not tested. No deployment or push was performed.
