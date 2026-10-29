# CARGOX Mobile

Three CSS iPhone mockups for CARGOX GROUP, ordered Info → Hero → Contact, built with Vite, React, TypeScript, Tailwind CSS, Motion (`motion/react`), and Lucide React. The phones stack below 900px with JavaScript zoom. Each screen scrolls independently.

Production output is in `dist/`, configured for `/motionsites-results/cargox-mobile/`. Nothing was deployed or pushed.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Visit `/motionsites-results/cargox-mobile/` on the Vite server. Dependencies are locked in `package-lock.json`; installed dependencies and caches are excluded from the handoff.

## Validation

The actual production build was tested with Chromium and the image's preinstalled Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && node scripts/browser-check.cjs'
```

The script starts and stops its own preview server. Checks passed for:

- Desktop 1440×1000: three phones, loaded images and Barlow font, playing video.
- Mobile 390×844: vertical stacking, 350px phone width, expected zoom, no page overflow.
- Medium 1024×900: no page overflow.
- Menu open/close and navigation, CTA navigation and form focus, required field validation, local submission feedback, scroll-to-top, and mobile CTA.
- Zero JavaScript errors.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png` (full stacked page), and `screenshots/checks.json`. Both screenshots were visually inspected. Chromium recorded aborted video range requests during initialization/reload; the video reached readyState 4 and played. No image or font failures occurred.

## Assets and limitations

The exact supplied video, map, ship, car, and plane assets downloaded successfully and are served locally from `public/assets/`. Their source URLs are preserved in `PROMPT.md`. The required Google Fonts import is present, with a local copy of Barlow Condensed 800 from its Google Fonts stylesheet as a fallback. No preview screenshot is used as page content.

The prompt mentions a full CTA SVG path without supplying it. The yellow pill, right circular shape, and animated arrow were recreated from the written description. Menu items navigate to the Info phone because separate destination pages were not specified. Social buttons link to platform homepages because company profile URLs were not supplied.

The form validates names and email, then displays an explicit local preview acknowledgement. No backend endpoint was supplied, so it sends no data or messages. Email and phone links use the supplied contact details.
