# Neon Logic

A single-page SynapseX landing site implemented from `PROMPT.md`. Project ID: `neon-logic`.

React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion provide the five sections and cinematic footer. The implementation uses the exact five CloudFront video URLs, Space Mono, Anton SC for the watermark, the specified custom SVG logo, and Bootstrap Icons for the Apple symbol.

The paused hero video uses delta-based horizontal mouse scrubbing with sensitivity 0.8 and chained `seeked` events. Navigation expands with spring animations. Entrance and hover text scrambles, scroll reveals, and spring-driven perspective text follow the prompt.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL is `/motionsites-results/neon-logic/`. The publishable output is `dist/`, including `dist/index.html`. Serve the directory at that path; opening the HTML directly with `file://` is unsupported.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The real production build was served at its configured subpath and checked using Chromium with Playwright at desktop **1440 × 1000** and mobile **390 × 844**. Reproduce the checks with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script starts a temporary local server, asserts asset loading, paused hero playback, forward/reverse mouse scrubbing, About/Metrics scrolling, menu state, Download dialog behavior, fonts, and absence of page errors, HTTP errors, and horizontal document overflow. It saves the evidence to `screenshots/browser-report.json` and screenshots to `screenshots/`.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional screenshots show the menu, metrics, all desktop sections, footer, and a scrubbed hero frame. Screenshots reflect actual rendered video frames; looping sections may vary between runs.

## Limitations

- No installer or Download destination was supplied. Download displays a dismissible preview availability notice; it does not claim to deliver software.
- Videos, Google Fonts, and Bootstrap Icons remain external assets, as specified. All loaded during verification. Chromium reported some canceled video range requests (`net::ERR_ABORTED`), while every video reached readyState 4 without a media error. These observations are retained in the raw browser report.
- Verification used Chromium, including mobile viewport emulation, rather than physical mobile devices.
- This is a static landing page with no backend. Ready means available for review; no deployment or push was performed.
