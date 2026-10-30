# Stark Minimal Footer

Design ID: `stark-minimal-footer`. A standalone EngineTech aerospace footer built with semantic HTML and CSS. Includes the three-layer animated dot strip, responsive navigation, CSS brand mark, large Geist wordmark and legal links. Source requirements are preserved in `TASK.md` and `PROMPT.md`.

## Build and preview

Requires Node 22/npm (or the available Docker image). Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/stark-minimal-footer/`.

Equivalent build in this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The static deliverable is `dist/`, including `dist/index.html`. All stylesheet and font URLs are relative, supporting the specified publication path. No deployment or push was performed. `node_modules/` is excluded from deliverables.

## Assets

Geist Variable 5.2.8 is obtained through `@fontsource-variable/geist`, pinned in the lockfile and bundled into `dist/assets/` with its SIL Open Font License. The production page has no external asset requests. Dots and brand artwork are CSS, as specified. No raster assets are required or generated.

Only this design's reference, `/home/opc/motionsites/assets/previews/stark-minimal-footer.webp`, was inspected. It is not embedded in the page and no material was extracted from it. Explicit prompt colors and geometry take precedence over differences in the reference.

## Validation

A real npm production build passed in Docker using Node 22.22.3/npm 10.9.8. Chromium was driven with the image's existing `playwright-core`. Reproduce browser validation after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs > /work/screenshots/server.log 2>&1 & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/check.cjs'
```

Verified at 1440×1000, 390×844, 768×1024, 320×740 and 981×1000:

- Correct four-, two- and single-column responsive layouts and local Geist loading.
- No horizontal document overflow or text clipping.
- All 11 fragment links update their specified URL hashes.
- Hover shifts navigation by 3px; keyboard focus is visible.
- Social links retain their exact external URLs, new-tab targets and noreferrer attributes.
- Home link retains the specified `/` destination.
- Dots actually move; reduced-motion preference disables animation.
- No browser console/script errors or failed resource requests.

Screenshots: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×844). Detailed measured results: `screenshots/checks.json`. Both screenshots were visually inspected.

## Scope and limitations

The prompt specifies fragment destinations for a footer component; full company, privacy and terms pages are not part of this design. Those links preserve their requested destinations without inventing page content. Social destinations were checked structurally, without navigating third-party websites. The root home link is intentionally `/`, per the prompt, and requires the surrounding site's homepage when integrated.

One responsive adjustment prevents the requested mobile type size from clipping the final letters: at widths up to 560px the wordmark uses `scaleX(0.8)` with a left origin, preserving the exact specified font-size clamp. Reduced-motion handling and visible keyboard focus are also included. The page otherwise uses the specified dimensions, text, links and styles. Browser validation covers Chromium; other rendering engines were not available.
