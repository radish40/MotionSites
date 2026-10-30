# Horizontal Gallery

Design ID: `community-superdesign-horizontal-gallery`.

A complete React + GSAP photographic gallery branded Somewhere. Vertical scrolling pins the gallery and translates four real DOM photograph cards horizontally. Includes progress, previous/next navigation, responsive layouts, a closing section, and back-to-top navigation.

GSAP initializes after font readiness, image decoding, and a 100 ms safety delay inside `useLayoutEffect`. Measurements are refreshed on resize; React StrictMode cleanup removes the previous animation and pin. Reduced-motion users receive a native, unpinned horizontal gallery.

## Build and run

Requires Node 22 and npm. Run `npm ci`, then `npm run build`. The complete static build is in `dist/`, including `dist/index.html`. `npm run dev` starts local development.

The configured public base is `/motionsites-results/community-superdesign-horizontal-gallery/`. Serve the contents of `dist/` at that path. No deployment was performed.

On this host, the build was run using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The real production build was served at its configured subpath and tested with Chromium and Playwright at 1440×1000 and 390×844. Verified loaded photographs, no document overflow, pinned vertical position, horizontal translation from wheel input, previous/next controls, pin release, and back-to-top. Also tested resizing between desktop and mobile and the reduced-motion fallback. No browser script errors or failed HTTP requests. The dependency audit reports zero vulnerabilities.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and additional `*-pinned.png` views. Machine-readable browser results: `screenshots/checks.json`.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-horizontal-gallery.webp` was absent. The supplied prompt specified React, GSAP, pinned horizontal scrolling, and safe initialization, but no particular brand, copy, font, or image URLs. The editorial art direction and copy were created for this implementation; visual parity with the missing reference could not be checked.

Photographs were downloaded successfully from Unsplash and are served locally under `public/images/`:

- `alpine.jpg`: `https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=85`
- `architecture.jpg`: `https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=85`
- `desert.jpg`: `https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=85`
- `ocean.jpg`: `https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=85`

DM Sans regular and semibold were downloaded from Google Fonts and are served locally in `public/fonts/`; the original stylesheet is retained as `font-source.css` for provenance. No external network requests are required at runtime. All page text, layout, icons, and controls are real DOM/CSS/SVG. No reference screenshot was used as page content. Browser verification covered Chromium; Safari and Firefox were not available in this environment.
