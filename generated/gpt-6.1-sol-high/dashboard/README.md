# Dashboard UI

Conference Dashboard built from `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS, and lucide-react. The interface includes eight room cards, liquid glass surfaces, the supplied light/dark background videos, Inter from Google Fonts, responsive layouts, and animated voice indicators.

## Run and build

Requires Node 22 and npm. Install the locked dependencies with `npm ci`, then run `npm run dev`. Run `npm run build` to generate the static site in `dist/`.

The configured public base is **`/motionsites-results/dashboard/`**. Serve `dist/` at that path. `dist/index.html` and all bundled media are included; this project has not been deployed.

In the provided environment, build with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Interactions

The theme switch swaps the playing background video and card palette. Rooms is selected initially; Dashboard and Rooms change the active view button. Camera and microphone buttons toggle their icons and red disabled states. The meeting alert can be dismissed. Drag the shared-screen strip horizontally, or use native touch scrolling. The insights play button animates the activity chart.

Profile, settings, participant, room creation, and room search controls open lightweight local dialogs. Room creation and settings use in-memory state. Escape closes dialogs. No database, authentication, media recording, real meeting service, or Supabase configuration is required.

## Assets

The exact video, avatar, and thumbnail URLs supplied in the prompt were fetched into `public/assets/` and copied to `dist/assets/`. `asset-manifest.json` records the 38 source URLs and downloaded file sizes. `scripts/download-assets.py` can refresh them using Python 3 and curl. No image or video substitutions were needed. Inter weights 300–700 load through the requested Google Fonts stylesheet; that font request still requires internet access. All font and media requests succeeded in Chromium validation.

## Verification

The production build passed TypeScript and Vite. Real headless Chromium tests used the built site at the configured subpath, not the development server. Reproduce after building with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script starts and closes an internal temporary HTTP server. It checks 1440×1000 desktop, 390×844 mobile, and a 1000×900 tablet viewport; four/two/one-column layouts; eight cards; image loading; light and dark video playback; Inter availability; theme switching; view selection; microphone/camera states; alert dismissal; screen dragging; insights animation; room search/creation; settings; and participants. It also checks horizontal overflow, console/script errors, failed requests, and the fixed video after scrolling on mobile. Test failures return a nonzero exit code.

Evidence:

- `screenshots/desktop.png` — 1440×1000, light mode.
- `screenshots/desktop-dark.png` — 1440×1000, dark mode.
- `screenshots/mobile.png` — 390×844, light mode.
- `screenshots/mobile-scrolled.png` — 390×844, lower cards and fixed controls.
- `screenshots/browser-checks.json` — measured results and error/request logs.

The page is a visual conferencing dashboard with local UI state. Browser controls do not access physical microphones or cameras. Video frames vary naturally between captures. The original videos total approximately 53 MiB. No deployment or remote write was performed.
