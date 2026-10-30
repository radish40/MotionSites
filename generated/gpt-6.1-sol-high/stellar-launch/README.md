# Stellar Launch

Design ID: `stellar-launch`. Launchex Awards landing page built with React, Vite, Tailwind CSS, TypeScript and lucide-react. Implements the three specified sections, rounded inset shell, internal scrolling, persistent overlays, chamfered cards, responsive typography and original animated media.

## Run and build

With Node 22: `npm ci`, then `npm run dev` or `npm run build`. The complete static output is `dist/`. Serve it under `/motionsites-results/stellar-launch/`, matching the configured Vite base.

The build command for the supplied environment is:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Dependencies are locked in `package-lock.json`; node_modules is excluded. Nothing was pushed or deployed.

## Assets

Both original MP4s and all three original PNGs are local in `public/assets/`. PNGs came directly from the original CloudFront sources embedded in the specified Higgs proxy URLs, without the proxy's WebP resizing. The reference preview was used only for comparison; no reference image or video is embedded as the page.

The specified external font stylesheet links remain in `index.html`. Local copies of Inter 300/400/500/600/700 and TT Firs Neue provide reliable rendering. Source URLs, sizes and outcomes are in `asset-report.json`. Initial Python HTTP downloads stalled; curl recovered all original files. `scripts/restore-assets.py` records the working recovery method.

Font credits: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), [Google Fonts Inter](https://fonts.google.com/specimen/Inter). The downloaded TT Firs Neue stylesheet retains its provider's attribution notice.

## Validation

The actual TypeScript and Vite production build passed. Chromium checked the built page at its configured subpath using the existing Playwright installation. Detailed results are in `browser-checks.json`.

- Desktop 1440×1000 and mobile 390×844 passed body/section horizontal overflow checks.
- No JavaScript exceptions. Both font families loaded; all three images decoded at 2048px width.
- Hero plays automatically, muted and looping. The submissions video plays when visible; Chromium pauses it offscreen.
- Entry CTA scroll and About navigation passed. Category, Venue, Judges, Connect and founder destination URLs were checked.
- Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional submissions/about screenshots cover both viewports.
- The screenshot script pauses the hero at 0.4 seconds for consistent captures; the actual page loops normally.

Repeat browser checks after installing dependencies:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c '(npm run preview -- --port 4173 > /work/preview.log 2>&1 & server=$!; trap "kill $server" EXIT; sleep 2; node scripts/browser-check.cjs)'
```

## Limits and decisions

The prompt provides three sections, five navigation labels and a page indicator ending in `05`. The specified denominator remains; the current indicator follows the three actual sections. No additional sections or backend were invented. No entry form URL or Venue/Judges/Connect content was supplied. The entry CTA scrolls to submissions; category and remaining navigation links use the supplied Launchex.Hub website in a new tab. External destination content was not tested.

Chromium recorded one `net::ERR_ABORTED` submissions video request per viewport during media range loading. The file subsequently decoded and played with no media error; the raw observation remains in `browser-checks.json`. Local media/fonts avoid reliance on external rendering availability. Checks cover Chromium at the required viewport sizes, not every browser or device.
