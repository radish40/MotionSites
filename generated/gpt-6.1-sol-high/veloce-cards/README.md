# Veloce Cards

Standalone fintech Insights section built from `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS, and Framer Motion. Design ID: `veloce-cards`.

The implementation preserves the requested copy, responsive spacing, card sizes, translucent overlays, system font stack, 1.2-second heading blur reveal, and staggered card entrance. The reusable named exports are `BlurIn` and `InsightsSection` in `src/components/`. There are no navigation or form controls in the requested design.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
# Open http://localhost:5173/motionsites-results/veloce-cards/
npm run build
```

The production output is `dist/`, including `dist/index.html`. Its configured base is `/motionsites-results/veloce-cards/`; serve the contents of `dist/` at that path. The dependency lock is included; `node_modules/` is ignored and is not a deliverable.

The build used the available Docker image on this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Assets

All three exact CloudFront MP4s specified in `PROMPT.md` were successfully downloaded with `curl -fL --retry 2`. The original URLs remain the first video sources, with unmodified local copies as second sources:

| Card | Local copy | Original filename |
| --- | --- | --- |
| 1.6M | `public/assets/members.mp4` | `hf_20260405_143605_bc7bd6c0-9c68-49ff-a9d3-073a10759fa4.mp4` |
| 850K | `public/assets/transfers.mp4` | `hf_20260405_145119_f4ec4d9f-3ecd-4116-baa3-26e8cf2df976.mp4` |
| 120+ | `public/assets/nations.mp4` | `hf_20260405_140728_ae719193-f10b-4105-82fc-c989610b3aa6.mp4` |

These files are copied into `dist/assets/` by Vite. No assets were reconstructed or extracted from the reference. The supplied Veloce Cards preview was inspected only as a visual reference; the page uses real text, layout, and videos. No external font download is required: the specified Helvetica Neue → Helvetica → Arial → sans-serif stack uses the viewer's installed fonts.

## Browser verification

Run the self-contained temporary HTTP server and Chromium checks from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

Verified against the actual production build at its configured subpath:

- Desktop viewport 1440×1000: 450/350/450px card heights, equal widths, and shared bottom alignment.
- Mobile viewport 390×844: full-width 342px cards inside 24px side margins, vertical stack, no horizontal overflow.
- Heading completes its blur/opacity reveal and cards become visible after scrolling.
- Each original video loads at 1440×1440 and advances while visible, with muted, loop, and playsInline enabled.
- Local video fallbacks load when CloudFront requests are deliberately blocked.
- No JavaScript page errors or failed requests during the normal desktop/mobile runs.
- Both full-page screenshots were visually inspected. `screenshots/mobile.png` is 390×1700, captured from the required 390×844 viewport, to show the entire stacked section.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/checks.json`, and `build.log`.

## Limits and delivery

Validation used headless Chromium, not physical mobile hardware or Safari. Font rendering depends on installed system fonts, as required by the prompt. Video appearance changes with playback time; screenshots capture individual frames. Browser autoplay policy may vary on other devices. The original assets are bundled for fallback and total approximately 24 MiB.

Status `ready` means ready for review. Nothing has been deployed or pushed.
