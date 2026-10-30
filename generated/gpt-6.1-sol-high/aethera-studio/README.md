# Aethera Studio

Single-page cinematic hero built from this project's `PROMPT.md` with React, Vite, Tailwind CSS, and TypeScript. Uses the supplied landscape video, Instrument Serif (regular and italic), Inter, exact hero copy, responsive navigation, and entrance animations.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/aethera-studio/`. The production deliverable is `dist/`, including `dist/index.html` and all media/fonts. Serve it at that URL; no deployment has been performed.

This host has no Node installation. The actual build used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

Dependencies are pinned by `package-lock.json`; `node_modules` is excluded from the deliverable.

## Behavior

The video starts 300px below the top, fills the background beneath the hero, and has a white-to-transparent-to-white gradient. React refs/effects and `requestAnimationFrame` calculate the first and last 0.5-second opacity fades. At `ended`, opacity becomes zero, then playback resets after 100ms. Playback is muted and inline. Reduced-motion preference uses a still video frame and disables entrance animations.

On small screens, the navigation collapses into a toggle menu. Navigation links target existing areas of this single hero rather than additional pages. The prompt supplies neither destination pages nor a contact address: “Begin Journey” opens a `mailto:` composer with a subject and no recipient. A production contact destination remains a content decision; there is no backend or form submission.

## Assets and provenance

- `public/assets/aethera-landscape.mp4`: downloaded successfully, unchanged, from the exact CloudFront URL in `PROMPT.md` (30,377,184 bytes).
- `public/assets/fonts/instrument-serif.ttf` and `instrument-serif-italic.ttf`: Google Fonts' Instrument Serif regular/italic originals, downloaded from `fonts.gstatic.com`.
- `public/assets/fonts/inter.ttf`: Google Fonts' Inter regular original, downloaded from `fonts.gstatic.com`.
- Font declarations/imports are in `src/styles/fonts.css`, imported by `src/styles/theme.css`. All assets are local and base-path compatible.
- The project's supplied `aethera-studio.webp` reference was viewed only for comparison. No screenshot was used as webpage content; no extraction or substitute artwork was needed.
- `public/favicon.svg`: simple native SVG lettermark.

## Browser verification

Run the repeatable Chromium check in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves the real production build under its configured subpath, using Chromium and the image's existing Playwright installation. It checks 1440×1000 desktop and 390×844 mobile, font loading, video playback, end fade, restart, start fade, CTA hover, mobile menu opening and link activation, reduced motion, script/console errors, failed requests, and horizontal overflow.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`. Machine-readable evidence: `screenshots/checks.json`.

The first browser pass exposed a mobile stacking issue, which was fixed by raising the header above the hero. A missing favicon request was also fixed. The final checks use the rebuilt deliverable. Browser verification covers headless Chromium; OS email-app launch and other browser engines were not tested. Autoplay remains subject to individual browser policy. The original MP4 is approximately 29 MiB, deliberately retained without recompression.
