# What Package Fits You

Design ID: `package-fits-pricing`.

A standalone pricing section implemented in `component2.html`, with one style block, one inline script, and no frameworks or runtime JavaScript dependencies. All CSS classes use the `c2-` prefix. The page includes Product Design, configurable Web Design, and Unique Request packages, the specified typography, original tree/landscape assets, entrance animations, hover effects, and reduced-motion support.

## Build and run

With Node installed:

```sh
npm ci
npm run build
```

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The build copies the complete page and images to `dist/`, producing both `dist/index.html` and `dist/component2.html`. Serve `dist/` at `/motionsites-results/package-fits-pricing/`. Relative image URLs support that path without a bundler or Vite. No deployment was performed.

## Verification

Run the repeatable browser check with the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build && node browser-check.cjs'
```

The check serves the actual build at the required subpath using a temporary HTTP server and Chromium through the image's existing Playwright installation. It verifies:

- Desktop viewport 1440×1000 and mobile viewports 390×844 and 375×844; no horizontal overflow and the expected responsive grid.
- Default $1,500, multi-page $2,500, multi-page plus Framer $3,300, and single-page plus Framer $2,300.
- Mouse and keyboard interactions, selected/checked ARIA state, and all three Contact Us console events.
- Original image loading, Google Fonts loading, reduced-motion CSS, and no script errors or failed requests.

Full-page screenshots are saved as `screenshots/desktop.png` and `screenshots/mobile.png`. Their heights include scrollable content; the browser viewports remain the sizes above. Machine-readable observations are in `browser-checks.json`.

## Assets and limitations

The original assets were recovered unchanged using curl after initial Python download attempts returned HTTP 403. Local copies are included in both `assets/` and `dist/assets/`; their original URLs and SHA-256 hashes are recorded in `assets/sources.json`. No substitute or generated images were used. The optional reference preview at the location given in TASK.md was absent, so visual verification used the detailed written requirements and the rendered screenshots.

The exact Google Fonts CSS import remains an external dependency, as required; it loaded during browser verification. Contact Us logs the selected package, as specified, without opening a form or sending a message.

The prompt's mobile verification sentence mentions a 240px landscape at 375px, while its explicit max-width:480px CSS rule requires 180px. The implementation follows the explicit media-query rule (180px at 375/390px, 240px from 481px through 768px). Trees are 96px on mobile.
