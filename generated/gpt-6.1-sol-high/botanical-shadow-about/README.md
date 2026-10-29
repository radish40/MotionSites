# Botanical Shadow About

Design ID: `botanical-shadow-about`.

React + TypeScript + Vite, with Tailwind CSS configured through its Vite plugin. `src/about.tsx` retains the prompt's self-contained inline styling, exact four-line headline, SVG pin, divider, subtext, font URLs, overlay and viewport layout. The only motion is a real locally served looping video. `PROMPT.md` is unchanged.

## Build and run

Requires Node 22 and npm, or the provided Docker image:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/botanical-shadow-about/`. Production output is in `dist/`, including `dist/index.html` and the bundled video. No deployment has been performed.

On the provided host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

Dependency versions and `package-lock.json` are included. `node_modules` is ignored and removed after verification.

## Background recovery and provenance

The exact required original remains unavailable:

`https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/f_auto/v1779835701/bg-2-video_sgbpqt.mp4`

It returned HTTP 401, initially with `x-cld-error: cloud_name dy5er7kv5 is disabled`. The earlier response is preserved in `screenshots/video-asset-response.txt`. This URL remains in the component's `ORIGINAL_BACKGROUND_URL` and `data-original-src`. Since it is known to be disabled, the component directly selects the bundled recovery rather than issuing a request guaranteed to fail and create a console error.

The scoped repair authorized reconstruction from this same design's animated reference: [original animated preview](https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(11).webp). Its exact binary is copied to `recovery/original-preview.webp` for reproducibility. This is a **lossy reconstruction from the compressed original design preview, not the original MP4**.

`scripts/recover-background.py` decodes all 68 reference frames at 640 × 478, retaining their 66/67 ms timing (4.532 seconds). A temporal-maximum luminance mask identifies static text, with dilation to remove antialiasing and compression fringes. Explicit masks remove the divider, pin, and rounded corner artifacts. Each frame is spatially inpainted using OpenCV Navier–Stokes interpolation and smoothed within the mask. Thus the real moving botanical silhouettes remain, while background hidden beneath text is approximated. There is no whole-preview background, duplicated text, frozen frame, or unrelated footage.

The script inverses the preview's known overlay in sRGB using `(pixel − 0.38 × [242, 238, 230]) / 0.62`. The actual component retains the exact `rgba(242, 238, 230, 0.38)` overlay, avoiding a second washout. Clean frames are encoded as VP9 WebM with variable frame timestamps and the final frame's 66 ms duration. `public/assets/botanical-shadow-recovered.webm` is bundled by Vite and uses `import.meta.env.BASE_URL` for the requested subpath.

Reproduce using project-local tooling only:

```sh
python3 -m venv .recovery-venv
.recovery-venv/bin/pip install -r scripts/recovery-requirements.txt
.recovery-venv/bin/python scripts/recover-background.py
npm run build
```

No system packages are needed. Python dependencies include a private ffmpeg binary. The virtual environment, wheel downloads, and intermediate frames are ignored. The source reference, mask, recovered contact sheet, and provenance JSON are included in `recovery/`; only the final video is shipped in `dist/`. `recovery/provenance.json` records source and video hashes, source frame durations, and reconstruction limitations. Compression, source resolution, and interpolation beneath removed artwork limit fidelity.

## Browser verification

The built production files are served from the exact publication subpath in an ephemeral Docker container and tested with its Chromium and Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

- Desktop 1440 × 1000: `screenshots/desktop.png`.
- Mobile 390 × 844: `screenshots/mobile.png`.
- Both sizes: video decoded at 640 × 478, currentTime advanced, sampled video pixels changed, and playback continued after looping past the end.
- No JavaScript errors, console errors, failed requests, layout overflow, or overlapping headline/subtext.
- All three exact font stylesheets and font families loaded. Component has no CSS classes or CSS animations.
- Scrolling exercised; composition stays one viewport. No controls are specified.
- Clean recovery contact sheet and both rendered screenshots visually inspected: botanical treatment present, no duplicate text/icon/line or corner marks.

Full results are in `screenshots/browser-checks.json`, with build output in `screenshots/final-verification.log`. Status `ready` means ready for management acceptance, not deployed. The unavailable original remains a documented asset issue, recovered through the explicitly authorized local fallback.

Font attribution: [Web Fonts](http://www.onlinewebfonts.com/fonts), per the supplied stylesheets. Fonts remain hosted at the exact prompt URLs.
