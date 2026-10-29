# Halo Benefits

Design ID: `halo-benefits`. Implements the two sections in `PROMPT.md`: `InfoSection` and `BackedBySection`, using React, TypeScript, Tailwind CSS, Vite, and lucide-react's `ArrowRight`.

The page follows the supplied text, spacing, responsive grids, colors, card styling, partner wordmark styles, and 30-second continuous marquee. “Discover it” scrolls to and focuses the benefits grid. Keyboard focus is visible, repeated marquee names are hidden from assistive technology, and the marquee stops when reduced motion is requested.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

The production entry is `dist/index.html`. Vite's base is `/motionsites-results/halo-benefits/`; open that path on the preview server. Publish the contents of `dist/` at that path. This project has not been deployed or pushed.

On this host, Node and Chromium are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The actual initial build used `npm install --no-audit --no-fund && npm run build` in that image. TypeScript validation and the Vite production build passed. `package-lock.json` preserves the installed versions; `node_modules/` is ignored by `.gitignore` and is not part of the publishable `dist/` output.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

The script serves the actual production build under its required subpath and uses the image's Playwright Core and Chromium. It passed at 1440×1000, 390×844, 640×900, 768×1000, and 1024×1000. Checks cover responsive column counts, 320px card minimum heights, horizontal overflow, image decoding, font loading, marquee movement and duration, button hover, click and keyboard activation, and reduced motion. There were zero page errors, console errors, or failed requests.

- `screenshots/desktop.png`: full-page screenshot at 1440×1000.
- `screenshots/mobile.png`: full-page screenshot from a 390×844 viewport.
- `screenshots/browser-checks.json`: recorded browser measurements and checks.

Both screenshots were visually reviewed.

## Assets and limits

The exact supplied Higgs image was successfully downloaded to `public/assets/savings-bloom.webp` (1280×724). The exact supplied TT Norms Pro Regular stylesheet and WOFF2 font were also successfully downloaded; the stylesheet link required by the prompt remains in `index.html`. A local font-face uses the same font for reliable rendering. All local production asset URLs support the required subpath. No replacement imagery or generated assets were used.

Font source: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts). The supplied stylesheet's attribution notice is preserved in `public/assets/font-source.css`.

No asset failures were observed. The external stylesheet link still depends on its provider, while the image and font have local copies. Partner wordmarks intentionally use the system font stacks specified in the prompt, whose rendering can vary by operating system. Browser verification was performed with Chromium. The scope is exactly the two requested sections; no additional landing page sections or financial service integrations are included.
