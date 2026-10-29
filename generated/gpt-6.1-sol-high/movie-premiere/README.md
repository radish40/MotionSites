# Movie Premiere

Design ID: `movie-premiere`. The page is branded **Cineva Mobile UI**.

A single centered 375 × 780 px iPhone mockup with a blurred poster background, Dynamic Island, folder tabs, date, four visible stacked cards, and glass bottom navigation. Built with React 18, TypeScript, Vite, Tailwind CSS 3.4, and Lucide React. No routing, database, or additional UI libraries.

Swipe a poster downward more than 80 px to dismiss it. The 480 ms exit animation finishes before the six-poster order rotates and the blurred background updates. Short and upward drags keep the current poster. Pointer capture supports mouse and touch. Focus the front poster and press Enter, Space, or Arrow Down for keyboard operation. Tabs and bottom navigation update their selected state; they are visual controls in this showcase, without additional screens.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the Vite server at `/motionsites-results/movie-premiere/`. The configured base path is `/motionsites-results/movie-premiere/`; the publishable files are in `dist/`, including `dist/index.html`. The build also type-checks TypeScript. A dependency lockfile is included.

On the supplied host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check starts a temporary HTTP server serving the production build at the required subpath, and uses the image's installed Chromium and Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440 × 1000 and mobile 390 × 844; image and Inter font loading; phone dimensions; viewport overflow; every tab and navigation selection; short, upward, and downward drags; all six cards rotating; keyboard dismissal; background synchronization; and mobile touch swiping. Script errors, console errors, failed requests, and HTTP error responses fail verification.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

## Assets and limits

All six exact poster URLs from `PROMPT.md` were downloaded successfully and are served locally in `public/assets/`. Google Fonts Inter weights 300–900 were downloaded from the Google Fonts stylesheet and are also served locally, with the global font rule required by the prompt. `asset-manifest.json` records source URLs. No generated or substitute poster imagery is used. The delivered app makes no external asset requests.

The mockup retains its 375 × 780 internal dimensions; at mobile widths it is scaled to 94% so its device bezel fits the 390 px viewport. The required desktop and mobile sizes were checked in Chromium. This is a visual showcase, without movie detail pages or persistent account/queue functionality. No deployment or push was performed.
