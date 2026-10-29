# Luxury Hero

Design ID: `luxury-hero`. Page brand: **Horizon Estates**.

A React + TypeScript + Vite + Tailwind CSS implementation of `PROMPT.md`, using lucide-react. The page contains only the fixed navigation and pinned video hero. It preserves the specified responsive spacing, supplied logo SVG, copy, fonts, two original video URLs, entrance animations, 700ms scroll crossfade, and staggered mobile navigation.

## Build and run

With Node.js 22:

```bash
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173/motionsites-results/luxury-hero/`. Vite's base is configured for this exact publication path. `dist/` contains the production build; `package-lock.json` locks dependencies. Dependencies in `node_modules/` are ignored and are not delivery artifacts.

On the supplied host without Node/npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible browser check serves `dist/` under the required subpath and uses the provided Docker image's Chromium and playwright-core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

Checks cover desktop 1440×1000, mobile 390×844, horizontal overflow, exact navbar padding and desktop link gap, loaded fonts, video readiness and autoplay, scroll crossfade, pause when returning to top, menu scroll locking, Escape, menu-link navigation, closing on desktop resize, and browser script errors.

Evidence is saved in `screenshots/browser-checks.json`, `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-scrolled.png`, and `screenshots/mobile-menu.png`. The primary screenshots pause the first video at two seconds to make the captured composition repeatable; the actual page autoplays normally.

## Scope and external assets

The prompt specifies no additional sections, inquiry form, or destination URLs. Navigation links target the corresponding existing elements within the hero. The otherwise unspecified CTA label is “Explore Estates.” No extra page sections or backend services were added.

The two videos remain hosted at the exact CloudFront URLs provided in the prompt. The required font stylesheets are loaded in `index.html` from OnlineWebFonts and Google Fonts. These external services require network access. Fonts and videos were checked in the browser; see the recorded request results for this run.

Magical Source Demo font source/credit: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), whose supplied stylesheet identifies CC BY 4.0 attribution. The font and video references are supplied by the task.

`ready` in `result.json` means the static build is available for review. No deployment or push was performed.
