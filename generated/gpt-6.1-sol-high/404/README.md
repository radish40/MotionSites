# Nexto 404

Design ID: **404**. A single viewport 404 page built with React 19, Vite 7, Tailwind CSS 4, variable DM Sans, and Google Material Symbols Rounded. Publication base: `/motionsites-results/404/`.

The page implements the supplied nexto. branding, spaceship background, exact copy, floating gradient cloud and heart, navigation cards, hover effects, and responsive mobile overlay. The overlay supports keyboard focus containment, Escape dismissal, and focus restoration. Reduced motion preferences disable animation.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the configured base path. Production files are in `dist/`, including `dist/index.html`.

On this host, build using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The real production build passed. The final dependency installation reported zero vulnerabilities.

The browser check serves `dist/` at the actual publication subpath inside a temporary container and uses the image's Chromium and playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

All 22 assertions passed: desktop 1440×1000 and mobile 390×844; no document overflow; loaded fonts; visible cards and fitting heading; desktop hover lift; responsive navigation; mobile menu opening and slide position; Escape dismissal; focus restoration and wrapping; navigation hrefs; no script/console errors or failed asset requests; exclusively local runtime requests.

Screenshots were visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`

Full check output and requested runtime resources: `screenshots/browser-checks.json`.

## Assets and scope

Original images were downloaded successfully, unchanged, into `public/assets/`:

- Logo: https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/Tests/logoipsum-415.svg
- Spaceship: https://pub-e68758f43067417dba612b2371819aa1.r2.dev/viktor-components/alien-spaceship.png

DM Sans variable weights 100–1000 with optical sizing 9–40 and Material Symbols Rounded at `opsz,wght,FILL,GRAD@24,400,1,0` were retrieved through Google Fonts. WOFF2 files are stored locally; `src/fonts.css` declares them. `public/assets/fonts-source.css` records the upstream CSS. The initial Python download stalled; direct curl retrieval succeeded. All final font files loaded in Chromium. No asset reconstruction or screenshot substitution was used.

The optional design preview `/home/opc/motionsites/assets/previews/404.webp` was absent. Visual verification therefore uses the supplied written specification and original assets; no preview comparison is claimed.

The prompt supplies no destination URLs or destination page content. Links use conventional paths under the publication base (`team`, `solutions`, `showcase`, `news`, `contact`); Main Page uses the base itself. These are integration destinations, not additional pages included in this single 404 design. Browser checks verify hrefs without claiming those pages exist. The Solutions arrow is the specified visual indicator; no dropdown content was supplied.

No deployment, push, other project work, or agent delegation was performed. `ready` means this isolated project is ready for review, not online.
