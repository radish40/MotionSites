# Capabilities Overview

Design ID: `features`. A standalone EngineTech capabilities section implementing `PROMPT.md` with native HTML, CSS, and a small JavaScript enhancement for reduced motion. No framework or runtime dependencies are needed.

The section contains the exact supplied copy, the three-column bento layout, all five cards, three looping videos, Phosphor icons, opposite-direction tool marquees, and the specified 1080px/760px breakpoints. The program CTA and engineering links use `mailto:`; the phone link uses `tel:`.

## Build and preview

From this project directory, using the supplied Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The deployable static output is `dist/`, including `dist/index.html`. Relative asset URLs support the required `/motionsites-results/features/` publishing path. There are no npm dependencies; `package-lock.json` is included.

To preview locally:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm start'
```

Open `http://localhost:4173/motionsites-results/features/`. This starts only a local preview; nothing has been deployed.

## Assets

All runtime assets are served locally to avoid CDN dependencies:

- `program-background.mp4`: https://assets.mixkit.co/videos/45229/45229-720.mp4
- `engineers.mp4`: https://assets.mixkit.co/videos/23211/23211-720.mp4
- `core-systems.mp4`: https://assets.mixkit.co/videos/23843/23843-720.mp4
- `phosphor.css` and `Phosphor.woff2`: the specified regular Phosphor Icons 2.1.1 files from unpkg.
- `Geist.ttf`: Google Fonts' variable Geist font, downloaded from `https://raw.githubusercontent.com/google/fonts/main/ofl/geist/Geist%5Bwght%5D.ttf`.
- The three JPG posters are frames extracted from the supplied videos using `scripts/posters.cjs`.

All assets downloaded successfully. No stock substitutes or reference screenshots are used. Runtime media is approximately 16 MB; video is the largest portion.

## Validation

After building, run:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check uses the image's existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`. It starts and stops a temporary local HTTP server against the actual `dist/` output at the required subpath.

Passed checks:

- Desktop 1440×1000, mobile 390×844, and tablet 900×1000: expected column counts and no horizontal overflow.
- All three videos decode and autoplay muted, loop, and play inline.
- Geist and Phosphor fonts load successfully.
- Keyboard focus reaches the primary CTA; all four contact actions activate their expected URI targets.
- Marquee motion advances; reduced-motion mode stops the marquees and videos.
- Zero browser script errors, failed requests, or HTTP error responses.

Evidence: [desktop screenshot](screenshots/desktop.png), [mobile screenshot](screenshots/mobile.png), and [machine-readable browser checks](screenshots/checks.json). Screenshots are full-page captures at the required viewport sizes, with videos paused at two seconds for reproducibility. Normal page operation autoplays them. Both screenshots were visually inspected.

## Limitations

Email and phone actions require the visitor's configured mail/phone application. Validation checks the activated URI targets without sending messages or placing calls. Autoplay depends on browser policy; local posters remain available when playback cannot start. Browser validation was performed in Chromium, not on physical mobile hardware. `ready` means ready for review, not published.
