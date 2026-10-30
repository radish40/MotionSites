# Scroll Journey Line

An interactive, responsive scroll journey built for `community-superdesign-scroll-journey-line`. A lime SVG connector draws forward in direct proportion to document scroll and retracts when scrolling back. Four numbered milestones light up as the line reaches them.

The original prompt specifies the scroll-linked SVG behavior and does not mandate a framework, imagery, brand, or font. This implementation uses native HTML, CSS, and JavaScript, local Space Grotesk and Manrope fonts, and original CSS/SVG artwork. It includes journey navigation, a native explanatory dialog, a progress meter, and a restart button.

## Build and run

Requires Node 22, or the existing Docker image used for validation. No npm dependencies are needed. The lockfile is included.

```sh
npm ci
npm run build
npm start
```

In this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
docker run --rm -p 3000:3000 -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm start'
```

Open `http://localhost:3000/motionsites-results/community-superdesign-scroll-journey-line/`. Build output is `dist/`, including `dist/index.html`. All asset references are relative and work at the requested publication subpath. No deployment has been performed.

## Browser validation

The actual build was served at the publication subpath and checked using Playwright Core and Chromium from the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs & node scripts/check.cjs'
```

Validated desktop **1440 × 1000** and mobile **390 × 844**:

- Empty line at 0%, half progress at 50%, complete line at 100%, and all four milestones reached.
- Scroll reversal and restart return progress to 0%.
- Journey CTA, explanatory dialog, Escape dismissal, and dialog CTA work.
- No horizontal document overflow; headline text bounds fit the viewport.
- No uncaught JavaScript errors, failed asset requests, or HTTP error responses.
- Reduced-motion preference disables smooth scrolling. The SVG still reflects scroll directly, without time-based animation.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, plus midpoint and completion screenshots for each viewport. Machine-readable results: `screenshots/checks.json`. Initial and midpoint screenshots were visually reviewed; mobile title clipping was corrected and checks rerun.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-scroll-journey-line.webp` was absent. Therefore no comparison to that reference was possible and no reference imagery was extracted. The page is a new composition implementing the supplied text prompt with real DOM controls and live SVG geometry.

Font files were downloaded successfully from Google Fonts and are served locally, without runtime network dependencies. Sources: `fonts.googleapis.com` CSS for Space Grotesk and Manrope, with font binaries from `fonts.gstatic.com`. Their SIL Open Font License files are included in `assets/`. All other visuals are created in this project. Browser verification is limited to Chromium at the stated sizes; no Safari or Firefox checks were performed.
