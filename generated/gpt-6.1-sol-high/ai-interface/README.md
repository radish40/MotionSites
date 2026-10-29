# AI Interface

Design ID: `ai-interface`. The page is titled **Cortex — Mind Amplified.** and implements the complete design supplied in `PROMPT.md`.

React 19, Framer Motion 12.42.2, Tailwind CSS 3 and Vite power the page. It retains the exact copy, Inter Tight font weights, supplied video and image, floating navigation, character/word blur reveals, scroll-scrubbed video, section fades, sticky three-stage interface and background scaling. Media and fonts are downloaded into `public/assets/`; the production page needs no third-party runtime requests. Provenance and hashes are in `asset-report.json`.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/ai-interface/` on the preview server. The Vite base is set to that exact path. `dist/` contains the complete static deliverable, including `dist/index.html`. No deployment was performed.

On this host, use the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The built files were served with `scripts/serve.cjs`, including byte-range support for the video. Playwright with the image's Chromium checked desktop **1440×1000** and mobile **390×844**:

- Loaded local fonts, video metadata/frames and the supplied background image.
- Exercised Discover Cortex, all four header links and a capability link; checked the Developer/Support targets remain visible.
- Confirmed that scrolling advances the video and reveals all three interface text stages.
- Checked script/console errors, failed requests and horizontal overflow.
- Saved the hero, about and three interface-stage screenshots at both viewports.

Reproduce in the supplied Docker image from `/work`:

```sh
node scripts/serve.cjs &
node scripts/check.cjs
```

The browser script uses `/app/node_modules/playwright-core` and `/usr/bin/chromium`, as provided by the image. `browser-checks.json` records measured results. `screenshots/desktop.png` and `screenshots/mobile.png` are the required hero captures; additional screenshots show the remaining sections. `npm-audit.json` records zero reported vulnerabilities. `build.log` records the successful production build; Framer Motion emits harmless bundler notices about ignored `use client` directives in this client-only app.

## Implementation notes and limits

The original source references unavailable React 19 UMD entry points and browser transpilation. This implementation bundles the requested React/Framer Motion/Tailwind stack with npm instead. Its missing fragment IDs are repaired: Cortex opens the hero, Discover opens Neural Extension, Interface opens the first interface stage, Developer and Support expose existing capability content, and capability rows open the interface. The prompt supplies no developer portal, support service, or capability detail pages, so none were invented.

Small-screen hero spacing prevents clipping while preserving the supplied layout. The supplied video stays paused and seeks with scrolling; it is intentionally not an autoplay loop. Verification covers Chromium at the two requested viewport sizes; other browsers and physical devices were not tested. `ready` means ready for management-session acceptance, not published.
