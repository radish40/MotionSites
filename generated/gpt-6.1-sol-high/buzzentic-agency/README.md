# Buzzentic Agency

A full-screen React hero built with Tailwind CSS v4, Vite, Barlow, and italic Instrument Serif. Project ID: `buzzentic-agency`.

The supplied video fills the background using `object-fit: cover`, autoplay, loop, muted audio, and inline playback. There are no video overlays or filters. The design includes transparent navigation, a two-layer glass Fortune badge, the exact two-part headline, white corner squares, and off-white 2px-radius buttons. The hero retains 250px bottom padding at both checked sizes. Mobile typography wraps to fit the screen.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base is `/motionsites-results/buzzentic-agency/`. The complete static deliverable is in `dist/`, including `dist/index.html` and all media/font files. Serve it at that base path.

This environment has no host Node installation. The build was performed with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` is included; `node_modules/` is ignored and is not a deliverable.

## Validation

Real production build: passed. Chromium via Playwright checked the production site at the required base path with desktop 1440×1000 and mobile 390×844 viewports. Both fit their viewport without horizontal or vertical overflow. Tests verified loaded fonts, video playback and attributes, no video filter, 250px bottom padding, four 7×7px corners, dialog open/close, Escape, mobile navigation, CTA hover color, and project brief download. No page script errors or HTTP error responses were observed.

Reproduce the browser checks using the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm run build && node scripts/browser-check.cjs'
```

The check starts and closes its own HTTP server inside the temporary container. Evidence:

- `screenshots/desktop.png` — 1440×1000.
- `screenshots/mobile.png` — 390×844.
- `screenshots/browser-checks.json` — browser measurements and results.

Screenshots pause the actual video at two seconds for consistent comparison, after verifying live autoplay. The delivered page plays normally.

## Assets and provenance

- Original video downloaded intact from the exact CloudFront URL in `PROMPT.md`; served locally as `public/assets/hero.mp4` (4,806,985 bytes). SHA-256: `62f3ad24112e0b6dca74750a21f0dca216c59faff62f0303fadefb39b2ec784d`.
- Barlow 300/400/500/600 and Instrument Serif italic downloaded from Google Fonts and served locally. `fonts-source.css` records the original font URLs; `public/assets/fonts.css` uses local relative URLs. No external requests are needed at runtime.
- The designated `buzzentic-agency.webp` reference was visually inspected. It depicts the background; no screenshot or extracted image is used as page content. Text, layout, badge, and controls are real DOM/CSS. The small favicon is an original SVG.
- No asset substitutions or recovery approximations were necessary.

## Interaction and content limits

Navigation opens local informational dialogs; the mobile menu collapses after selection. The contact dialog downloads a project brief locally and explicitly states that no information is sent. No contact address, backend, booking URL, or Fortune article URL was provided. The requested Fortune badge is reproduced as supplied; its press claim was not independently verified, and it does not link to an invented article. Supporting agency copy and navigation labels were authored because the brief supplied no exact wording for them.

Validation used headless Chromium; Safari/iOS hardware and other browser engines were not tested. Autoplay may depend on individual browser settings. There was no deployment, push, external messaging, or work on any other design.
