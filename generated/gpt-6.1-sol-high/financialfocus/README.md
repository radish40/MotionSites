# FinancialFocus

A local, production-built implementation of the supplied Wavebank design (project ID `financialfocus`). The page title remains **3D Cylinder Carousel**, as specified in `PROMPT.md`.

The implementation preserves React 18, Tailwind CSS 4, Babel JSX/TypeScript compilation, the exact copy and inline logos, five volumetric credit cards, looping video textures on both faces, magnetic carousel easing, mouse parallax with inertia, and responsive sizing. Build-time compilation replaces the prompt's browser/CDN compilation; runtime dependencies, videos and fonts are served locally.

## Build

```bash
npm ci --no-audit --no-fund
npm run build
```

On this host, use the available Node 22 Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

Publishable files are in `dist/`, including `dist/index.html`. All resource URLs are relative and work at `/motionsites-results/financialfocus/`. Serve the contents of `dist/` at that URL prefix. No deployment is performed.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check script uses the image's existing Playwright Core and Chromium, starts a temporary HTTP server at the exact URL prefix, and checks desktop 1440×1000 and mobile 390×844. It verifies video readiness/playback, fonts, images, animation, desktop mouse tilt, clickable buttons, keyboard focus, JavaScript errors, failed requests, and document overflow. Evidence is saved to `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`.

Both required viewports passed, with all ten video elements playing, all four font families available, both images loaded, keyboard focus working, no script/console errors, and no document overflow. Some MP4 range requests were canceled by Chromium (`net::ERR_ABORTED`); these are retained in the raw evidence and excluded from broken-request counts because all videos reached readyState 4. Both screenshots were visually inspected.

## Assets and limitations

- All six unique supplied MP4s were downloaded successfully without alteration; the original carousel uses the first five. Their original URLs and retrieval results are in `asset-report.json`.
- Inter, JetBrains Mono, Manrope, and Mr Dafoe are bundled from the specified Google Fonts endpoint.
- Both supplied SVG endpoints (`wave-icon.svg` and `w.svg`) return HTTP 404. Local replacements reuse the W path embedded in the prompt's card logo. The corner mark therefore uses the supplied brand vector; the large, subdued background is an approximation because the original background SVG is unavailable.
- The prompt supplies hover/active feedback for Order Card and Menu but no click handlers, menu contents, order flow or destination. This implementation preserves that scope.
- The carousel deliberately clips cards at viewport edges and runs continuously, matching the prompt. Chromium checks do not constitute cross-browser certification. Video assets make the distributable approximately 54 MB.
