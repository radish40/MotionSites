# Datacore Booking

Responsive React and Tailwind CSS hero built from this project's `PROMPT.md`. The page uses the requested copy, Future branding, purple palette, glass announcement pill, Instrument Serif headline, and an opaque HTML5 video background. The project identifier is `datacore-booking`.

## Run and build

Requires Node 22 and npm, or the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For local development, run `npm ci` and `npm run dev`. To preview the production build, run `npm run preview` and visit `/motionsites-results/datacore-booking/`. Vite's base is configured for that exact path. All publishable files are in `dist/`, including `dist/index.html`; no external runtime asset requests are needed. `package-lock.json` pins dependencies. `node_modules` is ignored and is not a deliverable.

## Assets and design fidelity

- `public/assets/hero.mp4` is the original 27,999,725-byte video downloaded successfully from the exact CloudFront URL in `PROMPT.md`. It is rendered as a real autoplaying, looping, muted, inline video with object-cover and no overlay.
- Manrope, Cabin, Instrument Serif (normal and italic), and Inter were downloaded from Google Fonts and are served locally. `public/assets/google-fonts-source.css` preserves their original source URLs; `fonts.css` maps them to the bundled TTF files.
- The project's allowed reference `/home/opc/motionsites/assets/previews/datacore-booking.webp` was inspected to confirm the video composition. No reference screenshot or video was used as a page substitute, and no assets were extracted from it.
- The requested SVG path ends with an ellipsis after `M1.04356 6.35771L13.6437 0.666504`. A complete original logo was not supplied. The white geometric SVG mark is an approximation beginning with those coordinates, paired with the Future wordmark. The favicon is derived from this approximation.

## Interactions and scope

Desktop Services opens a small menu. On mobile, the hamburger toggles the requested fullscreen black navigation, with keyboard focus containment, Escape dismissal, and scroll locking. Navigation and CTA destinations were not provided; they open honest preview dialogs rather than performing bookings, sign-ins, or submissions. No backend, accounts, or additional application screens are included.

## Verification

The actual production output was served under `/motionsites-results/datacore-booking/` in a temporary Docker container and tested using Chromium with Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

- Production build: passed with Vite 6.4.5.
- Desktop 1440×1000 and mobile 390×844: passed; horizontal document widths match their viewports.
- All four fonts loaded; original video decoded at 1708×1212 and was confirmed playing, muted, and looping.
- Desktop service selection, all nav/CTA dialogs, dialog dismissal, mobile service selection, menu close button, and Escape dismissal passed.
- No browser script/console errors, failed requests, or HTTP asset errors in the final run.
- `npm audit`: zero known vulnerabilities at installation time.
- Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Video was paused at two seconds only during screenshot capture for repeatability.
- Machine-readable browser evidence: `screenshots/browser-report.json`.

Validation used desktop Chromium with mobile viewport emulation; physical devices and other browser engines were not tested. Autoplay behavior can depend on browser/device settings. The exact logo cannot be verified from the incomplete supplied path.

Ready for management-session acceptance. Not deployed or pushed.
