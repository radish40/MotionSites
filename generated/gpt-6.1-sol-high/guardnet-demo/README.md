# Guardnet Demo

React + TypeScript implementation of the two sections in `PROMPT.md`, styled with Tailwind CSS. Includes the exact remote video and Futura font import, supplied SVG company marks, responsive cards, and gradient buttons. Production assets use `/motionsites-results/guardnet-demo/` as their base path.

## Build and run

With Node.js 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/guardnet-demo/`. The publishable static files are in `dist/`, including `dist/index.html`.

On the supplied host, run from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Only React is used at runtime; Tailwind, TypeScript, Vite, PostCSS, and Autoprefixer are build tooling. The lockfile is included; `node_modules` is excluded from the deliverable.

## Verification

The production build passed TypeScript checking and Vite compilation. The actual built site was served through Vite preview at the required subpath and checked with the supplied Chromium and Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

Run `npm ci` first if dependencies have been removed. Verification uses the image's existing Playwright installation and adds no app dependencies.

- Desktop: 1440 × 1000; 1400px wrapper; four company columns.
- Mobile: 390 × 844; two company columns.
- Both: no horizontal overflow, all buttons within the viewport, no JavaScript errors or HTTP error responses.
- Exact remote font loaded; video loaded at 1920 × 1080 and advanced while muted and looping.
- Ghost hover changes text to white; keyboard focus is visible; all three buttons accept clicks.
- Full-page screenshots were captured and visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Raw observations are saved in `screenshots/browser-checks.json`.

## Assets and limits

The remote font stylesheet and video were reachable during validation. Chromium reported two `net::ERR_ABORTED` video requests per viewport during loading; subsequent loading and playback succeeded at readyState 4 in both checks. No asset replacement was needed. Continued video/font availability depends on their external hosts.

Font source and attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), with CC BY 4.0 attribution as supplied in its stylesheet. The exact font import URL is retained in `src/index.css`.

The prompt defines button presentation and hover behavior but no verification service, modal, destination, or demo workflow. Buttons retain the prescribed presentation and native interaction without adding these features. All motion comes from the background video. No deployment or push was performed. `ready` means ready for review, not deployed.
