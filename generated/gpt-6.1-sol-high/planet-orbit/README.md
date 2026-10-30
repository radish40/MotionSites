# Planet Orbit

Design ID: `planet-orbit`. A responsive APEX landing hero built from `PROMPT.md`, with the original planet video, Geist Sans, liquid glass navigation and controls, green calls to action, and a continuous brand marquee.

Built with React, Vite, `class-variance-authority`, and `@fontsource/geist-sans` (400, 500, 600, 700). The `hero` and `heroSecondary` button variants share a reusable button definition. The glass border uses the specified masked gradient.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/planet-orbit/`. Vite's base is configured for this exact path. The production artifact is `dist/`, including `dist/index.html`. Dependencies are pinned by `package-lock.json`; `node_modules` is excluded.

On the supplied host, use its existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

The repeatable check serves the actual production build at the required subpath and uses the existing image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Verified at desktop **1440 × 1000** and mobile **390 × 844**:

- Video loads, autoplays muted, and advances; brand marquee animation advances.
- Geist Sans loads locally; no failed resource requests or JavaScript errors.
- No horizontal overflow; hero and social proof fit both requested viewport heights.
- Desktop Features/Learning dropdowns and mobile menu work.
- Announcement, signup, free-start, and consultation dialogs work; forms validate and show local completion; Escape closes dialogs.
- Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Machine-readable browser observations: `screenshots/checks.json`.

Screenshots seek the video to 3 seconds and pause the marquee at its first brand for repeatable captures. The live page plays both normally. Reduced-motion preferences stop the marquee. Chromium headless checks do not establish behavior across all browsers.

## Assets and limitations

The exact MP4 specified in `PROMPT.md` was recovered directly from its CloudFront URL (HTTP 200, 16,586,551 bytes), without alteration, into `public/assets/orbit.mp4` and is included in the build. Fonts are bundled from the required npm package. Runtime external requests are unnecessary. No asset extraction or replacement was needed. The optional `/home/opc/motionsites/assets/previews/planet-orbit.webp` reference was absent; visual fidelity was assessed against the written prompt and rendered screenshots.

The CTA forms are explicitly labeled interactive previews. They validate locally and do not create accounts, send information, or schedule real meetings; no backend was provided. Navigation content is a compact illustrative preview based on the hero's stated capabilities. This project has not been pushed or deployed.
