# Autonomous Ops

Design ID: `autonomous-ops`. Page title: **Falcon AI Operations Overview**.

A single self-contained `index.html` recreates the Falcon AI benefits triptych: a visibility timeline, the Falcon AI workflow prompt, and converging decision ribbons. It uses inline CSS and JavaScript, the requested system font stacks, CSS container query units, two DPR-aware canvases, and a center-first Web Animations entrance. There are no frameworks, runtime dependencies, external fonts, stylesheets, scripts, or image requests.

## Build and run

With Node installed:

```sh
npm install --package-lock-only --ignore-scripts
npm run build
```

In this host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install --package-lock-only --ignore-scripts && npm run build'
```

The build copies the complete page to `dist/index.html`. Open that file directly or serve it at `/motionsites-results/autonomous-ops/`. All application resources are inline, so the page works at this subpath without URL rewriting inside the HTML. There is no Vite or framework configuration because the prompt explicitly requires native HTML.

## Verification

The reproducible browser check starts a temporary local HTTP server at the requested subpath, runs the built page using the image's Chromium and Playwright, and shuts down the server and browser:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/check.cjs
```

Verified in real Chromium:

- Desktop 1440 × 1000: three centered cards; center card entrance delay 60 ms, side delays 245/330 ms.
- Mobile 390 × 844: one scrollable column; all three cards and the Automate visual are reachable.
- Tablet 768 × 1024: two cards above a centered third card.
- Short desktop 1440 × 500: composition scales to fit, with all cards inside the viewport.
- Both canvases have painted pixels; all 24 timeline bars are present.
- No JavaScript errors, console errors, horizontal page overflow, prompt overflow, or heading overflow at the checked sizes. The document is the only network request.
- Reduced motion, missing Web Animations, and simulated animation exceptions leave all cards visible. With JavaScript disabled, text and CSS visuals remain visible; canvas graphics require JavaScript.

Screenshots: `screenshots/desktop.png` (1440 × 1000), `screenshots/mobile.png` (390 × 844), and `screenshots/mobile-full.png` (all three mobile cards). Structured browser measurements are saved in `screenshots/checks.json`. Screenshots were visually inspected after rendering.

## Assets and limits

The supplied `/home/opc/motionsites/assets/previews/autonomous-ops.webp` was inspected only as this design's visual reference. It is not embedded or copied into the page. Charts, icons, and the decorative cursor are rebuilt with DOM/CSS/canvas; no assets were extracted, downloaded, or replaced.

The exact font stacks from PROMPT.md are retained. The Linux Chromium image does not include Segoe UI or Arial and resolves to available system fonts (fontconfig reports Noto Sans for Arial). Font shapes and spacing can therefore differ from the reference and other operating systems. Workflow text preserves the three explicit authored lines. The prompt describes responsive type clamps without numerical values; those values were chosen to preserve the same composition at smaller widths.

The Automate pill, corner glyphs, and cursor are presentation elements, as specified by the supplied DOM and choreography. No click action, editable prompt, or backend workflow was requested or added. The checks cover presentation, entrance behavior, resize layouts, mobile scrolling, and fallback behavior; no real automation service is connected.

Validated in Chromium only. Modern CSS container units, independent transforms, and CSS calculation support are required. No deployment or push was performed. `ready` means available for management-session acceptance, not published.
