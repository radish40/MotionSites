# Space planet

SpaceEdu is a full-viewport, cinematic planet hero, implemented from this project's `PROMPT.md`. Earth starts featured; the side buttons select Venus, Mars, and Earth reversibly. The page uses the supplied videos, stills, transparent planet artwork, Google Fonts, exact design-unit CSS, six responsive tiers, entrance animation, mobile navigation, and reduced-motion stills.

`index.html` is the complete website: one inline stylesheet, the requested blocking entrance initializer in the head, and one inline behavior script before the closing body. It needs no framework, external JavaScript, dependencies, or compilation. `dist/index.html` is the publishable copy. All specified asset URLs are used directly; no reference screenshot is used in the page.

## Build and run

The build only validates and copies the authored HTML; it does not bundle or compile it. On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci --ignore-scripts && npm run build'
```

With Node installed, use `npm ci --ignore-scripts && npm run build`. Open `index.html` directly or serve `dist/`. The single-file page has no local resource paths and works under `/motionsites-results/space-planet/` without a Vite base setting.

## Browser verification

The test serves the real `dist/index.html` at the required subpath in a temporary container and uses its installed Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

Evidence is saved to `screenshots/browser-report.json`. Screenshots include `desktop.png` (1440×1000), `mobile.png` (390×844), both alternative featured planets, and the mobile menu. Checks cover initial lazy video sources, animation cleanup, actual font/image loading and video playback, the complete planet cycle, unchanged cutout sources, synchronous cutout updates, keyboard activation, menu closing and focus return, reduced motion, runtime/network errors, responsive breakpoints, landscape, and horizontal overflow for every integer width from 320 through 2560.

The supplied reference `/home/opc/motionsites/assets/previews/space-planet.webp` was viewed solely to compare this design. No assets were extracted or approximated.

## Scope and limitations

The prompt supplies placeholder `href="#"` destinations and no second section or scroll behavior. Those destinations and the scroll control remain as specified; there is no invented enrollment flow or additional content. Media and fonts require access to their original CloudFront and Google hosts. Video frames vary during playback, so screenshot frames are not deterministic. Browser validation covers Chromium, not physical iOS devices or every browser. No deployment, push, other session, or agent work was performed.
