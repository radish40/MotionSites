# Orbit Web3

Design ID: `orbit-web3`. A cinematic single-screen landing page built from the supplied `PROMPT.md`: Instrument Serif typography, original full-bleed looping video, W navigation mark, layered directional text glow, amber CTA, and a seamless Lucide logo marquee. Built with vanilla HTML/CSS/JavaScript, Vite 6.4.5, and Lucide. No framework was specified in the prompt.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The configured base URL is `/motionsites-results/orbit-web3/`. The complete static deliverable is `dist/`, including `dist/index.html`, video, fonts, CSS and JavaScript. Serve the contents of `dist/` at that URL.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The reproducible check serves the actual build at its specified subpath in temporary Chromium. It checks 1440×1000 and 390×844 layouts, horizontal and vertical overflow, loaded font, original video playback, moving marquee, ten Lucide icons, navigation hash clicks, CTA hover scale, click, keyboard focus and activation, and JavaScript errors. It additionally blocks external HTTPS requests to verify the locally hosted font loads independently.

- `screenshots/desktop.png` and `screenshots/mobile.png`: real browser captures, visually reviewed.
- `screenshots/checks.json`: recorded viewport and runtime results.
- No JavaScript errors or failed network requests in the normal desktop/mobile checks.
- Production build passes; `npm audit` reports zero vulnerabilities.

The screenshot harness pauses the video at three seconds only for repeatable screenshots; the delivered page autoplays and loops. The marquee remains animated. Reduced-motion preference disables marquee motion and hover transitions.

## Assets and scope

The exact video was successfully downloaded from:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_094440_a3592600-bd1e-49e5-9bce-a73662061d83.mp4`

It is preserved locally as `public/assets/orbit.mp4`, with no extraction or visual substitute. Instrument Serif regular and italic were downloaded from the Google Fonts stylesheet's original gstatic URLs and included locally. The exact requested Google Fonts `<link>` remains in the document, and local font definitions make rendering independent of that external service. The retrieved stylesheet is retained at `public/assets/instrument-serif-google.css` for provenance.

The optional original reference preview did not exist at the specified path; the implementation follows the full written prompt. No other designs were read. All layout, text, icons and controls are real DOM/SVG, not screenshots.

The prompt supplies no destinations, wallet connection, or product behavior. Navigation uses the corresponding URL fragments; the CTA is a focusable button with the specified visual interactions and no product action. This is the requested landing-page design, with no backend or transaction functionality. Mobile uses the exact 60px heading size and naturally wraps the first phrase. Browser verification used container Chromium rather than physical mobile hardware. Nothing was pushed or deployed.
