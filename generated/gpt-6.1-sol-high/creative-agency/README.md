# Creative Agency

A single React + TypeScript hero built to `PROMPT.md` with Tailwind CSS and lucide-react. The original video URL, logo SVG paths, copy, responsive classes, typography settings, and hover/press effects are preserved. No application state, extra animations, or backend is included.

## Build and run

Node 22 and npm are available in the prescribed Docker image. Run from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The production artifact is `dist/`, including `dist/index.html`. Vite uses `/motionsites-results/creative-agency/` as its base. Serve `dist/` under that exact URL prefix.

For local development:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 5173:5173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run dev'
```

Open `http://localhost:5173/motionsites-results/creative-agency/`. The dependency versions are recorded in `package-lock.json`; node_modules is excluded from version control.

## Validation

The real production build passed TypeScript checking and Vite bundling. Chromium browser checks serve `dist/` at the required URL prefix and can be reproduced with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The checks cover the 1440×1000 desktop and 390×844 mobile viewports, exact headline, specified controls, mobile navigation visibility, horizontal overflow, video playback attributes/readiness, font loading, reservation hover colors, navigation border hover, Instagram fade, begin button hover/press scale, stat-card blur, and JavaScript/console errors. Screenshots were also visually inspected.

- `screenshots/desktop.png`: desktop full-page capture.
- `screenshots/mobile.png`: mobile full-page capture (925px document height).
- `screenshots/browser-report.json`: observed browser state and resource responses.

## Constraints and assets

This is the requested visual-only section: controls provide the specified hover and press feedback without invented routes or forms. Mobile scrolls vertically to accommodate the exact stacked layout; neither tested viewport has horizontal overflow.

Inter and Britanica-Black loaded from their exact specified imports. Geist is not additionally loaded, so the headline uses the explicitly permitted sans-serif fallback. The exact CloudFront video responded with HTTP 206 and played muted, inline, and looping without a media error. Chromium may abort individual video byte-range requests while continuing playback; these transport events are recorded in the browser report. Remote fonts and video require internet access.

Nothing has been deployed or pushed. `ready` in result.json means ready for review, not published.
