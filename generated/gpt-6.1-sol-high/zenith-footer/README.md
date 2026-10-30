# Zenith Footer

Design ID: `zenith-footer`. A React/Vite implementation of the supplied Zenith footer design, using Tailwind CSS v4, Lucide React, and Motion (the Framer Motion `motion/react` API).

The page features the original full-screen looping background video, a responsive ivory footer, Geist typography, the exact supplied menu and copyright text, scroll-triggered reveal, and animated primary/secondary buttons. All content is real DOM; no reference screenshot is used as the page.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

In the supplied environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable static output is `dist/`, including `dist/index.html`. Vite's configured base is `/motionsites-results/zenith-footer/`. Serve the output at this path. No deployment has been performed.

## Validation

The production build completed successfully. Chromium browser checks used the actual production output at the configured subpath:

- Desktop: 1440×1000; mobile: 390×844.
- Both: no uncaught JavaScript errors, no failed network requests, no horizontal overflow.
- The original remote video loaded at 3828×2164 and advanced during playback, with mute and loop enabled.
- Geist loaded successfully.
- Both buttons were clicked; hover transforms, menu activation, and keyboard focus were checked.
- All eight menu links and the supplied heading/buttons were present.
- Screenshots were visually reviewed: `screenshots/desktop.png`, `screenshots/mobile.png`.

Detailed observed results are in `screenshots/checks.json`. To repeat the browser check using the supplied Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

## Assets and scope

The exact CloudFront video URL from `PROMPT.md` is used directly. An unmodified copy is stored at `public/assets/zenith-background.mp4` and included in the build as a fallback if the remote video fails. The copy was downloaded successfully from that same URL; no reconstruction or substitute imagery was needed. Its approximately 41.3 MiB size is retained to preserve the supplied asset. The fallback code is present, but the browser tests exercised successful remote playback, not forced fallback.

Geist is imported from Google Fonts with weights 100–900 as requested; it requires network access. Both the video and font worked during validation. The optional reference file `/home/opc/motionsites/assets/previews/zenith-footer.webp` was absent, so visual implementation follows the full written prompt.

The prompt supplies no navigation destinations or button click workflows. Menu links therefore use `#`, and the two buttons expose the reusable `onClick` prop without an assigned application action. No extra pages, dialogs, or forms were added. The duplicated copyright is intentional and follows the prompt.
