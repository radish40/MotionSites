# Vision Reveal

Design ID: `vision-reveal`. A faithful implementation of the supplied Creative Studio Showcase in `PROMPT.md`, using native HTML, CSS, and JavaScript. No framework or runtime dependencies.

The page preserves the supplied imagery, Inter font weights, colors, responsive composition, split blue splash, staggered headline, image entrance, oversized “Visuals” typography, pill hover treatments, and expanding navigation panel. The reveal uses the original 260px gradient and pointer easing with a CSS mask instead of generating a canvas PNG every frame. Touch input positions the spotlight on mobile. Menu state includes accessible labels, inert closed content, Escape dismissal, and outside dismissal.

## Build and run

With Node 22:

```sh
npm ci
npm run check
npm run build
```

In the supplied environment:

```sh
docker run --rm -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run check && npm run build'
```

The complete static output is in `dist/`, including `dist/index.html`. Mount that directory at `/motionsites-results/vision-reveal/`. All resources and the Home link are relative, so they work at the required subpath. No Vite configuration is needed for this native HTML implementation.

## Browser verification

```sh
docker run --rm -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script starts a temporary HTTP server inside the container at the actual publication subpath and uses the image's Playwright and Chromium. It checks desktop 1440×1000 and mobile 390×844, image/font requests, headline, entrance completion, horizontal overflow, spotlight pixel changes, menu open/close, nav dismissal, Escape, desktop CTA hover, and reduced motion. It saves results to `screenshots/checks.json` and captures `screenshots/desktop.png`, `screenshots/mobile.png`, plus reveal/menu states. The server and browser close after checking.

## Assets and scope

The exact supplied base image, reveal image, and logo were successfully downloaded from the URLs in `PROMPT.md`. Inter weights 300–700 were downloaded from Google Fonts. They are bundled in `assets/` and copied to `dist/assets/`; the page makes no external asset requests.

The supplied design has no Work, About, or Blog sections, no social profile destinations, and no click action on either CTA. Those original placeholder links and presentational buttons are preserved; the provided email link uses `mailto:studio@norakessler.com`. No additional pages, form, or services were invented. Mobile crops the oversized bottom typography as prescribed by the original CSS. No deployment or push was performed.
