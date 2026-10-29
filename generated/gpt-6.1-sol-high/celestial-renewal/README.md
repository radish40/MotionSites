# Celestial Renewal

Design ID: `celestial-renewal`. A two-section Serene beauty and wellness landing page built from `PROMPT.md` using React, TypeScript, Vite, and Tailwind CSS. The page includes the supplied celestial video, Google Fonts, glowing pill links, a fixed responsive navbar, an animated mobile menu, a video mute toggle, and a rainbow/cloud quote section with requestAnimationFrame and lerp parallax.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 4173
```

Open `http://localhost:4173/motionsites-results/celestial-renewal/`. The Vite base is set to that exact subpath. The complete static delivery is `dist/`, including `dist/index.html` and all video/image assets. Google Fonts remain externally loaded through the exact stylesheet specified in the prompt.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

`browser-check.cjs` uses the existing image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. Start the preview server and run that script inside the same temporary container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && (npm run preview -- --port 4173 & sleep 2; node browser-check.cjs)'
```

Verified at 1440×1000 and 390×844: two viewport-height sections; autoplay, muted inline video; loaded local images and all three fonts; no horizontal page overflow; sound mute/unmute; CTA scrolling; mobile menu opening, Escape closing, and link closing; animated rainbow transforms and desktop cloud entry; and no browser script/console errors or failed asset requests. TypeScript and the production Vite build pass. `npm audit` reports zero vulnerabilities for the saved lockfile.

Screenshots:

- `screenshots/desktop.png` and `screenshots/mobile.png`: full-page captures at the required viewport sizes. The video is paused at three seconds for repeatable captures.
- `screenshots/desktop-quote.png`, `screenshots/mobile-quote.png`: scrolled quote section.
- `screenshots/mobile-menu.png`: expanded mobile navigation.
- `screenshots/browser-report.json`: recorded browser assertions and asset/font status.

## Scope and limitations

Only the two requested sections are implemented. The prompt specifies no booking service, contact address, or additional content pages, so the navigation and consultation links lead to the existing philosophy section. No booking submission or backend is implied. The sound control toggles the supplied video's mute state; no additional soundtrack was introduced. Reduced-motion preferences disable menu transition timing and parallax movement. Cloud percentage offsets are resolved against cloud-width positioning containers so the specified overhangs leave visible clouds at the viewport edges.

All three supplied assets were downloaded successfully and packaged unchanged under `public/assets/`. Google Fonts loaded successfully during both browser checks; future access still requires a connection to Google. The source video is approximately 13.3 MiB and retains its original resolution. Nothing has been deployed or pushed. `ready` means ready for review.
