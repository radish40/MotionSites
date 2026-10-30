# Task Engine

A single-file product feature mosaic built from this project's TASK.md, PROMPT.md, and its own visual reference. Page title: “Automate your work — Focus on what matters”. Project ID: `task-engine`.

`index.html` contains all HTML, CSS, JavaScript, and inline SVGs. No framework, icon library, image assets, runtime packages, or bundled dependencies. The only external resource is the exact Google Fonts stylesheet requested in PROMPT.md (Plus Jakarta Sans, weights 400–800).

The composition uses the specified rem-based design coordinates, five gradients, desktop grid, tablet remapping, mobile column, and one-shot entrance choreography. It respects reduced motion and removes animation classes after completion. Search supports keyboard focus, text editing, and native search clearing. The microphone and integration logos are illustrative; the prompt does not specify backend search, voice recognition, or external integration actions.

## Build

With Node installed:

```sh
npm ci
npm run build
```

In the supplied host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The build copies the complete standalone document into `dist/index.html`. Serve `dist/` at `/motionsites-results/task-engine/`. There are no root-relative local resources, so the document supports the required subpath without a framework or Vite.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

`checks.mjs` runs an ephemeral HTTP server inside that container, serves the actual built file at the required subpath, and uses the image's existing playwright-core and Chromium. It saves:

- `screenshots/desktop.png`: 1440 × 1000 viewport.
- `screenshots/mobile.png`: 390 × 844 viewport, full-page capture.
- `screenshots/tablet.png`: 820 × 1180 viewport.
- `screenshots/checks.json`: measured layouts, visibility, font status, request failures, page errors, search input checks, reduced-motion check, and entrance check.

All three viewports passed: five visible cards, no horizontal overflow, no JavaScript page errors, no failed resource requests, correct loaded font, editable search, and animation cleanup. Reduced motion has zero animations and immediately visible cards. The normal desktop entrance was observed running with 25 animations and subsequently detached. Screenshots were visually reviewed against the project's reference.

## Assets and validation limits

The reference `/home/opc/motionsites/assets/previews/task-engine.webp` was viewed only for comparison. No screenshot, crop, or extracted bitmap is embedded in the page. Everything is live DOM/CSS or inline SVG. The prompt describes brand icons but does not supply original SVG source path data; icons were reconstructed inline using the specified brand colors and recognizable geometry. Small differences from the reference's precise brand path geometry may remain, particularly Teams and Notion. No unavailable raster assets required recovery.

Google Fonts loaded successfully during validation; an offline environment uses the required system fallback stack. Browser validation covers Chromium, not Safari/Firefox, and visual review does not constitute an automated pixel-difference guarantee. Mobile/tablet details not numerically specified in the prompt (such as the stacked search panel height) use restrained values consistent with the supplied composition.

`ready` means the local build and artifacts are available for acceptance. Nothing has been deployed or pushed.
