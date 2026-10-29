# Interactive Portfolio

A full-viewport photography portfolio built with React, Vite, TypeScript, and Tailwind CSS. Component styling uses inline styles; no Tailwind utility classes appear in JSX. The desktop layout follows the supplied project anchors, photograph, gradient, blur mask, thumbnails, dock, tooltips, and spring window transitions.

Six draggable project cards open their supplied images in scrollable windows. About Me and Notes open separate windows. All traffic-light controls dismiss their window; Escape also closes it. Windows can be dragged by their title bars. Keyboard focus stays in an open window and returns to its opener. The three social icons link to the exact destinations from the prompt.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the served `/motionsites-results/interactive-portfolio/` path. Production files are in `dist/`, including `dist/index.html`. Vite's base is configured for that exact publication path.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules/` is ignored and is not a delivery artifact.

## Browser validation

The browser check starts its own temporary HTTP server serving the production files at the configured subpath, then runs the image's Chromium through Playwright:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

Checked at desktop **1440×1000** and mobile **390×844**: all six projects, image decoding, About/Notes, window dismissal, external link attributes, dock tooltips and scaling, mouse dragging, title-bar dragging, touch dragging, keyboard access and focus containment, font loading, viewport containment, browser exceptions, console errors, failed requests, and HTTP errors. The detailed results are in `browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-project.png`
- `screenshots/mobile-project.png`

## Assets and implementation notes

All 12 supplied image/icon assets are stored under `public/assets/` and copied into the production build. `asset-manifest.json` records the original URLs, byte sizes, and SHA-256 hashes. The background also retains the original supplied URL as a secondary CSS image. The exact Google Fonts import from the prompt is included in `src/index.css`; Inter loaded successfully in both tested viewports. Google Fonts remains an external dependency.

Below 640px, the projects use a two-column, three-row arrangement and windows fit within the viewport. Desktop anchors and dock dimensions remain as specified. Mouse and touch dragging use the same five-pixel threshold. Drag positions are session-local and reset on page reload. About and Notes contain brief editorial copy because their body text was not specified. The project windows use the supplied project images; no additional gallery assets were provided.

The final production build passed. The dependency installation reports zero known vulnerabilities. No deployment, push, or external messaging was performed. `ready` in `result.json` means ready for review, not published.
