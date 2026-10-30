# Rolodex Text

A self-contained text animation study for `community-superdesign-rolodex-text`. Built with native HTML, CSS, and JavaScript; the prompt specifies no framework, font, or external assets.

The inline “We deliver” example cycles through four words. The outgoing word rotates 90° backward on the X axis as the next word rises from below. Both words share a fixed left edge and text baseline. The container uses `preserve-3d`, perspective, and visible overflow. The surrounding layout adapts to desktop and mobile screens.

Pause/play, manual advance, and word selection are functional. Reduced-motion preferences pause automatic rotation and make manual changes immediate. Background tabs suspend the rotation timer. Controls support keyboard navigation and have accessible names.

## Build

Node 22 is available through the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
```

With Node installed locally, use `npm run build`. The build copies the three application files into `dist/`; there are no runtime or build dependencies. The npm lockfile is included.

## Preview

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 5173:5173 -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/serve.mjs
```

Open `http://localhost:5173/motionsites-results/community-superdesign-rolodex-text/`. All asset URLs are relative and work at the required publication subpath. `dist/` contains the complete static deliverable. This project has not been deployed.

## Browser verification

`scripts/check.cjs` uses the image's existing Playwright Core and Chromium. With the preview container running, execute it inside that container:

```sh
docker exec <preview-container-name> node scripts/check.cjs
```

The checks cover the required subpath, pause/play, manual advance, selection of every word, consistent text alignment, 3D transforms and visible overflow, outgoing-element cleanup, the details anchor, reduced motion, and failed requests or browser errors. Viewports: 1440×1000 and 390×844, with an additional 320×700 overflow check.

Evidence:

- `screenshots/desktop.png`: desktop, full page.
- `screenshots/mobile.png`: mobile, full page.
- `screenshots/transition.png`: animation in progress.
- `screenshots/checks.json`: machine-readable browser results.

## Assets and limits

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-rolodex-text.webp` does not exist. Visual comparison with it was therefore unavailable. The implementation follows PROMPT.md directly, with an original surrounding presentation. No assets were extracted or substituted. Typography uses the local Arial/Helvetica/system sans-serif stack; icons are CSS, text glyphs, and an inline SVG. No external assets or network fonts are requested.

Browser validation was performed in Chromium. Other browser engines and physical devices were not tested. Screenshots are full-page captures at the requested viewport sizes, so their image heights can exceed the viewport height.
