# Cybersecurity Hero

Single-page Xero landing hero, built with React, TypeScript, Vite and plain global CSS from `PROMPT.md`. Includes the specified gradient arc and grid, SVG encryption pipeline, four-phase requestAnimationFrame animation, responsive navigation, and five monochrome brand marks.

The production base is `/motionsites-results/cybersecurity-hero/`. The publishable static output is `dist/`, including `dist/index.html`. No deployment was performed.

## Build

With Node 22 and npm:

```sh
npm ci
npm run build
```

Using the available Docker image from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For development use `npm run dev`; for the production preview use `npm run preview` and open the configured base path. Dependencies are recorded in `package-lock.json`; `node_modules` is excluded from the deliverable.

## Browser verification

The repeatable browser check serves the real production build at its configured subpath and uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Verified desktop 1440×1000 and mobile 390×844, all four animation phases, matching beam paths and resize geometry, node replay, CTA hover, mobile menu opening/closing, scroll locking, Escape, and desktop resize reset. Additional viewport widths: 320, 480, 768, 860, 1600, 1920. No horizontal page overflow, script errors or failed asset requests occurred.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Machine-readable browser results: `screenshots/checks.json`.

## Assets and limitations

Inter weights 300–800 were downloaded from Google Fonts and bundled locally; their SIL Open Font License is in `public/fonts/OFL.txt`. Runtime rendering requires no external font or image requests. Brand marks use the prompt's inline SVG geometry.

The prompt mentions a supplied multi-cut Xero logo path, but no path or source asset was actually provided. The central mark is a recreated multi-cut X SVG, rather than a verified original logo asset. Other provided SVG paths and gradient stops are retained. The wording “encryption your data” is intentionally preserved exactly.

Navigation, account links and Get Started retain the prompt's `#` destinations; the brief supplies no additional pages, authentication or backend. The pipeline icons replay the animation when clicked. Browser verification used Chromium; other browser engines were not tested.

`result.json` status `ready` means ready for management-session acceptance, not published.
