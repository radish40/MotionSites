# SaaS Value

Design ID: `saas-value`. A Questly SaaS hero implemented with React, TypeScript, Tailwind CSS 3, Vite, and lucide-react. The page uses real DOM text, controls, and dashboard elements. The dashboard renders at 896px and uses ResizeObserver to fit its container. Entry animations respect reduced motion.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base is `/motionsites-results/saas-value/`. Publishable files are in `dist/`, including `dist/index.html`. No deployment was performed.

On this host, the build was executed in the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves the production output under its configured subpath and uses actual Chromium through Playwright. It verifies desktop 1440×1000 and mobile 390×844, image and font loading, page overflow, mobile navigation, desktop Toolkit dropdown, search question preservation, free-trial and sales form validation/confirmation, dialog closing, and reduced-motion animation suppression. It captures script errors, console errors, and failed requests. Final evidence is in `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`.

## Assets and recovery

- Background: the exact supplied Higgs image URL succeeded. It is saved unchanged as `public/assets/hero.webp` and applied as an inline section background image.
- Font: the required OnlineWebFonts stylesheet is linked in `index.html`. Its original WOFF2 was also downloaded to `public/assets/nimbus-sans.woff2`, preloaded, and locally declared for reliable rendering. The exact requested font stack is configured in Tailwind and CSS. Original stylesheet metadata is preserved in `public/assets/font-source.css`. Font source/attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), CC BY 4.0 as stated by its stylesheet.
- Grass: `https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png` returned HTTP 401, with `dy5er7kv5 cannot be accessed via this endpoint`. The original upload URL without transformations also returned 401. A transparent, isolated foreground-grass crop was recovered from only this design’s `/home/opc/motionsites/assets/previews/saas-value.webp`. The reference is a single-frame 1978×1466 WebP. `scripts/recover-grass.cjs` normalizes it to 1855×1375, crops its bottom 175px, applies a contour and green-color alpha mask, and trims the contour to exclude all dashboard labels. Only the resulting grass pixels are used; no page text, controls, or dashboard screenshot is embedded. The recovered silhouette has a trimmed edge and approximates the unavailable original; exact original transparency cannot be verified.
- Brand SVG path is the exact supplied path. All UI icons use lucide-react.

To reproduce the grass extraction, mount this design’s reference read-only and run `node scripts/recover-grass.cjs /reference.webp` in the same Docker environment.

## Scope and limitations

Search and CTA buttons provide local preview dialogs. Forms validate email input and explicitly state that no account or message is created. No AI generation, account service, email delivery, pricing service, or news backend was specified or connected. The dashboard is a visual mockup. Only this project was implemented; nothing was pushed or deployed. `ready` means ready for management-session review.
