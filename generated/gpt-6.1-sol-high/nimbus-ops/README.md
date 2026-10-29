# Nimbus Ops

Standalone Nimbus Grid Operations section, design ID `nimbus-ops`. Implemented from `PROMPT.md` using plain HTML, CSS, vanilla JavaScript, and Vite 5 (`^5.4.2`, locked to 5.4.21). The section includes the exact copy, gold CTA, layered background, six CSS cube faces, 14 particles, floating animation, staggered explosion transitions, and the 820px/520px responsive breakpoints.

## Run and build

With Node/npm installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Configured base URL: `/motionsites-results/nimbus-ops/`. The complete publishable output is in `dist/`, including `dist/index.html`.

Build in the provided environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The production build was served at its configured subpath and checked with Chromium through Playwright at desktop 1440×1000 and mobile 390×844. Checks passed for:

- Initial floating state, six faces and 14 particles.
- Click to explode and click again to collapse.
- Enter and Space keyboard toggles.
- CTA hover color and navigation to the specified `#plans` fragment.
- No horizontal layout overflow, page exceptions, console errors, or failed requests.
- Successful loading of the IBM Plex Sans and IBM Plex Mono font subsets used on the page.

Repeat the checks with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

The verification script starts and stops its own temporary HTTP server. Screenshots are full-page captures taken with the requested viewports:

- [Desktop](screenshots/desktop.png)
- [Mobile](screenshots/mobile.png)
- [Desktop exploded](screenshots/desktop-exploded.png)
- [Mobile exploded](screenshots/mobile-exploded.png)
- [Browser check data](screenshots/browser-checks.json)

## Assets and limitations

Google Fonts is the only external asset service; both required preconnects and the 400/500 font declarations are present. Fonts loaded during verification; offline environments use the specified fallbacks. No raster assets, frameworks, or 3D libraries are used. The project’s own reference `/home/opc/motionsites/assets/previews/nimbus-ops.webp` was viewed for composition only; no screenshot content was embedded or extracted.

The CTA retains the exact prompt’s `href="#plans"`. This standalone section does not include a plans section, so the link updates the URL fragment without opening a separate planning flow. No additional product features were added.

The CSS is preserved as specified, including the core cube filter and its resulting browser rendering. Visual validation was in Chromium only. The install reported two development dependency audit findings (one moderate, one high) in the required Vite 5 toolchain; the generated static page has no runtime package dependencies. No deployment or push was performed. `ready` means ready for review, not published.
