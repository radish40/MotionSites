# Nimbus Sticky Cards

Standalone Nimbus Grid Platform Accordion, design ID `nimbus-sticky-cards`. Plain HTML, CSS, vanilla JavaScript, and Vite `^5.4.2`, following `PROMPT.md`.

Four panels use the supplied copy, code examples, color tokens, responsive rules, and scroll math. The sticky frame spans a 420svh section. Clicking a tab smoothly scrolls to its segment. Native buttons support keyboard activation and show a visible focus outline.

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The actual build used the existing Docker image because the host lacks Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

Serve `dist/` at `/motionsites-results/nimbus-sticky-cards/`. The lockfile is included; generated `node_modules` is excluded. Nothing has been deployed.

## Browser verification

Production output was served under the required subpath in a temporary Docker container and tested with Chromium and the image's existing playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

- Desktop 1440 × 1000 and mobile 390 × 844 passed.
- All four tab targets reached expected scroll positions and selected states.
- Direct scrolling activated infra → residency → scaling → visibility.
- No JavaScript page errors, failed requests, or horizontal document overflow at tested states.
- IBM Plex Sans and Mono loaded from Google Fonts.
- Keyboard Tab focus reached a native tab button.
- Initial and stacked screenshots captured; initial desktop/mobile and stacked mobile visually inspected.

Evidence: `browser-checks.json`, `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-stacked.png`, and `screenshots/mobile-stacked.png`.

## Assets and limitations

External assets are the requested Google Fonts, with specified preconnects and weights 400/500. They loaded during verification; future loading requires network access. Gold panels and code windows are real CSS and DOM. No substitute assets or extraction were necessary. The supplied design preview was inspected for comparison and is not embedded.

The prompt's mobile stack height and 96px collapsed offsets are retained. Later stacked panels extend toward the viewport bottom, and the specified sticky frame clips content outside it. Verification covers Chromium at the required sizes, not other browser engines or every intermediate viewport.

The dependency audit reports two affected development dependencies (one moderate, one high) in the requested Vite 5 toolchain. Findings are saved in `dependency-audit.json`; its suggested major-version upgrade exceeds the specified stack. The generated static bundle has no runtime package dependencies.
