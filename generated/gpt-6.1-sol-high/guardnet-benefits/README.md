# Guardnet Benefits

A single responsive benefits section implemented from `PROMPT.md` using React, TypeScript, and Tailwind CSS, built with Vite. The design uses the specified Futura font, exact copy, blue glows, and original looping video. No extra UI or animation libraries are included.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL is `/motionsites-results/guardnet-benefits/`. Production files are in `dist/`, including `dist/index.html`. Serve that directory at the configured URL prefix.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The dependency lockfile is `package-lock.json`. Dependencies are excluded from version control with `.gitignore`.

## Verification

The real production build passed TypeScript checking and Vite bundling. The production output was served under its configured URL prefix and checked with Chromium through the image's existing Playwright installation:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

- Desktop: 1440 × 1000; three columns, 460px cards.
- Mobile: 390 × 844; one column, 380px cards.
- No horizontal overflow, JavaScript exceptions, console errors, or HTTP error responses.
- Futura loaded successfully in both viewports.
- Video decoded at 1440 × 1440, autoplayed, and advanced in both viewports. Muted, loop, and inline playback flags were verified.
- No other interactions are specified; the page adds no hover states or JavaScript animations.
- Both full-page screenshots were visually inspected.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`.

## Assets and limitations

The specified font import and exact CloudFront video URL remain external dependencies. Both endpoints returned HTTP 200 and both assets loaded in Chromium. The browser recorded one `net::ERR_ABORTED` video request per viewport; the video nevertheless reached readyState 4 and played successfully. The raw report retains these events. There were no HTTP error responses. Future offline use or external service availability is not guaranteed.

Status is ready for review. No deployment, push, external messages, or other project work was performed.
