# Subscription Agency

Alwayzz landing page implemented from this project's PROMPT.md. Project ID: `subscription-agency`.

React + Vite + Tailwind CSS are configured. All authored styling uses custom CSS without Tailwind utilities. The production base is `/motionsites-results/subscription-agency/`; deliverable static files are in `dist/`.

## Build and run

With Node 22: `npm ci`, then `npm run dev`, `npm run build`, or `npm run preview`. Visit the server at `/motionsites-results/subscription-agency/`.

On this host, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The build was executed successfully. The lockfile is included; node_modules is excluded from delivery. No deployment or push was performed.

## Design and behavior

Fixed navbar, full-screen fading menu, original hero image, 20 animated curves per side, 20 mobile top curves, four-copy service and partner marquees, serif title, original avatar, responsive CTAs, and bottom gradient. The mobile background rotates 90 degrees. Menu keyboard cycling, Escape dismissal, focus restoration, scroll locking, and reduced-motion support are implemented. Marquees pause on hover.

Google Fonts load in index.html with the requested preconnects and Inter 400/500/600/700, Source Serif 4 normal and italic 400/600, plus Cedarville Cursive for Airbnb.

## Assets

The exact hero and avatar URLs in PROMPT.md downloaded successfully and are bundled as `public/assets/hero.webp` and `public/assets/avatar.png`. The hero is also emitted as a Vite hashed asset. No substitute screenshot is used as the page. Both images, the Google Fonts stylesheet, and font files loaded successfully in Chromium.

Google Fonts remain external, with fallback font families. Cedarville Cursive supplies only weight 400; the requested Airbnb CSS weight remains 700 using the available face.

## Browser verification

A temporary Docker HTTP server served the actual production dist at the required subpath. Reproduce checks after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  scripts/browser-check.cjs
```

- Chromium desktop: 1440 × 1000; mobile: 390 × 844.
- Additional overflow checks at widths 320, 810, 1199, and 1200.
- No JavaScript errors, failed requests, HTTP errors, or horizontal overflow.
- Menu initial focus, keyboard cycling, Escape, and all five navigation links passed.
- Both CTA dialogs and dismissal passed; reduced-motion check passed.
- Avatar loaded, fonts loaded, and mobile buttons stack vertically.
- Full-page screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/menu.png`.
- Machine-readable evidence: `screenshots/checks.json`.

Desktop content is slightly taller than the 850px minimum because the specified title geometry wraps to four lines. The mobile hero is 760px high. Screenshots include the entire page at the required viewport widths.

## Limitations

The prompt supplies no projects, pricing, team details, FAQs, booking URL, or contact destination. Navigation and CTAs open concise availability dialogs. No plans, prices, bookings, or external destinations are invented. Real destinations can be connected when supplied. Ready means ready for review, not deployed.
