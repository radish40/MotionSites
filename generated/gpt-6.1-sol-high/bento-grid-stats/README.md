# Bento Grid Stats

A React + TypeScript implementation of the supplied “Why Us?” section. Uses React 18, Tailwind CSS 3, and Framer Motion 12, with the exact six cards, copy, monochrome palette, diagram, staircase dot chart, photo, and staggered scroll entrances from `PROMPT.md`.

The reusable component is `src/BentoGridStats.tsx`. Desktop uses the specified six-column, ten-row grid; mobile stacks cards in their numbered prompt order. Decorative plus signs are spans, as specified. The only interaction is the entrance animation on scroll.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

Open `/motionsites-results/bento-grid-stats/` on the development server. Vite's base is configured for this exact subpath. The production output is `dist/`, including `dist/index.html`; serve it under that subpath.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.npm-home -e npm_config_cache=/work/.npm-cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` preserves the installed dependency versions. Dependencies are not included in the deliverable.

## Assets

The exact supplied Pexels image was downloaded successfully from:

`https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800`

DM Sans 400 and 500 were downloaded from the font files returned by the exact Google Fonts stylesheet:

`https://fonts.googleapis.com/css?family=DM+Sans:500,400`

The photo and fonts are served locally from `public/assets/` and copied into `dist/assets/`, so runtime rendering requires no third-party asset requests. `dm-sans-source.css` records the original Google response; the application loads its local fonts through `src/styles.css`. No asset failures were encountered.

## Validation

The real production build passed TypeScript checking and Vite bundling. npm reported zero vulnerabilities at installation. Vite emitted non-fatal warnings that Framer Motion's module-level `use client` directives are ignored in this client-rendered bundle.

Browser checks run against `dist/` at its configured subpath using Chromium and the image's existing Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.browser-home -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Passed at 1440×1000, 390×844, 768×1024, and 320×800:

- Six visible cards and no horizontal page overflow.
- Font and photo loading, with no failed requests or browser console/script errors.
- Scroll-triggered entrance of every card, with completed animations remaining visible after scrolling back.
- The mobile photo remains hidden until scrolled into view.
- Chart measurements record 26 columns and 390 cells; two decorative plus signs are visible.

Evidence: `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots use the requested viewport sizes and capture the full page after all entrances complete. Both screenshots were visually reviewed.

## Limits and delivery

Between 768px and 1023px, chart dots adapt horizontally to the narrow desktop cards to prevent overflow; the required 1440px and 390px layouts use the specified dot dimensions. Font weights beyond the supplied 400/500 faces use browser synthesis, consistent with the requested Google Fonts URL.

Ready for review. No deployment, push, additional sessions, or other projects were involved.
