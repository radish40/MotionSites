# Jewelry Store

Design ID: `jewelry-store`. Page brand and browser title: **Blue Nile**.

This project implements the complete native HTML, CSS, and JavaScript supplied in `PROMPT.md`: orange hero, grid lines, oversized desktop heading, model portrait, exclusive image, awards, product card, responsive mobile layout, entrance animations, hover effects, and sliding mobile menu. No framework or additional product features were introduced.

The source is `index.html`. `assets/` contains the original supplied images and local copies of both specified fonts. The mobile menu's original `display:none` rule is corrected at the mobile breakpoint. Menu state also includes accessible expanded/hidden attributes, inert closed content, Escape dismissal, and protection against animation timer races. Dynamic viewport height supports mobile browser chrome.

## Build

No host Node installation is required:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --package-lock-only && npm run build'
```

With Node 22 available, run `npm run build`. There are no npm dependencies. The lockfile is included. The build copies the full native site into `dist/`, including `dist/index.html`. All runtime asset references are relative and support the required `/motionsites-results/jewelry-store/` path. No deployment was performed.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check script uses the container's existing Playwright Core and Chromium, starts a temporary local server at the exact publication subpath, and closes it when finished.

Verified at **1440×1000** and **390×844**:

- All images decoded and both specified fonts loaded locally.
- No horizontal or vertical document overflow; product cards fit within each viewport.
- No browser console errors, uncaught script exceptions, failed requests, or HTTP error responses.
- Mobile menu opens; toggle, Escape, backdrop, and menu item selection close it.
- Desktop CTA hover behavior is present.

Screenshots were captured after entrance animations and visually inspected: `screenshots/desktop.png`, `screenshots/mobile.png`; the open menu is recorded in `screenshots/mobile-menu.png`. Machine-readable evidence is in `screenshots/checks.json`.

## Assets and limitations

All requested asset endpoints were accessible. Runtime rendering requires no external requests. The unmodified downloaded font stylesheets are retained as `assets/founders.css` and `assets/nimbus.css` for source provenance; the page uses `assets/fonts.css` and local WOFF2 files.

Fonts supplied by [OnlineWebFonts](https://www.onlinewebfonts.com/fonts): Test Founders Grotesk Light and NimbusSanExt. Their source stylesheets state CC BY 4.0 and request attribution. Images are the exact three PNGs referenced by the prompt, downloaded from `soft-zoom-63098134.figma.site/_assets/v11/`.

The original design contains placeholder navigation links (`href="#"`) and decorative collection/product controls. These retain the supplied behavior; search, checkout, accounts, and product detail pages are outside this design. Ready means available for management-session acceptance, not published.
