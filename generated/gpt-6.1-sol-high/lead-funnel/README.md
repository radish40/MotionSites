# Lead Funnel

Project ID: `lead-funnel`. A local, production-built implementation of the complete design in `PROMPT.md`. The page retains the Viktor Oddy brand, copy, black layout, Inter Tight/Fraunces typography, image preloader, kinetic text, progressive edge blur, rotating 3D portfolio, mobile menu, cookie controls, and budget → email → confirmation flow.

## Stack and build

React 19.0.0, Motion 12.23.24, Tailwind CSS 3.4.17, Bootstrap Icons 1.11.3, and Vite. Motion's underlying packages are pinned to the versions associated with the requested release. Dependencies are locked in `package-lock.json`. The original browser Babel and Tailwind compilation is replaced by a production build using the same React components and utility styles.

With Node installed:

```bash
npm ci
npm run build
npm run dev
```

Use `/motionsites-results/lead-funnel/` when opening the development server. The Vite base and bundled asset URLs use that path. `dist/index.html` and the rest of `dist/` form the static deliverable.

In this workspace, Node/npm and Chromium are provided by the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check-browser.cjs'
```

The script serves only this project's `dist/` on an internal temporary HTTP server, then launches the image's Chromium using Playwright. It checks desktop 1440×1000 and mobile 390×844, assets and fonts, viewport overflow, cookie banner bounds, automatic carousel rotation, arrow/wheel input, pointer dragging, mobile menu, cookie choices, minimum budget, click/Enter progression and submission summary, browser errors, and failed requests. Evidence is stored in `browser-checks.json` and `screenshots/desktop.png`, `screenshots/mobile.png`, plus confirmation screenshots. Screenshots were visually reviewed. `build.log` contains the real build output; Motion's ignored `use client` bundling notices do not prevent compilation.

## Assets and source behavior

All six original animated Mux WebP files, three original JPG designs, both font families, and Bootstrap Icons are cached under `public/assets/` and included in `dist/assets/`. No runtime CDN is needed. `asset-report.json` records the original image and font URLs and download outcomes. The provided Twitter avatar returns HTTP 404; a local circle with “VO” initials is used instead. No substitute portrait was invented. `scripts/cache-assets.py` can refresh the original image/font downloads using curl.

The desktop cookie banner uses the CSS `translate` property for centering so Motion's animated `transform` cannot move its buttons outside the viewport. This corrects a conflict in the supplied code without changing the design. The header has its own isolated compositing layer to prevent intermittent loss of animated header content behind the perspective/blur layers in Chromium.

The source's navigation and privacy links are placeholders that prevent navigation. The external profile link is retained. Submission is a local confirmation only: the supplied design defines no backend or email delivery. As in the source, progression requires a budget of at least 1000 and the email step enables submission after four characters (the source's email regex is not used to gate submission). Cookie choices are written to localStorage; the original design shows the banner on a fresh page load regardless of the saved value. The page intentionally fills the viewport, clips the carousel, and prevents page scrolling. These source behaviors were preserved rather than adding new features.

Nothing has been pushed or deployed. `ready` means ready for acceptance review of the local artifacts.
