# "Exploded View" Assembly

An original MONO modular audio system page, implementing the full prompt in `PROMPT.md`: a central product stays pinned while scrolling, its real interface components separate in different directions, then reunite in a different, wider configuration.

Project ID: `community-superdesign-exploded-view-assembly`.

Built with vanilla JavaScript, CSS, inline SVG, and Vite 6.4.5. The prompt specifies no framework or asset library. The product, circuit board, knobs, pads, diagrams, shadows, and animations are created from DOM/CSS/SVG; no page screenshot or reference video is used as page content.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The host used for this project has no Node/npm. The actual production build was completed using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Static output is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/community-superdesign-exploded-view-assembly/`. Serve the contents of `dist/` at that URL prefix. No deployment has been performed. `package-lock.json` preserves dependencies; `node_modules/` is excluded from the deliverable.

## Interaction

- Scroll through the pinned whole → elements → new layout sequence; scrolling backward reverses it.
- Chapter buttons and “Explore the system” navigate directly within the assembly.
- Four pads change the preset and waveform; knobs change texture, waveform scale, or display hue.
- Power switches the visual engine off and disables the pads until restored.
- Mobile navigation, feature anchors, details accordions, replay, and back-to-top links work.
- Keyboard focus styles, button labels and state, semantic landmarks, and reduced-motion support are included. Reduced motion switches between assembly states without interpolating the components.

## Assets and provenance

The design-specific preview file mentioned in TASK.md was absent at the provided location. The written prompt was used as the complete design brief. No other design or preview was read.

Fonts are DM Sans and Space Grotesk, downloaded from Google's font service and served locally. The original response with download URLs is retained in `font-source.css`; SIL Open Font License files are included in `public/fonts/` and `dist/fonts/`. Initial font retrieval stalled; direct curl downloads recovered all six font files. The completed site has no external runtime asset dependency.

## Validation

A real production build completed successfully. Chromium was driven through the image's installed `playwright-core` against a temporary local HTTP server serving the actual production build at its required subpath.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The browser check starts and closes its own HTTP server and browser. Its report is `screenshots/browser-checks.json`.

All 13 checks passed: desktop 1440×1000 and mobile 390×844 overflow checks, local fonts, preset selection, texture dial, power, exploded chapter, wider final layout, details accordion, replay, mobile navigation, mobile component containment, and reduced-motion loading. No browser script errors or HTTP asset failures were recorded. npm audit reported zero vulnerabilities.

Required screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`

Additional screenshots document exploded and reassembled states on both viewports, desktop possibilities and details, and mobile possibilities. Screenshots were visually reviewed; mobile clipping and overlapping desktop labels found in the first pass were corrected before final capture.

## Limits

MONO is a fictional product created for this assembly demonstration. Controls manipulate the visual mockup; there is no audio synthesis, hardware integration, checkout, or backend. Visual verification covers Chromium at the two requested viewports, not physical devices or every browser. With no supplied preview, an exact reference-image comparison was unavailable. `ready` indicates a built, locally verified handoff for review, not a live publication.
