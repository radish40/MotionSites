# No-Code Waitlist

Design ID: `no-code-waitlist`. A single-screen Asme landing page implemented with React, Vite, Tailwind CSS v4, Motion, Lucide React, and hls.js. Includes the specified glass navbar, Instrument Serif hero, animated early-access form, typewriter placeholders, confirmation/reset sequence, and fullscreen Mux background video.

## Run and build

Requires Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

This host uses the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Vite's base is `/motionsites-results/no-code-waitlist/`. The complete static build is in `dist/`, including `dist/index.html`. Serve that directory at the configured base path. No deployment was performed.

## Verification

The browser check starts an isolated HTTP server and uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Checks cover desktop 1440×1000 and mobile 390×844, HLS playback, Google Fonts, document overflow, the typewriter placeholder, invalid email rejection, submit confirmation, four-second reset, Sign Up, demo opening/Escape dismissal, and mobile form width. Evidence: `screenshots/checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots were visually inspected.

## Assets and limits

- Video uses the exact live Mux HLS URL specified in PROMPT.md. Native HLS is selected where available; other supported browsers use hls.js. Actual Chromium playback verified. Safari native HLS was not tested.
- Inter (300/400/500/600) and Instrument Serif (regular/italic) load from Google Fonts. Both font families verified in Chromium.
- The supplied `/home/opc/motionsites/assets/previews/no-code-waitlist.webp` was viewed only as a composition reference. No screenshot, extracted artwork, or replacement video is used in the page.
- External video and fonts require connectivity; no asset recovery was necessary. HLS adapts resolution to connection conditions and screenshots capture a moment in the moving background.
- Email capture implements the requested frontend interaction. There is no backend, mailing-list integration, persistence, or actual notification delivery. The confirmation wording follows the prompt.
- No authentication service or product/pricing destinations were specified. Navigation opens compact local information dialogs; Login explains that Asme is coming soon and offers early access. The demo dialog plays the supplied video with controls because no separate demo asset was provided.
- No pushes, deployment, other sessions, agents, or messages were created. Work and generated artifacts remain inside this project.

The production build passes with a non-blocking Vite size warning for the hls.js chunk (598.08 kB minified). Final browser checks report no script errors, console errors, or failed requests.
