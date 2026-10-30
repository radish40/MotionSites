# Scroll Marquee

React + Tailwind CSS implementation of design `scroll-marquee`. The production build is in `dist/`, configured for `/motionsites-results/scroll-marquee/`. Nothing has been deployed or pushed.

The page begins with a full-screen dark hero, followed by the two-row image marquee. The hero is intentionally plain: the prompt provides no hero text, branding, or controls, and the reference shows a blank dark area. Scroll down to see the gallery. The reference is used only for visual comparison; it is not rendered as a webpage image.

The component uses the specified 11/10 image order, tripled to 33/30 cards; fixed 420 × 270 px cards; 16 px corners; 12 px gaps; responsive top padding; lazy decorative images; and Kanit weights 300–900. A passive vanilla scroll handler updates DOM refs with the exact requested 0.3 factor and opposing transforms. It runs on mount, handles resizing, and removes listeners on unmount. No marquee animation library is installed.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open the preview at `/motionsites-results/scroll-marquee/`. All page assets use this base path.

The host used for this task has no Node/npm. The actual build ran with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

To repeat the browser checks with the existing image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The check script serves `dist/` locally under the required base path and closes its server and Chromium afterward. Dependencies are locked in `package-lock.json`; `node_modules/` is ignored.

## Verification

Production build passed. Chromium / Playwright checks passed at desktop 1440 × 1000 and mobile 390 × 844. See `browser-checks.json` for measured values and `screenshots/desktop.png` / `screenshots/mobile.png` for the gallery after scrolling to the bottom.

Checks cover full-screen hero height, 33/30 cards, exact card sizing, radii, row and card gaps, responsive padding, initial transforms, down/up scrolling, the exact offset formula, stationary rows without scrolling, no document horizontal overflow, and successful decoding of all 21 local image paths. Neither viewport reported script errors, console errors, HTTP errors, or failed requests. Google Fonts loaded in the browser checks; local font copies also provide Kanit if that CDN is unavailable. The final dependency installation reported zero audit vulnerabilities.

## Assets and limitations

Original images were downloaded directly from the URLs in `PROMPT.md`, with their original animation data retained. `asset-manifest.json` records their sources and recovery status. `python3 scripts/fetch-assets.py` repeats the downloads using curl (Python urllib received 403 responses, whereas curl succeeded).

- **Celestia is an approximation:** `hero-celestia-preview-0yO3jXO8.gif` returns HTTP 404. The www host, initial-uppercase-O spelling, query variant, and PNG/WebP/MP4 variants also failed. The supplied Scroll Marquee reference does not expose a recoverable isolated Celestia card. Its local filename therefore contains a copy of the prompt's Planet Orbit animation. This preserves a working animated decorative card and all row counts, but the Celestia slot does not match the intended visual. Replace that local file when the original becomes available. The browser's 21 successful decodes include this documented substitute.
- Skyelite's original `.gif` URL serves PNG bytes. The original image is preserved and renders successfully, but is static as supplied.
- Source GIFs are large: `dist/` is approximately 182 MB. They remain uncompressed to preserve the required assets and animations; lazy loading avoids loading every repeated card initially.
- The reference does not define hero content; none was invented. The exact requested transform formulas can reveal a small leading dark margin in one row at some scroll positions.

`ready` in `result.json` means the local build is available for review with these disclosed asset limitations. It does not mean the site is deployed or that the missing Celestia asset was recovered.
