# Immersive Ocean

Design ID: `immersive-ocean`. A single-viewport Foldcraft creative studio landing page built with React, Tailwind CSS, Lucide React, and Vite. Includes the exact supplied background video, Google Fonts Geist, staggered hero animations, responsive navigation, and an animated mobile overlay.

## Build and run

With Node.js 22 and npm:

```bash
npm ci
npm run build
npm run dev
```

Open `/motionsites-results/immersive-ocean/` on the development server. The production output is `dist/`, configured for that same subpath. Serve it with `npm run preview` or mount the output at the configured path.

The build used the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Browser verification

The repeatable verification script serves the real production build at its required subpath and uses Chromium via the image's installed Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Checks cover desktop 1440×1000 and mobile 390×844, horizontal and vertical overflow, exact heading, responsive navigation, video and font loading, mobile menu opening and dismissal through every link, Escape dismissal, resizing to desktop, reduced-motion text visibility, and browser errors. Menu state is exposed with ARIA attributes; hidden content is inert and keyboard focus stays within the open menu.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. The script pauses the actual supplied video at three seconds only for repeatable screenshots; the delivered page autoplays and loops it. Machine-readable browser evidence is saved in `screenshots/checks.json`.

## Scope and limitations

The prompt defines only one viewport and provides no project pages, studio pages, or contact destination. Navigation and CTA links therefore use same-page `#` destinations, and mobile links dismiss the menu as specified. No additional screens or contact workflow were invented.

The video remains hosted at the exact supplied CloudFront URL. Geist loads through a Google Fonts link in `index.html`. Both require network access; the page has a black background and sans-serif font fallback. No deployment or push was performed.

Verification recorded two aborted video requests during the browser test lifecycle. These did not prevent playback: Chromium reported readyState 4, 1920×1080, active playback, and no media error. Raw request records are preserved in `screenshots/checks.json`. No assets were unavailable.
