# Feedback Slider

A single “What builders say” section built from `PROMPT.md` using React, TypeScript, Tailwind CSS, Vite, and lucide-react. Includes the exact five testimonials and Pexels avatar URLs, responsive cards, tripled track, 3-second auto advance, hover pause/resume, previous/next wrapping, exit effects, and staggered in-view entrance animation.

The production base path is `/motionsites-results/feedback-slider/`. Static delivery files are in `dist/`, including `dist/index.html`. This project has not been deployed or pushed.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open the base path shown above on the Vite server. To build using the available Docker image from this project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` pins dependencies. `node_modules/` is excluded from source delivery.

## Verification

A real TypeScript check and Vite production build passed. Browser verification uses Chromium and the image's existing playwright-core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check:browser'
```

The script serves the production build temporarily, then closes the browser and server. Both 1440×1000 and 390×844 passed:

- Correct heading, 15 rendered cards, and 427.5px / 342px card widths.
- Next/previous, wrapping in both directions, keyboard activation.
- Hover pause and automatic advance/resume after 3000ms.
- No page-level horizontal overflow or uncaught JavaScript errors.
- All avatars and all three font faces loaded.

Screenshots: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png). Raw results, asset failures, font loading, and interaction checks: [browser-checks.json](screenshots/browser-checks.json).

## Assets and limitations

Both original Webflow Neue Montreal URLs return HTTP 403. Their exact declarations remain in `src/index.css`, with local copies of the same Book/Medium fonts as additional `src` candidates. The browser reports the original 403s before successfully loading the local fonts. These are the only observed console/resource failures; no application script errors occurred.

Local Neue Montreal files were retrieved from:

- https://fonts.cdnfonts.com/s/100431/ppneuemontreal-book.woff
- https://fonts.cdnfonts.com/s/100431/ppneuemontreal-medium.woff

The prompt did not supply the Mondwest file. `public/PPMondwest-Regular.woff2` was retrieved from the foundry's public font specimen asset:

- https://pangrampangram.com/cdn/shop/files/PPMondwest-Regular.woff?v=7568021129578465612

That CDN file contains actual WOFF2 bytes despite its `.woff` URL extension; it is saved with the prompt's required `.woff2` filename. No substitute font is used for the heading. Vite prefixes all local font paths correctly in the build.

All five specified Pexels URLs loaded in both browser runs. Avatars remain external and require network access. Loop resets and transitions follow the prompt's explicit offset/wrap rules.
