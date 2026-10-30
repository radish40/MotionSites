# NexaCore

Enterprise infrastructure operations landing page built from this project's `PROMPT.md`. Design ID: `nexacore-hero`. The page uses real React components, text, controls and animated media across the Navbar, Hero, TrustedSection, FreedomSection and PrecisionSection.

React 18.3, TypeScript 5.5, Vite 5, Tailwind CSS 3.4, lucide-react and hls.js. The Supabase client is installed but intentionally unwired. The prompt's `@supabase/Bolt Database-js` is not a valid npm package name; `@supabase/supabase-js` is used as the available database SDK.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

Open `/motionsites-results/nexacore-hero/`. Vite's base is set to this exact subpath. `dist/` contains the complete static build, including `dist/index.html`; it has not been deployed.

The build was run in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run typecheck && npm run lint && npm run build'
```

## Assets

All eleven supplied asset URLs were retrieved successfully. `asset-report.json` records the exact sources, sizes and download results. `scripts/download-assets.py` reproduces the downloads. Fonts, service imagery, icons and section backgrounds are served locally from the original files. Font declarations retain the supplied remote WOFF2, WOFF and TTF fallbacks. Hero video uses the exact required remote URL with a local copy as an error fallback. HLS uses the exact Mux URL and requested hls.js configuration, with native HLS fallback and cleanup on unmount.

No original visual preview existed at the specified NexaCore preview path. No screenshot extraction or replacement imagery was used. The Control chip's heart SVG was reconstructed from the textual description because the prompt mentions an exact path but supplies no path data.

## Verification

`npm run typecheck`, `npm run lint` and `npm run build` passed. `verification.log` records these checks. The build reports a nonfatal chunk-size warning because hls.js is included in the main bundle.

`scripts/browser-check.cjs` serves the real production build in a temporary local HTTP server and checks it with Chromium / Playwright at 1440×1000 and 390×844:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

Results are in `browser-report.json`. Checks cover font loading, both video playback states, fixed navbar contraction, desktop anchor navigation, mobile menu, card hover and keyboard focus, Learn more navigation, search filtering and dismissal, JavaScript errors, failed network requests and horizontal overflow across every section. Full-page screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; media is loaded before capture. The animated hero's exact frame varies by capture time.

## Limits

Contact opens the user's email composer with an inquiry subject. No recipient was supplied in the prompt, so it intentionally has no recipient. Navigation points to the provided sections; Learn more leads to Our Method. Search searches the four navigation destinations. No backend, contact submission, analytics, deployment or extra pages are included.

Chromium was tested; native Safari HLS behavior was implemented but not tested in Safari. The external streaming services still require network access. Chromium may report aborted hero media range requests while reusing a successfully playing video; the playback checks record actual decoded dimensions, time and ready state. The requested Vite 5 toolchain currently reports two npm audit findings (one moderate, one high); dependency major versions were retained to match the requested stack.
