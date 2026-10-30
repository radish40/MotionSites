# Intelligence Layer

A single-file cinematic landing page implementing `PROMPT.md`. The document title is **The Next Layer of Intelligence**. The page uses inline CSS, JavaScript, SVG marks, and an embedded Manrope variable WOFF2 font. The full-screen background plays the exact required CloudFront MP4.

## Run and package

Open `index.html` directly in a browser; no dependencies or compilation are needed. The packaging command copies the complete page to `dist/index.html`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
```

The dependency-free `package-lock.json` is included. All application resources are inline except the required absolute video URL, so the output works at `/motionsites-results/intelligence-layer/` without path rewriting or a bundler.

## Validation

Browser checks use the existing Chromium and Playwright installation in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 check.cjs
```

The test serves the actual `dist/index.html` at the required subpath. It checks 1440×1000 desktop, 390×844 mobile, 1487×1058 reference canvas, and 768×1024 tablet, verifies embedded font loading, video decoding/playback, document overflow, mobile menu opening, Escape dismissal, link dismissal, landscape dismissal, and reduced-motion entrance behavior. Browser errors and failed requests are recorded in `screenshots/checks.json`. Video requests cancelled by page navigation are listed separately from failed requests; playback is asserted on every viewport. Screenshots are saved as `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`.

## Assets and limits

- Video: exact CloudFront URL in `PROMPT.md`; HTTP 200 confirmed and playback checked in Chromium. It remains an external network dependency as requested. Screenshot frames can differ because the video is animated.
- Manrope: original Google Fonts Latin variable WOFF2 (weights 200–800), sourced from `https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2`, retained in `assets/` and embedded into the HTML.
- IpsumMark binary/source page was not supplied. The four partner wordmarks use the expressly permitted `'IpsumMark','Manrope',sans-serif` stack, falling back to bold Manrope. Partner icons are hand-reconstructed SVG silhouettes from the supplied descriptions and this design’s reference preview. Exact original logo path fidelity is approximate.
- Brand SVG uses the exact supplied geometry and gradient.
- This design’s preview was viewed solely for composition comparison; no screenshot pixels were used as webpage assets.
- No link destinations or application backend were supplied. Navigation and CTA anchors use `#`; mobile navigation closes as specified. No extra sections or product workflows were invented.
- Reduced motion removes entrance animations and menu transitions as specified; the required ambient video continues to loop.

All source, packaging, screenshots, and validation files are contained within this project. No deployment or push was performed.
