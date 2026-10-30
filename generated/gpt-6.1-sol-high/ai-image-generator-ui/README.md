# AI Image Generator UI

A static “Core Features” marketing section implemented from this project's `PROMPT.md` with native HTML and CSS. Includes the exact copy, three gradient cards, original SVG illustrations, Inter 400/500/600 from the specified Google Fonts stylesheet, and the 900px/600px responsive breakpoints. No framework, client JavaScript, animations, persistence, or extra product flows are required by the prompt.

## Build

With Node 22 and npm:

```sh
npm ci
npm run build
```

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The build copies the complete static website into `dist/`, including `dist/index.html`. Resource references are relative and work at `/motionsites-results/ai-image-generator-ui/` or another static mount. No npm dependencies or `node_modules` are needed; `package-lock.json` is included.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

`browser-check.cjs` uses the image's existing Playwright Core and Chromium, serves `dist/` temporarily under the required publication path, and shuts the server down afterward. Passed at 1440×1000, 390×844, and 800×1000: expected 3/1/2 columns, three 340px cards, loaded SVGs and font weights, no horizontal overflow, no scripts or animations, no console/page errors, and no failed requests. Clicking both decorative pills leaves the section unchanged, as the prompt explicitly requires no JavaScript behavior. They are illustration elements rather than interactive application controls.

Screenshots were visually reviewed:

- `screenshots/desktop.png`: 1440×1000.
- `screenshots/mobile.png`: full-page capture from a 390×844 viewport, showing all three stacked cards.
- `screenshots/browser-checks.json`: measured browser results.

## Assets and limits

Both original SVGs downloaded successfully, are stored unchanged in `public/assets/`, and are copied into the build:

- `network.svg`: https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg
- `library-icon.svg`: https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg

The specified Google Fonts URL is used directly and loaded successfully in the browser checks. It requires internet access; the CSS sans-serif fallback applies if Google Fonts becomes unavailable. No asset extraction or replacement was needed. Only this design's provided preview was inspected, and no screenshot is used as page content. Layout follows the prompt's explicit pixel values rather than the preview's display scale.

The first browser run found a missing favicon request; an empty data favicon fixed it, and the final build and complete browser checks passed. No deployment or push was performed. `ready` in `result.json` means ready for management-session review, not published.
