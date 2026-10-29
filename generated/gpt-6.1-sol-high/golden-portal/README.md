# Golden Portal

Project ID: `golden-portal`. The page brand and document title are **Digital Archive**, as required by `PROMPT.md`.

A responsive cinematic gallery showcase built with React 18, Vite, TypeScript, Tailwind CSS 3, and lucide-react. It includes the looping supplied video, floating glass navigation, editorial typography, layered image transitions, Still Frame showcase, complete six-question interview, scroll reveals, parallax clouds, quote banner, and fixed footer.

## Build

Node 22 and npm are available through the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The production output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/golden-portal/`; all bundled assets use that prefix. `package-lock.json` records the dependency versions. `node_modules/` is excluded from version control and is not part of the deliverable.

With local Node installed, use `npm ci`, `npm run dev`, or `npm run build`. To preview the production files, `node scripts/serve.cjs` serves the page at `http://localhost:4173/motionsites-results/golden-portal/`. This is a temporary local verification server; no deployment has been performed.

## Validation

The actual TypeScript and Vite production build passed. Chromium was driven through the image's existing `/app/node_modules/playwright-core`:

```bash
# In a Docker container with this project mounted at /work:
node scripts/serve.cjs &
node scripts/check-browser.cjs
```

The browser script checks desktop 1440×1000 and mobile 390×844, video decoding/autoplay, fonts, image decoding, horizontal overflow, all scroll reveals, both gallery CTAs, every navigation anchor, home navigation, and desktop privacy/terms dialog dismissal. It captures script errors, HTTP errors, and failed requests in `browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-full.png`
- `screenshots/mobile-full.png`

The full-page captures are taken after scrolling to activate every reveal. Fixed navigation/footer appear at the capture's current scroll position in those full-page images. The viewport screenshots show their normal positions.

## Asset provenance and limitations

The exact video and both Higgs scene-image URLs from the prompt downloaded successfully. They are hosted locally in the build. The hero poster is a frame extracted from that same video, not a preview screenshot. Arsenica's direct WOFF2 and Google's Inter 300/400/500/600 font files are local, with the specified stylesheet URLs also retained in `index.html`. The initial Python request to the Arsenica stylesheet returned 403; the font binary succeeded, and local fonts provide reliable rendering.

All three supplied Cloudinary assets return HTTP 401 with `cloud_name dy5er7kv5 is disabled`, including retries without the transformation path:

- `top-bg_j88wyu.png`: replaced by a transparent, masked crop from the supplied showcase scene.
- `bottom_bg_liw6lc.png`: replaced by a masked crop from the same supplied scene.
- `dove_xpaeub.png`: omitted because the requested image is unavailable. Doves remain visible in the original hero video.

These are documented asset limitations, not claims of exact visual equivalence. `asset-report.json` preserves source URLs and download results. `scripts/prepare-assets.cjs` generates the two cloud fallbacks and video poster. `scripts/download-assets.py` is a source-download utility; rerunning it attempts the original unavailable Cloudinary assets again, so regenerate fallbacks afterward.

The fixed footer's social links point to the corresponding service homepages because no gallery-specific social URLs were provided. Policy links open brief notices about this showcase. Gallery/Talents/Journal/Story and CTA links navigate to the related page sections; no additional archive routes were invented.

Chromium may report `net::ERR_ABORTED` for the initial MP4 request when it switches to a ranged media request. Decoding and autoplay are checked separately and must pass. External social destinations are not clicked by automated checks. No backend, accounts, analytics, or remote publishing is included.
