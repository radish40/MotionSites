# Vize Footer

Design ID: `vize-footer`. A React footer built from this project's `PROMPT.md`, with Vite, TypeScript, Tailwind CSS v4, `lucide-react`, and `motion/react`.

The page includes the specified layered card, responsive directory grid, social buttons, legal bar, Inter typography, exact SVG logo and glass filter, and 1.8-second wordmark entrance animation. The supplied CSS utilities and layout classes are preserved. Accessible button labels, navigation labels, focus outlines, and a matching favicon are included.

## Run and build

With Node 22 and npm available:

```sh
npm ci
npm run dev
npm run build
```

The development URL uses `/motionsites-results/vize-footer/`. Production output is in `dist/`, including `dist/index.html`. Vite's base is set to that same publication subpath; serve `dist/` at that path.

On this host, Node and Chromium are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check-browser.cjs
```

The browser script serves the actual production output at the required subpath and checks Chromium at 1440×1000, 390×844, and 768×1024. It verifies rendered content, navigation and button counts, hover color, button clicks and focus, placeholder hash navigation, SVG filter structure, completed Motion animation, and horizontal overflow. It records console errors, script errors, failed requests, and Google Font responses in `screenshots/browser-report.json`.

Screenshots were visually reviewed:

- `screenshots/desktop.png`: 1440×1000 desktop.
- `screenshots/mobile.png`: full-page capture using a 390×844 viewport, including content below the fold.

Production build and final browser checks passed. No browser errors or failed requests were recorded. Inter CSS and font requests returned HTTP 200. An initial favicon 404 was fixed before the final build and checks.

## Assets and limitations

- Inter uses the exact Google Fonts import required by the prompt and needs network access; the specified system font fallback remains available.
- Logo and favicon use the prompt's SVG paths. Social icons come from Lucide. The wordmark is real text with the specified handcrafted SVG filter, animated through Motion.
- The optional reference `/home/opc/motionsites/assets/previews/vize-footer.webp` did not exist. The implementation follows the complete written specification; comparison with that reference was unavailable. No extracted or substitute raster assets were used.
- Directory and legal links intentionally use `href="#"`; social controls are buttons with visual interaction states and no destination, as specified. No additional routes or external social destinations were invented.
- Browser verification covers the installed Chromium engine. Other browser engines were not tested.
- This is ready for review, with no deployment, push, or external messaging performed.
