# Editorial Collection CTA

Design ID: `editorial-collection-cta`. Implements the “Stay in the collection” newsletter section from PROMPT.md using React, Vite, Tailwind CSS, and Framer Motion. The reusable component is `src/StaySection.jsx`.

The page preserves the exact CloudFront video source, Google Fonts, copy, dimensions, untinted video, and shared blur-up viewport animation with a 200 ms newsletter delay. The form uses native email validation and prevents submission; it intentionally has no backend or persistence. An accessible email label, heading semantics, keyboard focus outline, and `min-width: 0` on the flex input support usability without changing the supplied design. At 390 px, the specified 64 px second heading line wraps naturally.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Vite's base is `/motionsites-results/editorial-collection-cta/`. Open that path on the local Vite server. The static delivery artifact is `dist/`, including `dist/index.html`. It has not been deployed.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The dependency lockfile is included. `motion-dom` is overridden to 12.23.12 to match Framer Motion 12.23.12; the initially resolved newer transitive version lacked an export required by this release. Vite reports harmless ignored `use client` directives from Framer Motion during the successful build.

## Browser verification

Run the actual production build through Chromium using the image's existing Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

The script serves `dist/` at the required subpath inside a temporary container and closes its server/browser on completion. Verified desktop 1440×1000 and mobile 390×844: viewport-height section, no horizontal overflow, visible completed blur-up animations, input/button fit, invalid email rejection, prevented valid submission without navigation, and keyboard tab access to Subscribe. Final run had no browser console errors, page errors, or failed requests. Both font families loaded successfully, and the muted looping video played at both sizes (readyState 4; source 3828×2164). Google font responses were HTTP 200; video was HTTP 206.

Screenshots were saved before form interaction and visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-report.json` records the measurements and asset responses.

## Limits

Google Fonts and the exact CloudFront video remain external dependencies as requested and require network access. Screenshots capture one moment of the moving video. No assets failed in the final browser check. Subscription persistence is intentionally absent, matching the prompt.
