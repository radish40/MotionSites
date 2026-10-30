# Duolingo Styleguide

Design ID: `duolingo-styleguide-hero`.

A responsive implementation of `PROMPT.md`, using semantic HTML, CSS, JavaScript, and Vite 6.4.5. Includes the fixed navigation, gradient hero, twelve-color palette, Feather Bold and Nunito typography, button specimens, light/dark cards, badges, email input, toggles, progress bars, tooltip, streak counter, language selection, and avatar group. Layout switches at 900px and 600px as specified.

## Build and run

The dependency lockfile is included. With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/duolingo-styleguide-hero/` on the preview server. `vite.config.js` sets this exact base path. Publishable static files are in `dist/`, including `dist/index.html` and all required local assets.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

This script temporarily serves the production build under the required subpath and runs the image's Chromium with `/app/node_modules/playwright-core`. It checks desktop 1440×1000 and mobile 390×844, eight panels, twelve swatches, loaded images and fonts, responsive navigation, horizontal overflow, section navigation clearance, button press styling, disabled buttons, toggle state, language selection, tooltip visibility, and email submission feedback. The server and browser close on completion.

Final checks passed with zero browser console errors, page errors, failed requests, or horizontal overflow. `npm ci` reported zero vulnerabilities. Both full-page screenshots were also visually reviewed:

- [Desktop screenshot](screenshots/desktop.png), captured at a 1440×1000 viewport.
- [Mobile screenshot](screenshots/mobile.png), captured at a 390×844 viewport.
- [Browser report](screenshots/browser-report.json).
- Full build and browser output: `verification.log`.

## Assets and recovery

All prompt assets are stored locally in `public/assets/` and copied to `dist/assets/`. There are no runtime third-party requests. The exact prompt logo, four flags, two course photos, and three avatar photos were downloaded from their supplied CloudFront and Pexels URLs. Nunito weights 400–900 were fetched from Google Fonts; Feather Bold was fetched from the specified OnlineWebFonts font family. Font source stylesheets are preserved.

The CDN returned the SVG source files with gzip encoding. These were decoded to normal SVGs without altering their artwork; the reproducible downloader now uses `curl --compressed`. Direct Python downloads initially stalled; curl successfully recovered all 21 source/font/image files. See `public/assets/download-report.json` and `scripts/fetch-assets.py`. Rerun the downloader with Python 3 and curl if assets need refreshing.

A local Noto Color Emoji font from Google Fonts renders the specified fire emoji on Chromium installations without system emoji fonts. Feather Bold source attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts). Nunito and Noto Color Emoji are supplied by Google Fonts. Original artwork and photography remain attributable to their respective providers.

## Scope and limitations

The optional design reference WebP was absent at the specified location. Visual validation follows the complete written prompt; no reference screenshot or extracted artwork was used. All page text, controls, layout, and animation are real DOM/CSS.

This is a style guide. Hero, button, and course action specimens demonstrate hover, focus, and press states; they do not create accounts, delete data, or open course workflows. The subscription form validates email and shows local demo feedback without sending or storing it. Sound effects and Animations switches demonstrate their own state. Progress bars show the specified values. Reduced-motion preferences suppress transitions and smooth scrolling. No deployment or push was performed. `ready` means available for management-session acceptance.
