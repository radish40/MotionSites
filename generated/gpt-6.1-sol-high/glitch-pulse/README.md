# Glitch Pulse

A React + TypeScript + Vite + Tailwind CSS v4 scroll-driven landing page built from this project's `PROMPT.md`. The page title is **Scroll Video**, as specified. A 1200vh document drives two paused HLS videos, a 22-unit deletion headline, rolling manifesto, sequential sticker trail, and feedback form.

## Run and build

Requires Node 22 and npm. All dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm run build
npm start
```

The Express server listens on port 3000. Open `/motionsites-results/glitch-pulse/`. Vite's asset base is configured for that exact path. `dist/` contains the complete static production build; a static host can mount that directory at the same path.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

Real TypeScript checking and Vite production build completed. Chromium with Playwright was run against the production Express server at 1440×1000 and 390×844. `browser-report.json` records video readiness and seeking, crossfade opacity, headline deletion, sequential trail cycling/expiry, Contact navigation, native input validation, submit/reset/close/reopen states, mobile form bounds, horizontal overflow, and JavaScript errors.

Screenshots are in `screenshots/`: `desktop.png`, `mobile.png`, `manifesto.png`, `feedback.png`, `mobile-feedback.png`, and `success.png`. The reproducible browser script is `scripts/browser-check.cjs`; it uses the Chromium and Playwright installation in the specified Docker image.

## Assets and limitations

All nine exact supplied Figma PNGs are copied into `public/assets/`, retaining `referrerPolicy="no-referrer"` on every image. Initial Python requests received HTTP 403; retrying the same URLs with curl succeeded for all nine. `asset-report.json` preserves the initial diagnostics; `asset-report-curl.json` records the successful retries.

The required Google Fonts CSS import remains, with an additional locally stored copy of the exact Press Start 2P font as a fallback. Both original Mux streams loaded and decoded successfully in Chromium. Video playback continues to require network access to Mux. Native HLS fallback is implemented for Safari, but Safari was not available for testing.

The feedback form implements the prompt's client-side success/reset interaction. The specified Express server has no submission endpoint or database, so submissions are not persisted despite the required success copy. Navigation items move within the scroll experience; no additional pages are created. A narrow-screen navigation spacing adjustment prevents clipped links at 390px.

Vite reports a bundle size advisory because hls.js is included. This does not prevent the build. Nothing has been deployed or pushed.
