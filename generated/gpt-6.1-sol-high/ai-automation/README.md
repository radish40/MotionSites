# AI Automation

COGNITRA's single-page AI agency design, implemented from `PROMPT.md` with React, Vite, Tailwind CSS, Framer Motion, and Lucide React. Includes the specified three sections, fixed background video, transparent navigation, reusable polymorphic `FadeUp`, service videos, responsive layout, scroll indicator, and repost control.

## Run and build

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The Vite base is `/motionsites-results/ai-automation/`. The complete static build is in `dist/`, including `dist/index.html`. Serve it at that subpath. Dependencies are locked in `package-lock.json`; `node_modules` is excluded from delivery.

On this host, Node and Chromium are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser verification

`scripts/browser-check.cjs` uses the image's `/app/node_modules/playwright-core` and `/usr/bin/chromium`. It checks the production preview at 1440×1000 and 390×844, asset loading, decoded videos, visible video playback, navigation, service cards, clipboard repost, button hover, email link configuration, browser errors, and horizontal overflow.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run preview -- --port 4173 > /work/screenshots/preview.log 2>&1 & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/browser-check.cjs'
```

Screenshots and the detailed machine-readable report are in `screenshots/`. Required first-viewport captures are `desktop.png` and `mobile.png`; supplemental statement and services captures show the remaining sections. All browser checks passed at both required sizes with no script errors, failed assets, or horizontal overflow.

## Assets and implementation notes

All four original CloudFront MP4s are used directly, with autoplay, muted audio, looping, and inline playback. Helvetica Now Var is imported from the exact specified stylesheet. A second font-face declaration exposes the same font file's variable weight range because the supplied stylesheet declares only regular weight. The font provider's attribution link is [OnlineWebFonts](https://www.onlinewebfonts.com/fonts).

External font and video hosting requires network access. Chromium may pause offscreen service videos; playback is verified when those cards become visible. The browser report retains canceled MP4 stream requests (`net::ERR_ABORTED`) separately; all four videos decoded, all visible videos played, and no media error was reported. Autoplay also depends on the visitor's browser policies.

The prompt supplies navigation labels but no case studies, prices, team content, booking destination, or contact address. MAIN returns to the hero; OFFERING and RATES go to services; CASE and CREW go to the statement. OUR PRODUCTS and the scroll indicator go to services. BOOK A CALL! and CONNECT open an email draft with a prefilled subject/body and no recipient. A real address or booking URL is still needed for direct inquiries. No email was sent during verification. REPOST uses native sharing where available, otherwise copies the current URL and displays confirmation.

No deployment or publishing was performed. `ready` in `result.json` means ready for review of the local deliverable.
