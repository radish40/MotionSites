# CoderCrest

Design ID: `codercrest-hero`. A React + TypeScript hero built with Vite, Tailwind CSS and hls.js, following `PROMPT.md`. The section uses the supplied Mux HLS background and two supplied CloudFront MP4 icons, the exact headline and supporting copy, the 380px content margin, and the specified button transitions. Video is fully opaque with no overlay.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/codercrest-hero/`. The production build is in `dist/`, including `dist/index.html`. Vite's base matches that publication path. Dependencies are pinned by `package-lock.json`; `node_modules/` is ignored.

The actual build in this environment used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/codercrest-hero:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

For repeatable installation, replace `npm install` with `npm ci`.

## Verification

The production files were served at the required subpath in a temporary Docker container and tested using Chromium and the image's existing playwright-core installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/codercrest-hero:/work \
  -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.mjs
```

Passed at desktop 1440×1000 and mobile 390×844:

- All three videos loaded actual frames and advanced playback, muted, looping and inline.
- Section height matched the viewport; content retained its 380px margin.
- No horizontal or vertical document overflow; CTA remained in the viewport.
- Hover scaled the CTA to 1.03 and increased its green glow; pressing scaled to 0.98.
- Keyboard focus, Enter activation, and mobile tapping worked.
- No JavaScript/console errors, failed requests, or HTTP errors in the final run.

Screenshots were captured from the running build and visually reviewed: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png). Full measured results: [browser-checks.json](screenshots/browser-checks.json).

## Limitations

- No YDYoonche L/M font files, licensed source, or provider URL were supplied. The requested font-family declaration is present, using the prompt's sans-serif fallback. No substitute font has been presented as YDYoonche.
- All supplied video endpoints returned HTTP 200 and played successfully. They remain external network dependencies.
- The CTA has the specified visual interactions. The prompt supplies no link, signup endpoint or click action, so no additional destination or workflow was invented.
- Native Apple HLS fallback and HLS cleanup are implemented. Browser verification used Chromium's hls.js path; Safari and physical mobile devices were not tested.
- Vite reports a non-fatal chunk-size warning for the bundle containing hls.js (approximately 824 kB before gzip). TypeScript and production compilation pass.
- Mobile text wraps naturally according to the required flex-wrap and sizing rules. The 100vh section and fixed 380px margin are retained as requested.

The build is ready for review. Nothing was deployed or pushed.
