# Mythic Naturecore

Design ID: `mythic-naturecore`. Page brand: **Reverie**.

A React + TypeScript landing page with Tailwind CSS, inline animation styles, a 480vh scroll journey, and a sticky viewport. The scene opens its curtains, tracks the pointer with interpolated parallax, zooms through the portal, and reveals “FORGE BEYOND THE REAL.” The exact supplied asset constants and card order are retained in `src/main.tsx`.

## Run and build

Requires Node 22 and npm. From this project directory:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/mythic-naturecore/`. `dist/index.html` and its sibling assets form the static delivery. Serve the complete `dist/` directory under that base URL.

The host has no Node/npm. The reproducible container command is:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --no-audit --no-fund && npm run build'
```

## Verification

The browser checker serves the actual production files at the required base path and uses Chromium with Playwright Core from the provided image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check-browser.cjs'
```

See `browser-checks.json` for individual assertions. Checks cover desktop 1440×1000, mobile 390×844, tablet 900×1000, responsive resize, page height, loaded images/fonts, overflow, pointer parallax, navigation, Descend, card controls, journey indicators, hero focus suppression, reduced motion, keyboard access, console errors, and JavaScript errors.

Screenshots:

- `screenshots/desktop.png` — desktop entrance.
- `screenshots/mobile.png` — mobile entrance.
- `screenshots/portal.png` — intermediate zoom.
- `screenshots/desktop-final.png` and `screenshots/mobile-final.png` — final scene.

The screenshots were visually inspected. A mobile curtain sizing issue and a missing favicon request found during verification were corrected before the final run.

## Visual repair and asset provenance

The illustrated placeholders were removed. The page now uses photographic layers recovered from this design's own authorized 74-frame reference: lush forest with sunbeams, mossy stone portal, independent foreground foliage curtains, and three ordered card crops. All navigation, typography, cards, labels, buttons and final copy remain live React DOM. The scene still uses the original scroll/parallax/curtain formulas, 480vh page, 100vh sticky viewport and responsive hook.

See `recovery/README.md` for attribution, exact crops, frame registration, residual reconstruction, limitations, and reproduction steps. `scripts/recover-reference.py` and `recovery/reference.webp` make recovery reproducible. The reference itself is not used at runtime. `recovery/recovery-report.json` records the registrations.

The seven original Cloudinary URLs and retried versionless/transformed variants still return HTTP 401 (`dsdhxhhqh cannot be accessed via this endpoint`). This limitation is recorded in `asset-report.json`. Local recovery now provides the requested photographic visual language; it does not restore original full-resolution source assets. Low-resolution softness, some transplanted foliage under former UI, approximated curtain/portal silhouettes, and tight card crops remain documented visual limitations.

Both requested Google Fonts (Viaoda Libre and Imprima) are bundled locally. The original asset constants and card order remain in the source. Original images can replace recovery images if the Cloudinary account becomes available.

The final production browser run adds checks for curtain entrance movement, decoded local raster images, and the actual 7.5× portal zoom/fade. Desktop and mobile screenshots were compared visually with this design's reference. The photographic scene, live hero/card composition and forest final scene replace the former unrelated illustration.

The prompt supplies no video, destination pages, or contact endpoint. “View Reel” enters the immersive scroll sequence; navigation links and indicators move through that sequence. Reduced-motion preferences disable entrance transitions, pointer parallax, bobbing, and smooth programmatic scrolling; scroll-linked scene transforms remain tied to the user's scroll position.

No deployment, push, external messages, additional sessions, or agent delegation was performed. All new code/assets are confined to this project. No node_modules, Python environment, dependency wheels, or files of 100 MiB or more are included.
