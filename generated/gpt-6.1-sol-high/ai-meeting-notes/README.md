# AI Meeting Notes

Design ID: `ai-meeting-notes`. A native HTML, CSS, and JavaScript implementation of the Livo AI landing page supplied in `PROMPT.md`. Includes the animated hero, partner ticker, four scenario slides with timed progress and manual pagination, two rotating mobile app advertisements, and three pricing plans with yearly/monthly billing.

The original copy, Inter font weights, and supplied image assets are retained. Images and fonts are bundled locally. `assets/manifest.json` records original image URLs. The second advertisement URL returned JPEG data despite its PNG suffix, so its local file uses `.jpg`.

## Build

No application dependencies are required. Node 22 is sufficient:

```bash
npm ci
npm run build
```

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The build copies the complete page and assets into `dist/`. Publish the contents at `/motionsites-results/ai-meeting-notes/`. All asset references are relative and support that subpath. No deployment has been performed.

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

The check uses the image's installed Chromium and `/app/node_modules/playwright-core`. It starts and stops a temporary HTTP server inside the container and loads the actual built page at the required publication subpath. It verifies desktop 1440×1000 and mobile 390×844, all four scenario pagination choices, scenario autoplay, advertisement autoplay, billing by mouse and keyboard, loaded images, script errors, failed requests, and document overflow. Full-page screenshots are saved at `screenshots/desktop.png` and `screenshots/mobile.png`; structured results are in `screenshots/browser-report.json`.

Two source rendering issues are corrected: animated gradient words now paint their own clipped background, and the mobile scenario artwork retains its intended height. Accessible labels, keyboard-operable billing, focus outlines, and reduced-motion styles are included.

## Scope and limitations

The supplied design contains placeholder navigation links and presentation-only signup, contact, account, pricing, and download buttons. Their unspecified destinations and backend flows are retained as supplied; no authentication, checkout, contact submission, or app download is implemented. There is no FAQ section in the supplied design. The differing 31-day and 14-day trial copy is preserved exactly. The content inside the provided interface artwork is part of the original image assets; the page sections, typography, controls, animation, and layout are rendered HTML/CSS/JavaScript.
