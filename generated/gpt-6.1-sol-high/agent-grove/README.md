# Agent Grove

Design ID: `agent-grove`. A single-screen **nexum** hero titled **Nexum Hero**, built with React, Tailwind CSS, Vite, and lucide-react. Uses the exact forest video, logo path, copy, Geist typography, Silkscreen stat, glass cards, and responsive text colors. No routes or extra sections.

## Build

From this directory, using the supplied image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static deliverable is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/agent-grove/`. Serve the directory at that path. No deployment was performed.

## Preview

```sh
docker run --rm -u 1000:1000 -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/serve.cjs
```

Open `http://localhost:4173/motionsites-results/agent-grove/`.

## Browser verification

Chromium with the image's `/app/node_modules/playwright-core` checked the real production build at desktop 1440×1000 and mobile 390×844. Reproduce without exposing a host port:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/check.cjs'
```

Checks cover playing/muted/looping video, native media dimensions, loaded fonts, responsive headline colors, bottom positioning, no document overflow, desktop CTA focus and nav hover, mobile menu opening and dismissal through Escape/backdrop/link/CTA, body scroll lock/restoration, and email validation with local confirmation. No uncaught JavaScript errors. The drawer also traps keyboard focus and resets at desktop width.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`, `screenshots/browser-checks.json`. Screenshots freeze video at one second; normal page playback runs continuously.

## Assets and limits

The exact CloudFront video and pravatar URL from `PROMPT.md` remain primary media URLs. Both downloaded successfully; original local copies in `public/assets/` serve as error fallbacks. The preview WebP was only viewed as a visual reference; no screenshot assets were embedded or extracted. No overlay gradient is used.

The exact Google Fonts stylesheet is included. Identical Geist 300/400/500/600/700 and Silkscreen 400/700 TTFs were downloaded from its fonts.gstatic.com URLs; local font-face rules provide reliable rendering. Both font families were verified loaded. An initial generic font assertion included unused Unicode faces; checking actual loaded faces corrected that diagnostic. Google Fonts CSS itself was reachable in the final browser run.

Chromium cancels/restarts some remote video range requests (`net::ERR_ABORTED`) during loading/seeking; the raw report records these. Both viewports passed playback checks using the original video URL. Remote asset availability may change; local copies are bundled.

Navigation destinations and a signup service are unspecified. Links target the existing hero; the form validates and confirms locally without transmitting, registering, or persisting email. The requested pravatar URL currently returns a different portrait from the reference preview; the URL is preserved.
