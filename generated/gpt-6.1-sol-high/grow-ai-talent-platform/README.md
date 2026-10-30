# Grow AI Talent Platform

Design ID: `grow-ai-talent-platform`. A single dark landing page built from this project's `PROMPT.md`, using React, Vite, TypeScript, Tailwind CSS and a shadcn/ui-style Button component with Radix Slot and class-variance-authority. No deployment or publishing was performed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

This host uses the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static build is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/grow-ai-talent-platform/`. Serve the build at that path. Dependency versions are saved in `package-lock.json`; `node_modules` is excluded from delivery.

## Implementation

The page renders HeroSection and SocialProofSection sequentially. It includes the exact dark semantic tokens, Geist Sans weights 400/500/600/700, General Sans heading, gradient headline, liquid-glass buttons, navigation divider, background video and repeated six-brand marquee. Mobile navigation wraps onto a second row, and the title scales to fit narrow screens. Reduced-motion preferences pause the marquee.

Video opacity is calculated each animation frame with 0.5-second fades. After ending, playback resets after 100ms. The video has no native loop attribute.

## Assets and provenance

- `public/assets/talent-background.mp4` is the unchanged, successfully downloaded original video from the exact CloudFront URL in `PROMPT.md` (12,047,303 bytes, duration 10.041667 seconds). It is served locally to avoid external playback dependencies.
- Geist Sans is installed from `@fontsource/geist-sans` and bundled by Vite.
- `src/assets/general-sans-400.woff2` is General Sans 400 downloaded from Fontshare. `src/assets/general-sans-source.css` preserves Fontshare's source URL. Both fonts loaded successfully in Chromium.
- The requested `src/assets/logo.png` was not supplied. An original transparent four-point mark was generated at that path. Reproduce it with `python3 scripts/generate-logo.py`. Its appearance is an approximation, not a recovered original logo.
- The design-specific preview path named in TASK.md does not exist on this host, so reference-image comparison was unavailable. No other design was read.

## Browser validation

Run the repeatable browser checks with the supplied image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

This starts a temporary local HTTP server for the actual production build and uses the image's Chromium and playwright-core. Checks passed at desktop 1440×1000 and mobile 390×844:

- No page script errors or failed requests.
- No horizontal overflow; document widths match each viewport.
- Heading text and General Sans font loading verified.
- Video loads and plays; opacity equals 0.5 at 0.25 seconds from either end.
- Actual end-of-video playback restart verified.
- Marquee transform changes over time.
- All six buttons accept pointer interaction and keyboard focus.

Full-page screenshots made with those viewport sizes are `screenshots/desktop.png` and `screenshots/mobile.png`; both were visually inspected. Raw browser results are in `screenshots/checks.json`.

## Limits

The prompt specifies plain navigation buttons and CTA text, but provides no links, dropdown contents, booking endpoint or signup destination. These remain visual, accessible buttons with hover and focus states; they do not submit requests or navigate. No unrequested product flows were added. Playback was verified in the supplied Chromium, not on physical mobile devices. The missing original logo and unavailable visual reference are the only asset/reference limitations.
