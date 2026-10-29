# Daisy Wild

Design ID: `daisy-wild`. A standalone fragrance section built from the exact specification in `PROMPT.md` using React 18, TypeScript, Tailwind CSS 3 defaults, and Vite. Includes exported `ProductPanel` and `WildScentSection` components in `src/WildScentSection.tsx`.

The desktop layout places the looping video left and the lime product panel right. Below 768px, `flex-col-reverse` places the product panel above the 75vw video strip. The supplied copy, asset URLs, system font stack, dimensions, and staggered IntersectionObserver animations are retained. No additional product flows or packages were added.

## Run and build

With Node and npm installed:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/daisy-wild/` on the printed local server address. The production output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/daisy-wild/`; serve the contents of `dist/` at that path.

The actual build in this environment used the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --no-audit --no-fund && npm run build'
```

`package-lock.json` is included. `node_modules/` is ignored and is not part of the deliverable.

## Validation

TypeScript checking and Vite's real production build passed. The repeatable Chromium check serves the built files under the configured subpath and uses the image's existing Playwright installation, without adding a project dependency:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Verified at desktop 1440×1000 and mobile 390×844:

- Exact equal desktop columns and full viewport height; correct mobile order and 292.5px video strip.
- No horizontal document overflow, loaded product image, and active muted inline video playback with loop enabled.
- Lime panel color, bold notes, 1px button border, completed entry animation and specified button transition.
- White button hover fill; pointer click, keyboard focus, and Enter activation without errors.
- No JavaScript exceptions or console errors. Tailwind switches from flex to grid at 768px (767px and 768px checked).

Screenshots were captured after animations completed and visually reviewed: `screenshots/desktop.png` and `screenshots/mobile.png`. Detailed measurements and request events are in `screenshots/browser-checks.json`.

## Limits and assets

Both exact external asset URLs returned HTTP 200 and loaded in Chromium. The page depends on those external hosts; no custom fonts are requested. Chromium recorded one `net::ERR_ABORTED` request for the MP4 on desktop while the responsive video elements shared the source. The visible video loaded and played successfully; the report preserves the event and the check permits only that specific media cancellation.

The provided SHOP NOW specification defines a visual button without a destination or purchase behavior. It is implemented as specified; no checkout or navigation was invented. Video frames vary between captures. Browser checks used Chromium rather than physical mobile hardware.

Status `ready` means the local deliverable is ready for review. Nothing was deployed or pushed.
