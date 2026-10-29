# AeroCore

Design ID: `aerocore`. The page uses the EngineTech brand and title specified by `PROMPT.md`.

Native HTML, CSS and JavaScript, including the original custom-element hero, animated gradient and stars, fixed navigation, mission section, expanding video showcase, capabilities grid, animated statistics, horizontally scrolling story previews, and footer. No framework or runtime dependencies. Original copy, colors, sizing, video sources, icons, and responsive breakpoints are retained.

## Build and preview

The host has no Node installation. Run from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and `dist/assets/` contain the static build. Serve them at `/motionsites-results/aerocore/`. Asset URLs are relative and home links use that exact prefix. No Vite is used because the prompt is a native HTML document.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview'
```

Open `http://localhost:4173/motionsites-results/aerocore/`.

## Validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The test uses the image's existing Playwright Core and Chromium. It opens the real static build at the publish prefix in 1440×1000 and 390×844 viewports, records script/console/network errors, confirms the reconstructed engine loads visibly, checks horizontal overflow at every section, clicks all four statistics categories, verifies their rows and values, checks all four scroll-driven showcase panels, tests a desktop showcase-tab click, scrolls the story rail, follows Get In Touch, checks home URLs, and verifies all nine video elements decode.

Evidence is saved in `screenshots/browser-report.json` and `screenshots/check-output.txt`. Required captures are `screenshots/desktop.png` and `screenshots/mobile.png`; additional captures show statistics, showcase, and stories. Screenshots were also visually reviewed.

## Assets and implementation details

The seven unique specified MP4s are downloaded unchanged and served locally. Geist variable Latin font and Phosphor 2.1.1 regular icons are bundled locally. Asset origins and download outcomes are in `assets/manifest.json`. `scripts/prepare-assets.py` downloads original media; `scripts/implement.py` derives the implementation from the supplied prompt and manifest. The build itself requires no network.

Small functional corrections retain the supplied design: home links respect the publish prefix, showcase expansion derives from document position so deep links work, showcase tabs are keyboard-focusable buttons with scroll navigation, and quick statistics changes cancel stale render timers.

## Engine repair and limits

**Status: ready for acceptance, with a documented reconstructed engine.** The supplied URL is:

`https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780405513/hero-engine_isebcf.png`

The original source still returns HTTP 401 with `cloud_name dsdhxhhqh is disabled`. Retrying without the version also returns 401; searches for the exact filename found no working copy. The scoped repair authorized reconstruction from this same design's recovered animated preview.

`assets/engine-reconstructed.png` is a genuine transparent local cutout reconstructed from that preview. It is **not the original PNG**. The 75-frame 640×472 animation was decoded; frames 0 and 17–33 were vertically registered using the engine's hardware. Clear regions across frames remove the overlaid title and cursor, retaining the metallic cutaway cylinder, turbine blades, central cone, and exposed pipes. A traced silhouette and edge color mask remove the page background. Only the isolated engine is rendered in the page; no reference screenshot or animation is embedded as the webpage.

The source engine region contains roughly 246×488 pixels of detail. The transparent PNG is 704×1056 including padding, upsampled with Lanczos. Preview compression, limited source detail, small alignment differences and manually traced edge accuracy remain visible at large sizes; this does not restore original-resolution detail. Original CSS engine dimensions, placement, layer order, parallax and fade animations are preserved. Both hero and video poster now use the local cutout; there are no remote image requests or hidden failed-image workarounds.

The repaired build was checked at both required sizes with **zero script errors, zero console errors and zero HTTP asset failures**, with the engine confirmed loaded and visible. All nine video elements decode. Chromium may cancel redundant video range requests with `net::ERR_ABORTED`; these are not failed media decodes. A data favicon avoids the browser's unspecified favicon probe.

Repair provenance is retained in `scripts/repair/original-preview.webp` and `scripts/repair/alignment.json`, outside `dist/`. The reconstruction scripts are `scripts/repair/decode-preview.cjs` and `scripts/repair/reconstruct-engine.py`; Python repair-only dependency versions are pinned in `scripts/repair/requirements.txt`. The normal build needs neither Python nor these packages. To regenerate, decode the preview using the supplied Docker image's Node/Chromium, then run the Python script in a local environment with those pinned packages installed. Generated frames and temporary package downloads were removed after repair.

The prompt includes links to `#investors`, `#news`, `#careers`, `#privacy`, and `#terms` but supplies no matching sections or content. These original links remain, and the check report lists them. No new sections or legal text were invented. The mobile hero's oversized clipped typography and hidden primary-navigation links follow the supplied CSS.

No deployment or push was performed. All project artifacts are contained here.
