# Growth Decisions

Design ID: `growth-decisions`. Page title: **Meridian — Revenue Intelligence for SaaS**.

A single full-viewport hero built with the required `index.html`, `styles.css`, and `main.js`, without frameworks or runtime dependencies. Includes the exact CloudFront video, Google Fonts Inter, inline SVG logo/arrows, staggered entrances, two-pass blue headline paint, button and link hover treatments, reduced-motion styling, and accessible mobile menu controls. All corners are square.

## Build

From this directory, with Node 22:

```sh
npm ci
npm run build
```

The available Docker image was used for the actual build:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`dist/` contains the complete publishable static site. Serve it at `/motionsites-results/growth-decisions/`. Styles and script use relative URLs, so they resolve beneath that path. The native HTML stack does not need Vite. `package-lock.json` is included; there are no npm dependencies or committed `node_modules`.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check'
```

`checks/browser.cjs` starts an ephemeral HTTP server serving the built files at the required subpath, then uses the image's Playwright Core and Chromium. It closes the browser and server when finished. The completed run used Chromium 148.0.7778.178.

Verified:

- Desktop 1440×1000: no scrolling; loaded Inter; decoded, playing video.
- Mobile 390×844: no horizontal overflow; desktop navigation hidden; burger visible.
- Short desktop 1440×650: no scroll or overlap between hero and lede.
- Navigation hover color and demo button icon inversion.
- Menu toggle, open/closed labels and expanded state, Escape, closing through each of the five links, and retention of three burger bars.
- Reduced motion disables entrance animations and renders the accent solid blue.
- No JavaScript errors, console errors, or failed non-cancelled asset requests.

Screenshots were captured from the real built site and visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png` (additional open-menu check)

Machine-readable browser evidence is in `checks/browser-results.json`.

## Assets, decisions, and limits

The specified Google Fonts stylesheet and font returned HTTP 200. The original CloudFront MP4 returned HTTP 206 range responses and played successfully at 1920px source width. Chromium cancelled one media request with `net::ERR_ABORTED` during the final run while subsequent range requests succeeded and decoded playback continued. This is preserved separately in the browser report rather than treated as an unavailable asset. No asset recovery, extraction, replacement, poster, or additional image was needed.

Only this design's reference was inspected: `/home/opc/motionsites/assets/previews/growth-decisions.webp`. The written prompt takes precedence over differences in the preview, including the white hero Book Demo button and specified dimensions. At widths up to 820px, the second headline line wraps and its accent stays together, so the required type size fits the phone viewport. Desktop retains the specified unbroken second line.

All links retain the specified `href="#"`; no demo destination, modal, or extra page was added. Reduced motion affects CSS animations as specified; the required background video remains autoplaying. External video and fonts require network availability. Validation was performed in Chromium, not Safari or Firefox. Screenshots are individual moments of the looping video, so its frame can vary between captures.

Status `ready` means ready for management-session review. No deployment, push, other session, or messaging was performed.
