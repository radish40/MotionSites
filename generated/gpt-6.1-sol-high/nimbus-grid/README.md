# Nimbus Grid

Single-page marketing site for a fictional secure cloud storage capacity platform. Built with plain HTML, CSS, vanilla JavaScript, and Vite 5. The project identity is `nimbus-grid`.

## Run and build

With Node and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

This host uses the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable static output is `dist/`, with `dist/index.html`. Vite's base is `/motionsites-results/nimbus-grid/`. No deployment has been performed.

## Implementation

All six requested sections are real HTML with CSS visuals. JavaScript handles aspect-aware shader sizing, accessible console tabs and typing, sticky scroll-driven feature cards, capacity-bar morphing, billing units, and the 14-piece operations cube. Native buttons support keyboard interaction. Reduced-motion preferences disable local animation and hide the external shader in favor of its warm gradient fallback. Plan CTAs navigate to the relevant in-page console/operations sections. The dashboard is a visual demonstration; its New pool button replays the confirmation toast without contacting a backend.

## Assets and approximations

- Uses the exact FragCoord iframe endpoint from PROMPT.md; the shader remains externally hosted. No screenshot or video substitutes are used in the page.
- Uses Google Fonts IBM Plex Sans and IBM Plex Mono, weights 400/500, with both requested preconnects. System sans-serif and monospace are fallbacks.
- Inspected only this design's reference at `/home/opc/motionsites/assets/previews/nimbus-grid.webp`. No assets were extracted. The supplied reference shows the hero, so the remaining sections are implemented from the written instructions.
- The prompt refers to an original binary map and 14 exact particle definitions, but does not supply their markup or coordinates. The 28-column, 10-row map and fixed 10-fragment/4-dot coordinates are approximations within the supplied ranges. No source restoration was necessary. A one-time iframe reload after page load ensures its initial embedded navigation uses the computed dimensions; this avoids a browser navigation race that could otherwise letterbox the mobile shader.
- No image assets are used. The shader, fonts, and their downstream services require network access.

## Verification

The production build is exercised in headless Chromium using `/app/node_modules/playwright-core` from the supplied Docker image. To repeat:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 checks/browser.cjs
```

The test serves `dist` at the required subpath, checks desktop 1440×1000 and mobile 390×844, all three console panes and typing, four accordion scroll positions and tab navigation, billing units, dashboard confirmation, cube mouse/Enter/Space interaction, fragment count, and horizontal overflow across all sections. Browser errors, external requests, font loading, and feature measurements are recorded in `checks/browser-report.json`. Screenshots include the required `screenshots/desktop.png` and `screenshots/mobile.png` plus section and animation-state captures. Shader frames are time-dependent, so captures will vary. After checking and capturing the live hero, the browser test removes the iframe from its temporary test page to release software WebGL resources for the remaining interaction checks. The shipped site retains the iframe.

The external shader service returned HTTP 500 from `https://fragcoord.xyz/api/config` during checks. Its embed, shader canvas, and fonts still loaded and rendered. This third-party console error is preserved in the browser report. No local JavaScript exceptions were observed.

The pinned Vite 5 dependency range installs Vite 5.4.21. `npm audit` reports one high advisory group for Vite and one moderate for esbuild, concerning development tooling. The exact audit is saved in `checks/npm-audit.json`; the requested stack is retained. The production output is static HTML/CSS/JS.

Supplemental mobile accordion captures were repeated with `checks/capture-platform.cjs` in Chromium with GPU disabled and the off-screen external iframe stubbed, after a software-WebGL capture omitted some text despite visible DOM headings. The recapture verified the headings' text, ink color, visibility, and bounds, and produced readable `mobile-platform-1.png` through `mobile-platform-4.png`. The required hero screenshots use the live external shader. Repeat this supplemental capture by replacing `checks/browser.cjs` with `checks/capture-platform.cjs` in the browser command above.
