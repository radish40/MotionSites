# Wellness Companion

Design ID: `wellness-companion`. A React 18, TypeScript, Tailwind CSS 3, Lucide React, and Vite implementation of the supplied Vitaforge Daily wellness quiz. Built exclusively from this project's `TASK.md` and `PROMPT.md`.

The page includes the phone bezel and Dynamic Island, exact background artwork, Helvetica Now Var, liquid glass borders, staggered entrance animations, four toggleable wellness cards, a voice control, and a pointer-driven confirmation slider. Stress and Skin start selected. Dragging past 85% confirms; shorter drags return to the start. Changing a choice resets confirmation. The slider also supports keyboard confirmation with Right Arrow, End, Enter, or Space. Reduced-motion preferences are respected.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/wellness-companion/` on the development or preview server. The production build is in `dist/`, including `dist/index.html`; all application resource paths use the required base path. The lockfile is included. `node_modules/` is ignored and is not a deliverable.

On the supplied host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

The real production build was served at its required subpath inside a temporary Docker container and checked using Chromium with Playwright Core. To repeat:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

Verified desktop 1440×1000 and mobile 390×844, default selections, card toggles, short-drag snap-back, long-drag confirmation, confirmation reset, keyboard confirmation, voice fallback feedback, font and background loading, and local image fallback with the remote URL blocked. No page errors, console errors, failed external asset requests, horizontal overflow, or internal content overflow occurred in the final normal-load checks. `npm audit` reported zero vulnerabilities.

Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`. Detailed browser results are in `screenshots/browser-checks.json`. Screenshots capture the initial screen after entrance animations finish. The desktop handset is exactly 375×780; at 390px viewport width, its content width becomes 352px so the bezel remains visible without horizontal scrolling. Its height remains 780px.

## Assets and limits

The background loads from the exact Higgs URL in `PROMPT.md`, with a bundled copy of those same bytes used if that request fails. The exact supplied OnlineWebFonts stylesheet is loaded; the corresponding Helvetica Now Var WOFF2 is also bundled for reliable font rendering. Both supplied URLs responded successfully, and both assets loaded in Chromium. Font source credit: [Web Fonts / OnlineWebFonts](http://www.onlinewebfonts.com/fonts), as requested by the supplied stylesheet. No generated or substitute photography is used.

Voice uses the browser's SpeechRecognition API when supported and requires microphone access and the browser's speech service. The unsupported-browser path was verified; real microphone capture and live transcription were not tested in the headless environment. Selection and confirmation operate locally; this design has no backend or persistence. No deployment, push, or external messages were performed. `ready` means ready for review, not live.
