# Evergreen Finance

Design ID: `evergreen-finance`. A Kova fintech landing page built from the supplied `PROMPT.md`: full-screen video hero, animated dashboard cards, Arcvex testimonial, and four feature cards. Uses React 18, Vite, TypeScript, Tailwind CSS 3, Framer Motion, and Lucide React. The palette, copy, responsive breakpoints, and Cooper typefaces follow the prompt.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/evergreen-finance/`. Vite's base is configured for that exact path. The complete static build is in `dist/`, including `dist/index.html` and all media. No deployment or push was performed.

The build used in this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Assets and behavior

All five specified media assets were downloaded from their original URLs and are served locally. Both original font stylesheet links remain in `index.html`; local copies of the exact WOFF2 fonts also ensure reliable rendering. Sources and download sizes are recorded in `asset-report.json`. Fonts supplied by [OnlineWebFonts](https://www.onlinewebfonts.com/fonts); the supplied stylesheet identifies its license as CC BY 4.0.

`BoomerangVideoBg` initially plays the muted, inline source video and captures decoded frames with `requestVideoFrameCallback`, with an animation-frame fallback. Captured canvases use a maximum width of 640px on desktop and 480px on mobile, within the specified 960px limit. At the video's end, the visible canvas plays forward and backward at 30fps. This keeps frame-buffer memory lower while retaining the specified behavior.

The mobile menu opens, navigates, and closes. Both demo buttons open a dismissible video dialog; All Stories opens the supplied testimonial. App buttons open a clearly identified preview dialog because no store URLs or registration service were supplied. Chart period controls update the sample dashboard. Dialogs support Escape, focus containment, and focus restoration.

## Verification

The production build passed TypeScript and Vite compilation. Real headless Chromium checks use the production files at the configured subpath, with desktop **1440×1000** and mobile **390×844** viewports. They check video-to-canvas playback, image loading, font availability, horizontal overflow, script errors, mobile navigation, dialogs, and chart period selection.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Detailed results: `browser-checks.json`. Full-page screenshots captured after scrolling through all reveal animations: `screenshots/desktop.png` and `screenshots/mobile.png`.

## Limits

This is a static frontend preview. No financial backend, account creation, or app distribution is connected. The “Watch 30s Demo” label is preserved exactly, while its dialog uses the supplied hero clip because no separate 30-second demo was provided. Runtime frame capture requires browser video playback and canvas support, and consumes memory proportional to the source clip length. The original external font stylesheet links depend on third-party availability; bundled fonts provide local rendering.

Browser font diagnostics contain duplicate external and bundled faces: the local Cooper Light and Medium faces both report `loaded`, and their hashed local WOFF2 requests succeeded. The aggregate `document.fonts.check` reports false for the still-unloaded duplicate external definitions. A desktop `ERR_ABORTED` media request occurred when a demo dialog was dismissed; both background playback checks passed.
