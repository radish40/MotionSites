# Pro AI Deck

Design ID: `pro-ai-deck`. A seven-slide Studio pitch deck implemented from the complete local `PROMPT.md` using React 18, TypeScript, Vite 5, Tailwind CSS 3, Motion (`motion/react`), hls.js, and Lucide React.

The page uses real DOM text, controls, glass cards, animated headings, slide transitions, and the nine original video assets. It supports arrow keys, Space, mouse wheel, horizontal touch swipes, direct slide indicators, and previous/next buttons with an 800 ms navigation cooldown. Mobile layouts compact cards and typography to keep the presentation within the viewport. Reduced-motion preferences shorten transitions.

## Build and run

Dependencies are pinned by `package-lock.json`. Node 22 can be supplied by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The production build is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/pro-ai-deck/`. Serve the build at that prefix. For local preview:

```bash
docker run --rm -p 4173:4173 -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --host 0.0.0.0'
```

Open `http://localhost:4173/motionsites-results/pro-ai-deck/`. No deployment or push was performed.

## Assets

All five original CloudFront MP4s were retrieved unchanged into `public/assets/`; the other four original Mux HLS sources are played through hls.js. `asset-checks-curl.json` records the nine successful downloads, source URLs, and sizes. `scripts/fetch-assets.py` reproduces asset retrieval. The downloaded HLS master manifests are archival copies; runtime uses the specified remote URLs and their rendition playlists and segments.

The exact Google Fonts link tags load Instrument Serif, Barlow, and Material Symbols Rounded. Google Fonts and Mux require internet access. The optional `/home/opc/motionsites/assets/previews/pro-ai-deck.webp` reference did not exist; no preview extraction or substitute artwork was used. An initial Python network fetch stalled; retrying with curl recovered all original assets.

## Validation

`npm run build` runs TypeScript and the real production Vite build. `scripts/browser-check.cjs` uses the existing Docker image's Playwright and Chromium against the built preview server. It checks 1440×1000 desktop and 390×844 mobile, all seven slides, JavaScript errors, font availability, video decode readiness, document overflow, and text/control bounds. It also exercises direct indicators, previous navigation, Get Started, keyboard, mouse wheel, and a real Chromium touch gesture. Results are saved in `browser-checks.json`.

The required screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; additional screenshots capture each slide at both viewport sizes. These are browser captures of the implemented page. The automated touch test was corrected to use Chromium's touch API after a synthetic TouchEvent construction failed in the initial test harness.

## Limits and integration choices

Get Started opens Next Steps. Book a Call and View Pricing open addressed email enquiries; the contact details use `mailto:` and `tel:`. Privacy and Terms request those documents by email. The prompt supplies no booking URL, pricing data, or legal pages; no service backend or legal content has been invented. External mail/telephone application behavior was not exercised.

The original videos and low-opacity text are retained as requested, so contrast varies with the moving backgrounds. Browser coverage is Chromium at the two specified sizes, not every browser/device. The build reports a large JavaScript chunk due to the requested animation/video libraries. `dependency-audit.json` records npm's two development-tool advisories (Vite and esbuild, one high and one moderate); the required Vite 5 stack is preserved. `node_modules` is excluded from delivery and can be restored with `npm ci`.

`ready` in `result.json` means available for management-session review, not published.
