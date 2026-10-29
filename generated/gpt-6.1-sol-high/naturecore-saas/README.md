# Naturecore SaaS

Design ID: `naturecore-saas`. A full-screen renewable energy hero built from `PROMPT.md` with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. Includes the specified copy, responsive navigation, Inter typography, staggered heading, delayed content transitions, CTA styling, glass utility, and boomerang video background.

## Build and run

With Node 22/npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/naturecore-saas/` on the server. Vite's base is set to that exact path. The publishable static output is `dist/`; no deployment was performed.

The build used on this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules` is excluded from delivery.

## Browser validation

Run the included static-server/Playwright check against the production output:

```sh
docker run --rm --shm-size=1g -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Uses the image's `/usr/bin/chromium` and `/app/node_modules/playwright-core`. The server exists only for the check and closes afterward. Checks desktop 1440×1000 and mobile 390×844, actual media decoding, Inter and logo loading, responsive navigation, page overflow, CTA clicks, keyboard focus, script errors, the video-to-canvas transition, and reverse playback. Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; measured results are in `screenshots/checks.json`.

## Assets and limits

- The exact supplied CloudFront MP4 was downloaded unchanged to `public/energy.mp4` and is served locally. Initial playback is a muted inline video; frames are captured at up to 960px wide and replayed forward/reverse on canvas at 30fps. Per-frame capture uses `requestVideoFrameCallback`, with a 60fps interval fallback. Captured canvases consume memory while the page is open, as required by the specified implementation.
- The prompt references the owner's `/image.png`, but no logo file was supplied. `public/image.png` is a simple generated LGPSM text fallback, not the owner's original logo. Replace it with the supplied logo when available. Its reproducible generator is `scripts/create-logo.cjs`.
- Inter weights 300–900 load from the exact Google Fonts CSS URL in the prompt. This external font still requires network access.
- The container initially lacked the plant emoji glyph. A 3.5KB Noto Color Emoji subset for the three specified emojis is served locally as `public/emoji.woff2`; its SIL Open Font License is included.
- Navigation destinations, authentication, and CTA workflows are not defined by the prompt. Navigation links point to the current hero; CTA buttons provide the specified visual, hover, pressed, and keyboard focus states. No extra sections, account service, or network signup flow was invented.
- Chromium may abort its initial MP4 request when switching to ranged media reads. The check records this request event; media decoding, completed playback, and reverse canvas playback are verified separately.

`result.json` reports readiness for review only. This project was not pushed or deployed.
