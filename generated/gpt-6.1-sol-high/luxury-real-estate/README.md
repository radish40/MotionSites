# Luxury Real Estate

Design ID: `luxury-real-estate`. A single-page **Velar.** luxury property site built with React, TypeScript, Tailwind CSS and Vite. Icons use lucide-react. All animation logic lives in `src/App.tsx`.

The experience includes the timed typewriter introduction, house entrance and scroll interpolation, fixed navigation with a full-screen menu, sticky statement and animated statistics, and a five-video gallery with desktop expansion and a mobile grid. Menu links navigate within the page; Inquire closes the menu and reaches the gallery’s end anchor, as no inquiry form or data layer was specified.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

In this environment, use the supplied Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The completed static build is in `dist/`, including `dist/index.html`. Vite’s base is `/motionsites-results/luxury-real-estate/`. Serve at that path. No deployment or push was performed.

## Validation

A real production build completed successfully. Chromium with Playwright checked desktop **1440×1000** and mobile **390×844** using the production files at the specified base path. Checks passed for intro exit and hero reveal, house loading and scroll transforms, menu open/close, Escape and link navigation, count-up completion, white navigation on dark sections, all five muted autoplay videos, desktop hover expansion, mobile two-column grid, and horizontal overflow at six scroll positions. No JavaScript page errors occurred. Both Google font families loaded successfully.

- Required captures: `screenshots/desktop.png`, `screenshots/mobile.png`.
- Additional captures: intro, desktop/mobile statement and desktop/mobile gallery.
- Machine-readable browser evidence: `screenshots/checks.json`.
- Reusable check script: `scripts/check.cjs` (uses Playwright installed in the supplied Docker image).

To repeat the checks in Docker, run `node scripts/serve.cjs` in one container and `node scripts/check.cjs` in that same container through `docker exec`. Chromium and `/app/node_modules/playwright-core` are available in `louislam/uptime-kuma:2`. The server listens on container port 4173; no public port is necessary for the checks.

## Assets and limitations

The exact supplied Cloudinary house URL returns **HTTP 401**, with `x-cld-error: cloud_name dsdhxhhqh is disabled`. This was confirmed with curl and Chromium. The app attempts the exact URL and falls back on error to `public/assets/house-fallback.png`, a transparent architectural cutout derived from the first supplied gallery video at one second. Its source and reproducible mask are recorded in `scripts/create-house-fallback.cjs`. This preserves the animated composition but cannot reproduce the unavailable original house image exactly. Restoring the original URL automatically restores the requested asset on a fresh page load.

The exact supplied sky background and all five supplied videos were downloaded successfully and are served locally under `assets/`, preserving their required order. Original source URLs remain in `App.tsx`. Syne and Inter use the required inline style Google Fonts import; font loading still requires network access. The requested Syne 900 is declared for the period; the font provider’s available face determines its actual rendering.

The browser’s only HTTP error was the known Cloudinary 401, once per viewport. The fallback loaded in both views. The project is ready for management review with this asset limitation recorded. No persistence is needed and no extra data service was added.
