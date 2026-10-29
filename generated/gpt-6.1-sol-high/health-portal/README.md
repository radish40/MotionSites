# Health Portal

Design ID: `health-portal`. A single-page Dental Health landing page built from this project's `PROMPT.md` using React, Vite, TypeScript, and Tailwind CSS. All React components, hooks, constants, and rendering live in `src/App.tsx`. No UI or icon libraries are used.

The implementation includes the three responsive sections, shared-image masked cards with ResizeObserver measurements, section reveal animations, 0–100 splash counter, fixed navigation, sliding menu, translucent service cards, and inline SVG arrows. The exact five image URLs and both font stylesheet URLs are retained. The document title is **Dental Health - Quality Healthcare**.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run dev
```

The required public base is `/motionsites-results/health-portal/`. Open that path on the development server. `npm run preview` serves the built version on port 4173. The production output is `dist/`, including `dist/index.html`; mount the contents at the required public base.

The host used for implementation has no Node/npm. The actual build used the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install --no-audit --no-fund && npm run build'
```

For repeatable dependency installation, replace `npm install --no-audit --no-fund` with `npm ci`. `package-lock.json` is included; `node_modules/` is excluded from delivery.

## Browser verification

The real production build was served locally at the required nested path and checked with Chromium through the Docker image's existing `playwright-core`. Run after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node browser-check.cjs'
```

The script starts and stops its own temporary HTTP server. Full evidence, including external HTTP statuses, image dimensions, fonts, errors, and layout dimensions, is saved to `browser-checks.json`.

Checked desktop **1440 × 1000** and mobile **390 × 844**: splash appearance/removal, document title, three sections, external image loads, horizontal overflow, menu opening, body scroll locking, Escape dismissal, backdrop dismissal, link dismissal, gallery navigation, consultation anchor navigation, script errors, and console errors. All recorded assertions passed. Screenshots were visually reviewed for card alignment and responsive stacking.

Required captures:

- `screenshots/desktop.png`
- `screenshots/mobile.png`

Additional captures include full-page desktop/mobile views, gallery and implant section views, the mobile menu, and the splash screen.

## Limits and implementation details

- This is the specified static landing page. The prompt supplies no clinic telephone number, booking provider, backend, or appointment workflow. Contact/Call Us links navigate to the consultation card; the Book Online button retains the specified visual and hover interaction without submitting or creating appointments. Implant information arrows are visual elements as specified.
- The desktop Menu button opens the same navigation panel as the mobile menu. Menu links map to the existing content; no additional page sections were invented.
- All five supplied images and both font CSS links returned HTTP 200 during testing. The regular Open Sauce One font file loaded successfully. The separate Bold family stylesheet is present; the supplied body font declaration uses the regular family with browser-synthesized weights, so the separate Bold face is not requested by rendering.
- External fonts and images still require network access; they were not replaced or bundled.
- The fixed translucent navbar can cover content at the top of later sections while scrolling, consistent with the prescribed fixed navigation and section spacing. Mobile sections may exceed viewport height to accommodate the specified stacked cards.
- Nothing was deployed or pushed. `ready` in `result.json` means ready for acceptance review.
