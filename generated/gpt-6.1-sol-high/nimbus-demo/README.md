# Nimbus Demo

Design ID: `nimbus-demo`. Implements this project's `PROMPT.md` using HTML, CSS, an empty `script.js`, and Vite `^5.4.2` (locked to 5.4.21). Includes the exact console copy, sidebar items, storage-pool data, persistent notification, cyan styling, ruled decoration, hover tilt and shine, and responsive breakpoints. Table cells have accessible roles. Phone table text uses 12px type and 8px cell padding to fit the visible columns.

## Run and build

With Node/npm: `npm ci`, then `npm run dev`, `npm run build`, or `npm run preview`.

This environment uses the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Serve it at `/motionsites-results/nimbus-demo/`, the configured Vite base. The dependency lockfile is included; `node_modules/` is excluded by `.gitignore`. No deployment or push was performed.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The check script serves the production build temporarily at the configured subpath and launches the image's Chromium through Playwright Core. Passed at desktop 1440×1000, phone 390×844, and breakpoint 820×1000:

- No horizontal page overflow or overflowing table cells.
- Four data rows and six sidebar labels.
- Desktop hover tilt, shine sweep, and row highlight.
- Responsive column hiding and toast positioning.
- IBM Plex Sans and Mono loaded at both 400 and 500 weights.
- New pool button click without errors.
- Zero browser script/console errors and failed asset requests.

Evidence: `screenshots/browser-checks.json`. Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. They use the required viewport sizes with full-page capture, so image heights include content below the viewport. Both screenshots were visually reviewed. The first run found a missing favicon; an inline SVG favicon fixed it, and the final run passed.

## Assets and limitations

Google Fonts supplies the required font families and weights, with both preconnects. They loaded successfully during verification; the external font service requires internet access. The dashboard is real DOM/CSS. The supplied `/home/opc/motionsites/assets/previews/nimbus-demo.webp` was viewed only for visual comparison. No source extraction or asset recovery was needed, and no screenshot is embedded in the page.

As explicitly specified, this is a CSS-only faux console: sidebar items are labels, New pool has no creation workflow, and Pool created is a persistent example notification. `script.js` is empty. Mouse hover was checked in desktop Chromium; phone layout was checked using Chromium mobile emulation.

`npm audit` reports one moderate esbuild finding and one high Vite finding in the development toolchain. Details are saved in `dependency-audit.json`. The requested Vite major is retained; npm's suggested automatic fix changes the major. The delivered static build does not run the development server.

Status `ready` means ready for acceptance, not published.
