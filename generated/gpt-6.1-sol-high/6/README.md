# Bold Portfolio Hero

Design ID **6**. A responsive React + Tailwind CSS portfolio hero for **VIKTORODDY / Olivia**, built with Vite. The finished static site is in `dist/`, configured for `/motionsites-results/6/`.

The page includes the orange gradient, Anton headline, Inter UI, blurred ambient lettering and glows, a locally stored monochrome portrait with an SVG brush mask, desktop navigation, contact CTA, responsive stacked mobile composition, and typographic brand strip. Text is selectable; the portrait does not capture pointer events. Reduced motion preferences are respected.

Navigation opens accessible native dialog panels. Escape, the close button, or a backdrop click closes them and returns focus to the triggering link. The contact link opens an email client.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the local server at `/motionsites-results/6/`. On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The check script serves the production build at its required subpath using Vite preview and runs Chromium through the image’s installed Playwright. It saves full-page screenshots using **1440×1000** and **390×844** viewports to `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable findings are in `screenshots/checks.json`.

Verified: local image/font/mask loading, headline rendering, no horizontal overflow, no browser script errors or failed requests, all desktop navigation panels, the about panel on mobile, contact email link, and Escape/button dismissal. Screenshots were visually reviewed; the mobile portrait is positioned below most of the three-line headline to preserve readability. Email delivery was not tested.

## Assets and limitations

- Portrait: [Unsplash source](https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1100&q=90&fit=crop&auto=format), stored at `public/assets/portrait.jpg`. The prompt did not specify a particular portrait. CSS provides monochrome treatment and rotation; `brush-mask.svg` is an original, isolated mask with textured edges.
- Anton and Inter downloaded from Google Fonts and stored locally. Source font URLs: `https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf` and `https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf`. The Google Fonts response used during acquisition is retained in `font-source.css`.
- No external requests are required by the built page.
- The optional reference `/home/opc/motionsites/assets/previews/6.webp` was absent. Composition follows the written prompt; no reference screenshot or video is embedded.
- Brand names are recreated as typographic wordmarks with local system serif/sans-serif fallbacks, not official logo files; their exact letterforms may vary across operating systems. They are visual examples, not assertions of client relationships.
- Supporting project, journal, experience, and contact content is demonstration copy. `hello@viktoroddy.design` is a sample address and should be replaced with the owner’s verified contact before public use.
- Build and browser checks completed locally; nothing was pushed or deployed.
