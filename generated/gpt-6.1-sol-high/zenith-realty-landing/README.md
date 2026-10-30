# Zenith Realty

Luxury real estate landing page for design `zenith-realty-landing`, implemented from the complete local `PROMPT.md`. React + Vite, Tailwind CSS 4, Lucide React, Motion (`motion/react`), and Recharts. Includes the full-height video hero, property collection, interactive service selector, and three custom capped bar charts. No footer.

## Build and run

The host has no Node installation; use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Vite is configured for `/motionsites-results/zenith-realty-landing/`.

For a local preview:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173'
```

Open `http://localhost:4173/motionsites-results/zenith-realty-landing/`. This project has not been deployed or pushed.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The check starts a temporary HTTP server inside that container, serves the real production output at its configured path, and runs installed Playwright Core with Chromium. Desktop viewport: 1440 × 1000. Mobile viewport: 390 × 844 with touch/mobile emulation. Checks include video playback, local font and image loading, horizontal overflow, three rendered charts, absence of a footer, desktop dropdown, slide-in mobile navigation, keyboard service tabs, consultation/property dialogs, local form validation, and Escape dismissal. Console errors and failed network requests are recorded.

Full-page screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable details: `screenshots/browser-checks.json`. Motion sections are scrolled into view before screenshots.

## Assets and fidelity

- Hero uses the exact supplied CloudFront MP4, downloaded without modification to `public/assets/hero.mp4`.
- The four image files are the exact supplied Higgs proxy WebP outputs, downloaded to `public/assets/`. Recovery/re-download code: `scripts/fetch-assets.py`.
- Initial Python requests failed (image proxy returned HTTP 403; direct origin requests stalled). Curl successfully downloaded the supplied assets. No substitute images or screenshot-based page content were used.
- Lato 300, 400, 700, and 900 are local copies from Google Fonts. Google's response to the requested 300/400/500/700/900 family omitted a separate 500 file; the local 400 face covers CSS weights 400–500, consistent with Lato's available regular face. The response is preserved in `public/assets/lato-google.css`; the application loads local fonts only.
- The optional Zenith reference WebP did not exist at the specified path. Implementation follows the written design; comparison against that visual reference was unavailable.

## Interactions and limits

The mobile menu slides from the right with AnimatePresence. Service tabs switch the title, description, active state, and accessible panel label. Buttons open focused, dismissible dialogs. Forms validate locally and explicitly state that no information is sent or stored; there is no supplied backend. Mortgage and Blog navigate to the on-page investment section; Company navigates to services. Careers opens an introduction form. No separate routes or extra page sections were added.

The metric values/data are the exact design examples, not live financial data. Video screenshots vary by playback frame. Reduced-motion settings disable entrance offsets and chart animation; the supplied ambient video remains autoplaying as requested. Browser coverage is Chromium at the two required viewport sizes; Safari and real-device checks were not available.

The build passes with a Vite advisory for the main JavaScript chunk exceeding 500 kB (React, Motion, and Recharts); this is not a build failure. Dependencies and `package-lock.json` are retained; `node_modules/` is ignored and is not part of `dist/`.
