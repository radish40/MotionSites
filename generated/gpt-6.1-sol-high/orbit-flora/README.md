# Orbit Flora

Design ID: `orbit-flora`. A full-viewport, single-file HTML/CSS/JavaScript poster titled **Orbit — Secure system**. No framework, no scrolling, no deployment.

`index.html` contains the layout, embedded TrueType fonts, entrance animation, canvas-generated organic reveal masks, and responsive accessible navigation. The two exact Higgsfield URLs from PROMPT.md are the primary image sources. Unmodified local downloads provide an error fallback. The preview was inspected only as a visual reference; no screenshot is used in the page.

## Build and run

The project has no npm dependencies. With Node 22, run `npm ci && npm run build`. On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Publishable files are in `dist/`, with relative asset paths suitable for `/motionsites-results/orbit-flora/`. Serve that directory with any static HTTP server. No Vite is needed for this native HTML implementation.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check script serves the real build under the specified subpath and uses the image's existing Playwright and Chromium. It checks desktop 1440×1000, mobile 390×844, image/font loading, animation completion, no page overflow, both canvas masks, trail decay, desktop fragment navigation, mobile focus trapping, Escape/link/scrim dismissal, reduced motion, and JavaScript errors. Results are saved in `screenshots/checks.json`.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-reveal.png`, and `screenshots/mobile-menu.png`.

## Asset provenance and limits

Both supplied lily URLs returned HTTP 200 and their transparent images are used unchanged. `assets/front.webp` and `assets/reveal.webp` were downloaded from those exact URLs, for fallback only. No image extraction or recreation was needed.

The supplied project initially contained only TASK.md and PROMPT.md. No original index.html or original base64 font blocks were available. Consequently the original custom font binaries could not be recovered. The embedded faces named “Orbit Sans” and “Orbit Display” use Arimo (weight 400) and Tinos Regular, respectively, from the Google Fonts repository. These compatible TTF substitutes approximate the reference; exact original typography remains unverified. Sources:

- https://github.com/google/fonts/blob/main/ofl/arimo/Arimo%5Bwght%5D.ttf
- https://github.com/google/fonts/blob/main/ofl/tinos/Tinos-Regular.ttf

Font licenses accompany the assets and distribution. The original font family names in the brief are CSS aliases here, not claims that these are the original fonts.

The explicit entrance timings, desktop coordinates, optical transforms, copy, colors, and trail constants follow PROMPT.md. Portrait placement and menu styling fill in details unspecified by that prompt. Navigation retains the requested fragment links within the single poster; no additional pages are invented. Reduced motion uses the specified short whole-stage fade and suppresses the mouse trail. Chromium validation does not establish identical behavior in every browser.
