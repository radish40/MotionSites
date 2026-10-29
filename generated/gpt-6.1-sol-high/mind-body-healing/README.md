# Mind-Body Healing

A single-screen Vibrant Wellness landing page implemented from `PROMPT.md`. Design ID: `mind-body-healing`.

React, TypeScript, Tailwind CSS, Vite, and Lucide React. The page uses the exact supplied CloudFront video, four Pexels portraits, Google Fonts Inter weights 300–700, custom SVG logo, liquid-glass styling, responsive typography, statistics, and animated mobile navigation.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -e npm_config_cache=/work/.cache/npm -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static deliverable is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/mind-body-healing/`; serve the contents of `dist/` at that path. No deployment was performed.

## Verification

The production build passed TypeScript and Vite compilation. Chromium checked the built page at 1440×1000 and 390×844 under its configured subpath.

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node checks/browser.cjs'
```

`checks/browser-report.json` records runtime errors, asset requests, image decoding, video dimensions/playback readiness, Inter loading, viewport dimensions, and interaction results. Checks include desktop anchor navigation, CTA hover, mobile menu open/close, main-content fade/inert state, link dismissal, Escape dismissal, and resize dismissal. Keyboard focus remains inside the open menu. No script errors or horizontal/vertical overflow were found at the required viewports.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`

Screenshots pause the successfully autoplaying video at three seconds for repeatability; the delivered page loops normally.

## Scope and limitations

The requested single hero contains no booking workflow or account screen. The CTA and account indicator retain their specified presentation; navigation links target the existing hero, approach block, and statistics. No additional sections or services were invented.

The exact external video, avatars, and font loaded during browser verification. They require network access. Chromium reports `net::ERR_ABORTED` for some media requests while the test seeks, pauses, or navigates; these are recorded separately as media cancellations, with successful video decoding and playback verified. A dark green base color remains while the video loads. Glass effects depend on browser backdrop-filter support.
