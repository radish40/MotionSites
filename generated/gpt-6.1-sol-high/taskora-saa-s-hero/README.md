# Taskora SaaS Hero

A responsive Taskora landing page built with React, Tailwind CSS, Vite, and Framer Motion. Design ID: `taskora-saa-s-hero`.

The page includes a floating glass navbar, mobile dropdown, animated hero, the specified looping background video, and a real DOM light dashboard with three statistical cards, revenue chart, navigation rail, avatars, and deals table. Instrument Serif italic is used only for “Workflow”; Manrope for supporting hero text, Cabin for the main CTA, and Inter for navigation and the dashboard.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/taskora-saa-s-hero/` on the dev or preview server. The production bundle is in `dist/`, including `dist/index.html`; Vite's base is set to this exact publication subpath. No deployment has been performed.

The build used the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

Run the Chromium checks against the production build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script runs a temporary HTTP server inside the container and uses its existing Playwright installation and Chromium. Desktop 1440×1000 and mobile 390×844 checks cover font loading, video autoplay, document overflow, demo and sign-in forms, modal dismissal, mobile navigation, and horizontal dashboard scrolling. Desktop also checks sign-up, Company, and Contact dialogs. Reduced-motion settings disable entrance animation and video autoplay. No script errors or failed asset requests were observed.

Screenshots:

- `screenshots/desktop.png`: required desktop viewport.
- `screenshots/mobile.png`: required mobile viewport.
- `screenshots/desktop-full.png`: full dashboard and page.
- `screenshots/browser-checks.json`: machine-readable browser results.

Screenshots pause the video at three seconds after checking actual autoplay, for reproducibility. Both required viewport screenshots were visually reviewed.

## Assets and limitations

- `public/assets/hero-background.mp4` is an unmodified local copy of the exact CloudFront video in `PROMPT.md`; the source returned HTTP 200. Local bundling preserves the specified asset without a runtime CDN dependency.
- The four specified font families were downloaded from Google Fonts and bundled as TTF files. `public/assets/fonts-source.css` preserves the original Google response; `fonts.css` uses local URLs. All four families were verified in Chromium.
- Three small profile photos are locally bundled from `https://i.pravatar.cc/80?img=12`, `?img=47`, and `?img=13`. Icons use Lucide; the Taskora mark and Amazon-style company mark are code-drawn.
- The optional reference `/home/opc/motionsites/assets/previews/taskora-saa-s-hero.webp` was absent. Visual implementation follows the written prompt; no screenshot or video substitutes for page layout. No reference extraction or asset approximation was needed for the specified video/fonts.
- Dashboard controls are intentionally a non-functional product mockup. Hero and account buttons open local preview dialogs; form validation and results work locally, with explicit notices that nothing is sent or stored. There is no authentication, booking, or backend service.
- Testing covers the bundled Chromium browser and the two requested viewport sizes; other browsers and actual mobile devices were not tested.
