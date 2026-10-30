# Quantum Lucid

Design ID: `quantum-lucid`. A standalone Quantum² landing page built from this project's `TASK.md` and `PROMPT.md`. The deployable page is a single `dist/index.html` with inline CSS, JavaScript, SVG avatars/icons, and an embedded variable font. No framework, dependencies, or additional runtime files are required beyond the specified external media.

The page implements the authored type tokens, absolute desktop stage and fit calculation, compact CSS Grid composition, fixed proportional product card, independent-translate entrance sequence, and accessible mobile navigation. Product tabs are visual only. Links retain `href="#"` because no destinations were supplied.

## Build

With Node available:

```sh
npm install --package-lock-only --ignore-scripts
npm run build
```

The actual build and browser checks used the existing local Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run build && npm run check'
```

`build.cjs` copies the standalone source to `dist/index.html`. Serve `dist/` at `/motionsites-results/quantum-lucid/`; there are no root-relative local asset references. The browser checker serves that exact nested path temporarily inside Docker. Nothing has been deployed or pushed.

## Validation

Real headless Chromium checks passed at 1440×1000, 1290×860, 390×844, 768×1024, 320×568, and 844×390. Desktop and portrait pages have no document overflow. Landscape phones scroll as specified and contain the full card within the band. Card clipping at the portrait viewport bottom is intentional.

Verified video decoding and autoplay (2212×936, readyState 4, time advancing), loaded Figtree FontFace, completed entrance sequence, mobile menu toggle, Escape and focus return, outside dismissal, menu-link dismissal, desktop resize closure, CTA anchors, reduced-motion display, and JavaScript-disabled grid/menu behavior. No JavaScript errors occurred. Detailed measured geometry, video state, font status, and failed requests are saved in `screenshots/browser-checks.json`.

Screenshots were visually inspected:

- `screenshots/desktop.png` — 1440×1000
- `screenshots/mobile.png` — 390×844
- `screenshots/mobile-menu.png` — expanded mobile navigation

## Asset recovery and limits

The exact specified CloudFront video and poster URLs remain in the markup and returned HTTP 200. Video is live, autoplaying, muted, looping, and inline. They require network access. Screenshots capture a moment in the moving video; the frame naturally differs from the supplied preview.

The exact required Google Fonts stylesheet URL (`Figtree:wght@100..900&display=block`) returns an HTTP 400 HTML error: Figtree's published native weight range is **300–900**. Chromium reports that stylesheet as `net::ERR_BLOCKED_BY_ORB`. The required link is retained, and the genuine Google Fonts Figtree variable Latin WOFF2 is also embedded directly in the HTML so typography renders reliably. Its CSS FontFace declares 100–900 as requested; all actual authored instances (388–783) lie within its real variable range, with no synthetic bold. `font-display:block` is preserved.

Recovery source: `https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=block` requested with a modern Chromium user agent; binary: `https://fonts.gstatic.com/s/figtree/v9/_Xms-HUzqDCFdgfMm4S9DQ.woff2`. The response stylesheet, font, license, and repeatable embedding script are in `recovery/`. Run `python3 recovery/embed-font.py` after replacing that font, then rebuild. No visual assets were extracted from the reference. Only the authorized Quantum Lucid preview was inspected.

Validation used Chromium, not Safari or Firefox. The page preserves the exact supplied geometry and strings; no automated pixel-difference claim is made. `ready` in `result.json` means ready for management-session review, not published.
