# VEX Ventures

Design ID: `vex-ventures-hero`.

A responsive, full-viewport React + TypeScript hero built with Vite and Tailwind CSS. Implements the supplied copy, Inter typography, liquid-glass navigation and cards, character entrance animation, timed fades, and original video background. All page text and controls are real DOM elements.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The development and preview URLs use `/motionsites-results/vex-ventures-hero/`. The production output is `dist/`, including `dist/index.html` and the local video. Serve the output at that same subpath.

On this host, Node/npm are supplied by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The check serves the actual production build from its required subpath in a temporary container and uses the image's Chromium and Playwright Core. It verifies desktop 1440×1000 and mobile 390×844, viewport overflow, JavaScript errors, failed requests, Inter loading, video decoding and advancing playback, completed heading animation, Explore Now activation, desktop navigation anchors, and the Explore Now hover colors. It records chat hrefs; delivery through an external email client is outside the browser check.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json`

Production build and browser checks passed. Both target viewports fit without page overflow, video played muted and looping at its native 1924×1076 resolution, Inter loaded, and no JavaScript errors or failed network requests were observed. Screenshots were visually reviewed.

## Assets and limitations

- The exact provided video was downloaded unchanged to `public/assets/vex-background.mp4` from https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4 (13,786,890 bytes). The build copies it locally so playback does not depend on that external host. No extraction, replacement, dimming, or overlay was used.
- Inter uses the exact Google Fonts link specified in the prompt, and loaded successfully in Chromium. Future font loading requires access to Google Fonts; the CSS sans-serif fallback remains available.
- The optional original preview at `/home/opc/motionsites/assets/previews/vex-ventures-hero.webp` was absent. Layout was implemented from the full written specifications; a direct comparison against that preview was unavailable.
- No chat endpoint, email address, or destination sections were specified. Both Start a Chat buttons use `mailto:?subject=VEX%20Ventures%20Enquiry`, opening an email draft with a blank recipient. Navigation links target the heading or matching service text within this hero; Explore Now targets the service card. No additional pages or services were invented.
- Autoplay is muted and inline as requested; playback remains subject to browser/device policies. Screenshots capture different moments of the running video.
- Reduced-motion preferences shorten text transitions. No UI libraries or icons were needed.

No deployment or push was performed. `ready` in result.json means ready for review.
