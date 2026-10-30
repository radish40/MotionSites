# Agent Wave

Design ID: `agent-wave`. A single-viewport Vesper.ai landing page, with document title **Vesper.ai — Operational AI Infrastructure**. Built as one HTML document with inline CSS and a small IIFE. The publishable files are in `dist/`, ready to mount at `/motionsites-results/agent-wave/`. Nothing has been deployed or pushed.

## Build

Node 22 is available through the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The build copies the HTML and its four local assets into `dist/`. All resource URLs are relative, so the required subpath works without a bundler. There is no runtime framework or external network dependency. `package-lock.json` pins the asset conversion tooling; `node_modules/` is excluded.

## Assets

- `source-hero.mp4` was downloaded successfully from the exact CloudFront URL in `PROMPT.md` (HTTP 200). It contains only the abstract particle wave, with no webpage text or controls.
- The prompt both supplies an MP4 background and explicitly prohibits video. `scripts/convert-hero.cjs` resolves this by converting the supplied 10.04-second asset into a looping animated WebP (`hero-wave.webp`), retaining the source's 1920×1080 resolution and 24 fps. No video element, WebGL, canvas, Lottie, or screenshot of a page is used. The background is opaque, with no scrim or overlay. The animated asset is about 38 MiB, a transfer-size tradeoff of preserving this detailed wave without video. WebP compression can soften fine particles; cover cropping varies with viewport aspect ratio. The exact loop boundary is inherited from the source.
- `hero-poster.webp` is the first source frame and is used for reduced motion. Run `npm run assets` to regenerate both assets after `npm ci`.
- `inter.woff2` is the variable roman Latin Inter font; `instrument-serif-italic.woff2` is the Latin Instrument Serif italic font. They were downloaded from the Google Fonts response for the specified families. `fonts-source.css` records the response. All displayed text is covered by these subsets.
- The favicon and all icons are inline SVG from the prompt. The design's own reference preview was inspected for composition; no preview pixels were extracted or used in the site.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check script uses the image's existing Playwright Core and Chromium, starts a temporary local HTTP server, and tests the **built files** at the specified publish subpath. It saves `screenshots/desktop.png` (1440×1000), `screenshots/mobile.png` (390×844), `screenshots/mobile-menu.png`, and machine-readable `screenshots/checks.json`.

Checks cover document title, fonts, loaded assets, desktop scroll lock, horizontal overflow, visible stats, completed entrances, button hover, menu toggle and ARIA state, Escape, nav click, resize closure, reduced motion, and visible content without JavaScript. Additional layouts: 1024×768, 1440×700, 1920×1080, 2560×1440, 900×900, and 320×740.

## Scope and limitations

The requested navigation and CTAs retain their exact fragment hrefs. The prompt supplies no sections or destination flows for those fragments, so these links update the URL only. No additional sections or product functionality were invented. Mobile may scroll at short heights, as specified. Screenshots capture individual moments of the moving wave and therefore differ from the reference's animation phase. Automated verification covers Chromium; other browser engines and physical devices were not tested.
