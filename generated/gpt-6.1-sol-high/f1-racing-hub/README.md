# F1 Racing Hub

Design ID: `f1-racing-hub`. A responsive Lewis Hamilton / Silverstone / Scuderia Ferrari showcase built from the supplied `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS, Albert Sans and lucide-react. Three scaled phone screens appear together on desktop and stack on mobile. Includes animated entrances, count-up points, masked photo blur, glass cards and independent navigation menus.

## Run and build

With Node.js 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Configured public base: `/motionsites-results/f1-racing-hub/`. Open that path on the dev or preview server. Static output is in `dist/`, including `dist/index.html`. Serve the output under the configured path.

This host uses the provided Docker image for Node/npm:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The repeatable check serves `dist/` at the real base path inside an ephemeral container, using Chromium and the provided Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Checks cover 1440×1000 desktop and 390×844 mobile, loaded assets and font, horizontal overflow, settled count-up totals, opening the menu, selecting Statistics, Escape dismissal, and the account entry. Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png` (full page, including the three stacked phones). Detailed browser findings are saved in `screenshots/checks.json` and summarized in `result.json`.

## Interactions and limitations

Biography, Statistics and Career select the driver, circuit and team view within each phone. The account button opens the navigation panel; Sign in links to the official Formula 1 account site in a new tab. No local authentication service is included or claimed. Supplied images are used at their exact URLs and the requested Google Fonts stylesheet is loaded in `index.html`; these require network access and remain subject to upstream availability. This is a static design reproduction, not a live race data service. No deployment or push was performed.

Latest validation: production build passed; both browser viewports passed with no script errors, failed asset requests or horizontal overflow. All images and Albert Sans loaded. Counters settled at 227, 374 and 4987; menu navigation and Escape dismissal passed. Screenshots were visually reviewed.
