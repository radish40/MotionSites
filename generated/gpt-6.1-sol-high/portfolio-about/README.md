# Portfolio About

Implementation of design `portfolio-about` using React 19, Tailwind CSS 4, Vite 6, and framer-motion 12. The page uses Kanit, the exact supplied copy, four original transparent PNG decorations, responsive positioning, gradient typography, viewport entrance animations, and a character-by-character scroll reveal.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

Open `/motionsites-results/portfolio-about/`. The production base is configured in `vite.config.js`; `dist/` contains the complete static release, including local images and fonts.

This host has no Node installation. The real build used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

Use `npm ci` instead of `npm install` to reproduce the saved lockfile. Dependencies are excluded by `.gitignore`.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The check starts a temporary local HTTP server for `dist/`, uses the image's Playwright and Chromium, and closes both after testing. It checks desktop 1440×1000 and mobile 390×844, image and font loading, horizontal overflow, character reveal after scrolling, contact navigation, keyboard focus, hover and active opacity, reduced motion, and browser errors. Evidence is in `screenshots/browser-report.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Additional scrolled screenshots show the reveal at completion. The two required screenshots were also visually inspected.

## Assets and design details

All four original Figma image URLs returned successfully; their unmodified files are saved in `public/assets/`. The specified Google Fonts head links are retained. Local copies of all requested Kanit weights (300–900), downloaded from Google Fonts, provide the same typeface without relying on external font delivery. `kanit-source.css` preserves the original download URLs and `kanit-local.css` uses local paths. See `public/assets/sources.json` for image provenance.

The full first viewport preserves the specified section layout. An empty 45vh scroll runway after the section allows the scroll-driven paragraph to finish revealing in this isolated page. Words are kept together while each character, including nonbreaking spaces, has its own opacity transform. Assistive technology receives one coherent paragraph. Reduced-motion users see fully revealed text and immediate entrances.

`Contact Me` uses the required `#contact` link and resolves to the button group's ID. No contact form, address, or destination section was supplied, so no additional contact interface is invented.

## Limitations

The supplied preview WebP is a single blank dark frame, so detailed visual comparison was unavailable. Layout and animation follow `PROMPT.md`; no screenshot assets were extracted. Vite logs harmless ignored `use client` directives from framer-motion during the successful browser-only build. `build.log` preserves that output. Nothing has been deployed or pushed.
