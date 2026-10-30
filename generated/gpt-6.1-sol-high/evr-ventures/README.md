# EVR Ventures

A responsive, video-backed hero built from the complete local `PROMPT.md` using React, Vite, Framer Motion and Lucide icons. Includes the circular menu reveal, staggered navigation, animated 75% ring, and continuously scrolling partners. The site uses the requested black/white palette, Geist, Gilda Display, original video and exact copy.

## Run and build

The host has no Node installation. Run from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

With Node 22 installed, `npm ci && npm run dev` starts development and `npm run build` generates `dist/`. Vite's base is `/motionsites-results/evr-ventures/`. Serve `dist/` at that URL prefix. All video, fonts, favicon, and bundled application files are local. No deployment or push was performed.

## Verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

This serves the production build in the temporary container, runs Chromium through the existing Playwright installation, and writes screenshots and machine-readable browser results. Verified at desktop 1440×1000, mobile 390×844 and tablet 820×1180:

- Video decoded and played automatically, muted and inline.
- Local Geist and Gilda Display loaded; ring reached 75%.
- No horizontal overflow, browser script errors, failed requests or console errors.
- Menu opened/closed; all five links were present; body scroll locked and restored; Escape and keyboard focus containment worked.
- Quick navigation focused the corresponding overlay link; menu links closed the overlay and updated the URL fragment.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/menu.png`. Detailed checks: `screenshots/checks.json`. Build output: `build.log`. Vite reports benign ignored Framer Motion `use client` directives; production compilation succeeds.

## Assets and limits

The exact CloudFront MP4 from `PROMPT.md` was successfully downloaded unchanged to `public/assets/evr-landscape.mp4`. Geist weights 100–900 and Gilda Display 400 were downloaded from Google Fonts to `public/assets/`. `fonts-source.css` records the original upstream URLs; `fonts.css` resolves exclusively to local files. Python's initial font transfer stalled; bounded curl downloads recovered all files. No asset substitutions or screenshot extractions were needed. The optional `/home/opc/motionsites/assets/previews/evr-ventures.webp` reference was absent.

The unusually tight heading tracking (`-0.2em`) is intentional and follows the prompt exactly. Navigation beyond Home uses URL fragments because only a hero was specified; additional page content, contact details and backend services were not supplied. Quick navigation opens the prescribed menu and focuses its relevant item. Browser checks cover local Chromium; other browsers and physical devices were not tested. The original looping video has no dark overlay.
