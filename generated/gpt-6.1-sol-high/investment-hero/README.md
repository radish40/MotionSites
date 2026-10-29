# Investment Gate

Design ID: `investment-hero`. The page is branded **VELORA** and titled **VELORA - Premium Real Estate**, as specified in `PROMPT.md`.

Implemented with React 18, TypeScript, Vite, Tailwind CSS 3.4 and lucide-react (Home icon only). Includes the one-shot video introduction with 700 ms fade, looping hero video, responsive typography, animated bottom navigation and popup menu, and the full 900vh scroll-driven image and text sequence.

All supplied media and both font families are bundled in `public/assets/`. The two required external font stylesheet links remain in `index.html`; local font declarations make rendering independent of those services. Source URLs, checksums and download notes are in `asset-report.json`. Haboro font source/credit: [Online Web Fonts](https://www.onlinewebfonts.com/fonts). Geist is provided by Google Fonts.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/investment-hero/` on the printed server URL. Vite uses this exact base path. The completed static build is in `dist/`, including `dist/index.html` and all media/font files.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` pins dependencies. `node_modules/` is excluded from delivery.

## Browser verification

The actual production build was tested with Chromium and the image's existing playwright-core at **1440×1000** and **390×844**. Both passed:

- Splash video naturally reaches its `ended` event and unmounts.
- Hero video decodes; all three gallery images and Haboro/Geist fonts load, including all four requested Geist weights.
- Menu opens, morphs to a 56px close control, closes with Escape and outside click, and navigates to Properties. Home returns to the hero. Desktop contact opens the menu; email and phone links use their native protocols.
- All eight scroll phases update correctly with no horizontal layout overflow.
- No uncaught browser script errors.

`browser-report.json` contains the results; `build.log` and `browser-check.log` preserve execution output. Two video requests were cancelled by Chromium during seek/context teardown (`net::ERR_ABORTED`); decoding and actual playback passed, and no unavailable assets were observed.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional menu and gallery screenshots cover both viewports. Hero screenshots freeze the real video at two seconds for reproducibility; the delivered page plays continuously.

To repeat the checks after installing dependencies and building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 5173 > preview.log 2>&1 & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/browser-check.cjs'
```

## Behavior and limits

Menu destinations move to the relevant portion of the supplied scroll experience; Contact focuses the email link. Get in touch uses the supplied email address. No backend or extra pages were requested. The splash has an error/stall fallback after 20 seconds so unavailable media cannot block entry; normal video completion was verified on both viewports. Browser checks cover Chromium at the requested sizes; Safari and Firefox were not tested.

`ready` means ready for management-session review. This project has not been deployed or pushed.
