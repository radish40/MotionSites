# Cinematic Brand

A full-screen VERTX landing page built from `PROMPT.md`. The browser title is **Nexora — Beyond the Interface**. Uses React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React.

The hero includes the exact supplied CloudFront video, Quire Sans Pro CDN stylesheet, character reveal, staggered FadeUp transitions, responsive actions, and inset button glow. Contact and signup actions open accessible native dialogs; Watch the story opens the supplied video with playback controls. Dialogs support Escape, close buttons, focus containment, and focus restoration. Reduced-motion preferences remove reveal delays.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The static output is `dist/`, configured for `/motionsites-results/cinematic-brand/`. Serve that directory at the configured path. This project has not been deployed or pushed. Dependencies are locked in `package-lock.json`; compatible Motion internals are pinned through npm overrides to prevent a transitive export mismatch encountered during the first build. `node_modules` is not included in the deliverable.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The check uses the image's Chromium and `/app/node_modules/playwright-core`, serves the actual production output under its configured subpath, and writes:

- `screenshots/desktop.png` — 1440 × 1000
- `screenshots/mobile.png` — 390 × 844
- `screenshots/checks.json` — browser evidence

Checks cover page title and heading, horizontal/vertical overflow, actual video time advancement, font availability, contact form submission, signup and Begin Now dialogs, story playback controls, closing with Escape and buttons, background playback restoration, reduced-motion rendering, JavaScript errors, console errors, and failed requests. Both screenshots were visually reviewed. The video is paused at five seconds only during screenshot capture for a consistent comparison; normal playback remains looping.

## Assets and limits

The original external video (~55.4 MiB) and font both loaded successfully during validation. They remain externally hosted and require network access; the design intentionally uses `preload="auto"` as specified. Font source: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), Quire Sans Pro, using the exact stylesheet requested in the prompt.

No backend or destination email was supplied. Contact and signup forms are explicitly labeled interactive previews: they validate the email locally, display an honest confirmation, and do not send or persist information. The story player reuses the supplied video because no separate story asset was provided. Browser checks emulate the requested desktop and mobile viewports in Chromium; they are not physical-device or cross-browser certification.
