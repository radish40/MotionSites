# Real-Time Alerts

Design ID: `real-time-alerts`. Page title: **Signal — Log in**.

A native, framework-free login composition following `PROMPT.md`: all CSS, JavaScript, fonts, SVG marks, and both video posters are embedded in `index.html`. The original falcon video is local at `assets/falcon.mp4`. The page makes no external requests and works offline. Buttons intentionally have no authentication or submission handlers; Start Free is a static placeholder link, as this is a visual composition.

## Build and run

No installation or compilation is needed to run the source page. Package the publishable directory with:

```sh
python3 build.py
```

The build copies the self-contained page, original MP4, and font licenses to `dist/`. Serve `dist/` at `/motionsites-results/real-time-alerts/`; relative resource URLs support this path. For a simple local preview, `python3 -m http.server 8000 --directory dist` also works at the root.

`package-lock.json` records an empty dependency graph. There are no runtime or build dependencies beyond Python's standard library for packaging. No `node_modules` is included.

## Implementation

Desktop uses the calibrated 1464×949 coordinate system, a smoothly changing photo ratio, scaled card interior, and a hero seated relative to the video's cover scale. Portrait tablets use a masthead and fluid card measurements. Phones use document flow, readable 16px inputs, scrolling, a scrim, and white headlines. Inline styles are cleared on mode changes. The entrance follows the specified WAAPI schedule, releases its CSS guard, cancels completed animations, and never reruns on resize. Reduced motion skips the entrance; the video remains the media stage.

The source is `index.html`. `template.html` and `assemble.py` preserve its editable assembly sources. `assemble.py` is an optional authoring utility requiring FontTools and Brotli; it is not needed to build or serve the final page. The original font archive is retained for source and licensing provenance. `prepare-assets.cjs` reproduces the poster extraction using Chromium.

## Assets and visual limits

- Original specified video downloaded without alteration from `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_052122_e77a27e6-17f1-4794-889b-3ceaa0e9e8cb.mp4`. Browser metadata confirms 1352×1532 and 5.041667 seconds.
- The original 1177×1336 photograph was not supplied separately. `prepare-assets.cjs` extracts the video at 0.05 seconds, resizes it to 1177×1336, and encodes WebP. This isolated falcon frame is embedded twice as the buffering poster. It is an approximation of the original still, not a page screenshot.
- FreeSans regular and bold are the exact GNU fonts from `https://ftp.gnu.org/gnu/freefont/freefont-ttf-20120503.zip`, subset and converted to embedded WOFF2. License: `assets/FreeSans-COPYING.txt`.
- Exact Eloquia was not available from the provided material. The prompt-permitted substitute is **Manrope variable, 200–800**, sourced from `https://github.com/google/fonts/tree/main/ofl/manrope`. It is embedded as WOFF2 under the Eloquia CSS family alias while preserving weight-axis settings 578 and 584. Letter shapes and text widths therefore differ from Eloquia. License: `assets/Manrope-OFL.txt`.
- Only this project's reference `/home/opc/motionsites/assets/previews/real-time-alerts.webp` was visually reviewed. It was never used as a page background or embedded whole.
- The prompt's negative `padding-left` value is preserved as a token/declaration; CSS rejects negative padding. Tablet negative hero spacing uses a negative margin, since CSS gap also rejects negative lengths.

## Browser verification

Run the repeatable Chromium checks with the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.browser-home \
  -v "$PWD:/work" -w /work --entrypoint node \
  louislam/uptime-kuma:2 browser-checks.cjs
```

The temporary HTTP server serves the real publish subpath. Detailed results are in `checks.json`. Checks cover desktop 1440×1000; reference geometry 1464×949; phone 390×844 and scrolling at 320×568; tablet 1086×1448; live resize and orientation changes; input editing, password masking, keyboard focus, button states; visible-video playback; reduced motion; JavaScript-disabled desktop and phone; script errors and failed requests. Chromium may suspend the hidden responsive video; the visible video is checked in every mode.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/reference.png`, `screenshots/tablet.png`, and `screenshots/small-mobile.png`. The video continues running, so screenshots can show different frames. Chromium verification does not replace physical iOS testing; 16px phone inputs and all required inline-video attributes are verified in the DOM. Exact visual equivalence cannot be claimed because of the documented display-font and poster substitutions.

No deployment, push, other session, or agent delegation was performed.
