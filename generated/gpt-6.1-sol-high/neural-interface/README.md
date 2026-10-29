# Neural Interface

Design ID: `neural-interface`. The page brand and browser title are **SynapseX**, as specified in `PROMPT.md`.

This is a real HTML/CSS/JavaScript implementation of the supplied design: green neural portrait video, Space Mono typography, glass navigation pills, scrambled hero text, scroll-driven video seeking and blur, perspective paragraph, and six coverflow metric cards. It uses Bootstrap Icons 1.11.3, Swiper 11.2.10, and Lenis 1.1.18, matching the prompt's stack. Native static output requires no application server.

## Build and run

With Node 22/npm:

```sh
npm ci
npm run build
npm run preview
```

The output is `dist/index.html` plus local assets and vendor libraries. Open `http://localhost:4173/motionsites-results/neural-interface/`. All document resource URLs are relative and support the required `/motionsites-results/neural-interface/` publish path.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

`scripts/browser-check.cjs` uses the Chromium and Playwright Core already installed in the supplied Docker image. Run the checks against the built output:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs > screenshots/server.log 2>&1 & SERVER_PID=$!; trap "kill $SERVER_PID" EXIT; node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844: decoded video, loaded local font, complete hero text, six cards, menu state, About and Metrics navigation, video seeking on scroll, carousel dragging, home navigation, download destination, script/console errors, failed requests, and horizontal overflow. Screenshots are saved in `screenshots/desktop.png`, `screenshots/mobile.png`, plus menu, About, and Metrics views. Machine-readable evidence is in `screenshots/checks.json`.

Menu links are native buttons with synchronized expanded/hidden states; logo pills support keyboard activation. Navigation uses Lenis on desktop and native smooth scrolling on mobile, with actual section targets. These small corrections preserve the supplied composition and animation behavior.

## Assets and limitations

The original MP4 was recovered directly, unchanged, from the exact CloudFront URL in `PROMPT.md` and saved as `public/assets/neural-interface.mp4`. The four Space Mono font files were downloaded from the Google Fonts CSS URL in the prompt and saved locally. Bootstrap Icons, Swiper, and Lenis are copied from locked npm dependencies during the build. No external asset requests are needed at runtime. The favicon reuses the supplied SVG logo. Only this design's preview was visually consulted; no reference screenshot or extracted page imagery is used in the implementation.

The supplied Download link intentionally retains `https://www.instagram.com/dmitriyinin`; the prompt provides no downloadable app. Browser verification checks that destination without contacting Instagram. Mobile uses the specified single-column layout and cropped full-screen video.

`npm audit` reports GHSA-hmx5-qpq5-p643 (prototype pollution) against the required Swiper 11 line. The major version is retained to honor the requested stack; this page initializes it with fixed local options and does not ingest external configuration. This advisory is recorded rather than claiming a clean dependency audit. Checks use container Chromium; Safari, Firefox, and physical mobile devices were not tested.

No deployment or push was performed. `ready` in `result.json` means ready for management acceptance.
