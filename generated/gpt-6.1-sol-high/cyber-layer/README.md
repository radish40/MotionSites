# Cyber Layer

Design ID: `cyber-layer`. A fullscreen cybersecurity landing page built with native HTML, CSS, inline SVG, and JavaScript. The deliverable is a single `dist/index.html`, with embedded WOFF2 fonts and the exact remote video requested in `PROMPT.md`. There are no frameworks or runtime packages.

## Run and build

With Node 22 available:

```bash
npm ci
npm run build
```

In the supplied environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The build copies the complete standalone `index.html` into `dist/`. It supports `/motionsites-results/cyber-layer/` without a bundler base setting: fonts, styles, scripts, and SVG are inline; the video uses its required absolute URL. Serve `dist/` with any static HTTP server, mounted at that path. No deployment was performed.

`src.html` is the editable template. `scripts/assemble.py` embeds the fonts and copies the two exact LUT filter definitions from `PROMPT.md` into `index.html`. After changing that template, run `python3 scripts/assemble.py` before building. Editing the assembled `index.html` directly also works with the build command.

## Verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

The check uses the existing image's Chromium and `playwright-core`, starts a temporary server at the actual release subpath, and closes both afterward. Results are saved in `browser-checks.json`.

Checks cover desktop 1440×1000 and phone 390×844; loaded embedded fonts; all three video instances playing; no media errors, page errors, or layout overflow; entrance completion with no remaining animations; mobile open/close, exclusive accordions, Escape, link dismissal, keyboard focus containment, and closing on desktop resize; and reduced motion disabling video autoplay and entrance animation.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png` (Benefits accordion expanded)

Chromium sometimes cancels an MP4 range request during seeking or browser-context shutdown. These `net::ERR_ABORTED` events are recorded separately in `cancelledVideoRequests`, while successful video readiness, playback, and absence of media errors are independently asserted. Other request failures fail the check.

## Assets and limits

- The three video elements use the exact CloudFront URL from the prompt. It returned HTTP 200 and played in Chromium. Network access to that host is required at runtime.
- Space Grotesk and JetBrains Mono are the prompt's permitted Google Fonts substitutes, embedded as WOFF2 data URLs under `SG` and `JB`, with `font-display:block`. Space Grotesk uses its variable 300–700 face so the specified 700 heading and 480 button weights render correctly. The original private Light-cut embed was not supplied.
- Font source metadata and the font files are retained under `assets/`; licenses are included there.
- Only the supplied Cyber Layer reference was inspected. No screenshot or reference video is used as the page. The background is the actual requested MP4, behind real DOM typography and controls.
- The prompt does not give contact, signup, documentation, or report destinations. Links retain local prototype targets and close the mobile menu; their default scrolling is suppressed to preserve the fixed stage. They do not submit data or connect to a backend.
- Mobile type sizing and layout values not numerically specified in the prompt were completed using the supplied canvas scaling system. Required canvas sizes, filters, copy, timeline, colors, and menu tree are preserved. Visual review is by screenshots, not an automated pixel-difference score; animation frame timing varies with video loading.
- Build and browser checks were performed in the existing Docker image. No push, deployment, other sessions, or agents were used.
