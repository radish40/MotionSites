# Liquid Glass Agency

Single-page Studio agency landing page, built from this project's `PROMPT.md`. Project ID: `liquid-glass-agency`.

## Stack and implementation

React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui-style accessible Button and Dialog components built on Radix UI, Motion, Lucide, and hls.js. Both liquid-glass CSS variants use the specified gradient border masks and backdrop blur. The page includes all nine requested sections, word-by-word heading animation, fixed navigation, mobile menu, video film player, feature details, pricing information, and footer dialogs.

The publication base is `/motionsites-results/liquid-glass-agency/`. All built files are in `dist/`, including `dist/index.html`; assets use this base path. This project has not been deployed or pushed.

## Run and build

With Node 22 installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the development or preview server at `/motionsites-results/liquid-glass-agency/`.

On this host, Node and npm run inside the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`package-lock.json` preserves the dependency resolution. `node_modules/` is excluded from version control.

## Assets

- The exact CloudFront hero video and all three exact Mux HLS URLs from the prompt are used. The hero has a local video fallback and a real JPEG poster extracted from that supplied video.
- Google Fonts imports Instrument Serif italic and Barlow 300/400/500/600. Local font files are included to keep typography available independently of Google Fonts requests.
- The prompt did not provide a logo or the feature GIF source. An original SVG logo and an original 20-frame chrome-sculpture GIF are included in `public/images/`. The GIF is shown inside an illustrative website canvas; the second feature preview uses a native SVG chart.
- `scripts/assets.cjs` regenerates the poster and GIF using Chromium. The source video must already exist at `public/images/hero.mp4`.

## Browser verification

A temporary Docker HTTP server served the actual production `dist/` at its configured subpath. Chromium/Playwright checks cover desktop **1440 × 1000** and mobile **390 × 844**:

- All section content, image loading, font loading, video readiness, script errors, and horizontal overflow.
- Desktop calls to action, mobile navigation, film controls, feature dialogs, pricing dialog, Privacy and Terms, dialog dismissal, and a valid form producing a local project-brief download.
- Native HLS playback, forced hls.js fallback, and reduced-motion autoplay behavior.

Evidence is saved in `screenshots/desktop.png`, `screenshots/mobile.png`, the corresponding `*-full.png` files, `screenshots/browser-report.json`, and `screenshots/fallback-report.json`.

To repeat the browser checks inside the supplied image, start the project-only server and then run the checks:

```sh
docker run -d --rm --name liquid-glass-check -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs'
docker exec liquid-glass-check node scripts/check.cjs
docker exec liquid-glass-check node scripts/fallback-check.cjs
docker stop liquid-glass-check
```

The server is internal to the temporary container and does not publish host ports.

## Limits

The prompt supplies no booking endpoint, contact address, calendar, or actual pricing. Calls to action therefore open a clearly labeled demo that prepares a local downloadable brief; it does not send personal data or schedule a call. Pricing explains that scope is required and does not invent rates. The supplied short testimonial quotations are preserved without inventing missing text. Metrics, names, testimonials, and example work follow the design brief and are demonstration content.

HLS videos require network access to Mux. Google Fonts is also requested as specified, with bundled fonts available locally. Animated backgrounds stop autoplay when reduced motion is requested; the hero retains its poster. Browser verification uses Chromium, including a mobile viewport, rather than physical iOS hardware.
