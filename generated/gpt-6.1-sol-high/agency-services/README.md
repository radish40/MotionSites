# Agency Services

A responsive Services section built from `PROMPT.md` with React, Tailwind CSS, and framer-motion. Includes the exact five service descriptions, Google Font Kanit (300–900), responsive typography and spacing, a rounded white section over `#0C0C0C`, and staggered viewport fades. The reusable `src/FadeIn.jsx` supports configurable tags, offsets, timing, classes, and styles, and respects reduced-motion preferences.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base path is `/motionsites-results/agency-services/`. Open that path on the development or preview server. Publishable output is `dist/`, including `dist/index.html`. No deployment was performed.

This host uses the available Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

Run the included check against the production build using the image's existing Playwright and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

Verified at desktop 1440×1000 and mobile 390×844:

- All five service rows and four dividers render.
- Scroll-triggered animations reveal each row and remain visible when returning to the top.
- Reduced-motion mode displays content without entrance animation.
- No JavaScript errors, console errors, failed requests, or horizontal overflow.
- Kanit loads successfully from Google Fonts.
- Full-page screenshots were captured after scrolling through all content and visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`.

Machine-readable evidence is in `screenshots/browser-checks.json`. The production build passed; npm reported zero dependency vulnerabilities at installation.

## Assets and limitations

The only external asset is the Google Fonts stylesheet and its Kanit font files, loaded using the exact head links requested in the prompt. They succeeded during verification; rendering the specified font requires network access. The browser checker uses the Playwright and Chromium paths provided by the stated Docker image. The requested section has no buttons, forms, navigation, or backend; its interaction is the viewport animation. All files and artifacts are confined to this project.
