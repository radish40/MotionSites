# Wellbeing OS

Design ID: `wellbeing-os`. A single fullscreen **flowpath** hero implemented from this project's `PROMPT.md`, using React, Tailwind CSS (default theme), and Lucide React icons. Includes the exact hero copy, supplied video, Helvetica Now Text, liquid-glass CSS, hover dropdowns, and animated mobile navigation.

## Build and run

Requires Node 22 and npm. The dependency lockfile is included.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/wellbeing-os/`. Production files are in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/wellbeing-os/`.

On this host, Node/npm are available in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/wellbeing-os:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Validation

The production build succeeded with Vite 6.4.5. `npm audit` reported zero vulnerabilities.

Real Chromium checks use the image's existing Playwright Core and Chromium. The script starts a temporary HTTP server for `dist/` at the required base path and shuts it down when finished:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/wellbeing-os:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

Verified:

- Desktop 1440×1000 and mobile 390×844: viewport-filling section, no horizontal or vertical document overflow.
- All desktop dropdowns: hover, item selection, keyboard activation, Escape dismissal, and absolute positioning.
- Mobile menu: animation, all navigation items, item selection, close toggle, and Escape dismissal.
- Original video: 1920×1080, autoplaying, muted, looping. Original font loaded successfully.
- Local video and font fallbacks: load with original asset providers deliberately blocked.
- No unexpected browser console errors, JavaScript exceptions, or failed requests.

Screenshots were visually reviewed. They capture the video at one second for a consistent frame; normal page playback remains automatic.

- [Desktop](screenshots/desktop.png)
- [Mobile](screenshots/mobile.png)
- [Mobile menu](screenshots/mobile-menu.png)
- [Machine-readable browser report](screenshots/browser-report.json)

The browser report separately records normal cancelled media range requests and the deliberately induced errors used to verify fallbacks.

## Assets and scope

The exact video and font URLs in `PROMPT.md` were reachable. The video uses the original URL with an identical bundled MP4 fallback. The original font stylesheet is loaded, with a bundled WOFF2 fallback. No substitute imagery or fonts were needed. Font provider credit: [Web Fonts / OnlineWebFonts](https://www.onlinewebfonts.com/fonts); its supplied stylesheet identifies CC BY 4.0 attribution.

CTA, account, pricing, and submenu destination flows are not defined in the prompt. Their controls are styled, and navigation menus function, but no account backend, pricing screen, demo page, or additional routes were invented. The home logo links to the configured base path.

`ready` in `result.json` means ready for acceptance review. This project has not been deployed or pushed.
