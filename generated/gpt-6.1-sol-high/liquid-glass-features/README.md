# Liquid Glass Features

Design ID: `liquid-glass-features`.

A single Features Chess section implemented with React, TypeScript, Vite, Tailwind CSS, and lucide-react. The component preserves the exact supplied copy, class names, liquid glass CSS, external GIF URLs, typography, spacing, and alternating layout. The background is solid black. Only button hover transitions are added by the component; the supplied GIFs animate independently.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/liquid-glass-features/`. Open that path on the development or preview server. Production files are in `dist/`, including `dist/index.html`; host the complete directory at the configured subpath.

This host has no native Node/npm. The actual build used:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --no-audit --no-fund && npm run build'
```

`package-lock.json` is included. For reproducible subsequent builds use `npm ci` in place of `npm install`. `node_modules/` is ignored and is not a deliverable.

## Browser validation

The production build was served at the configured subpath in a temporary Docker container and checked using the image's Chromium and Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Both 1440×1000 desktop and 390×844 mobile checks passed. Checks cover the black background, heading text, alternating desktop rows, content-before-image mobile order, absence of horizontal overflow, both image decodes, both font families, button hover/click/keyboard activation, and absence of console errors, uncaught JavaScript errors, and failed network requests. Screenshots were also visually inspected.

- `screenshots/desktop.png`: full-page capture from the desktop viewport.
- `screenshots/mobile.png`: full-page capture from the mobile viewport.
- `screenshots/browser-checks.json`: measured layout, assets, interactions, and errors.

An initial missing favicon request was resolved with an inline favicon; the final run has no browser errors.

## Scope and limitations

The CTA buttons retain the exact prompt behavior: glass hover styling and native button activation. The prompt supplies no destination or click action, so they do not navigate or open additional content. GIFs and Google Fonts load from their specified external providers and require connectivity; all loaded successfully during validation. Screenshot GIF frames can differ between runs. No publishing or deployment was performed. `ready` means ready for management-session review.
