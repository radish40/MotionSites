# Equilibrium

Design ID: `equilibrium`. A full-screen wellness hero implemented from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, and lucide-react. Includes the specified looping video, Geist font, liquid glass styling, responsive navigation, exact hero copy, and mobile menu toggle. No UI library beyond the requested icon package is used.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/equilibrium/` on the local Vite server. The production build is in `dist/`, including `dist/index.html`; all generated asset URLs use that base path. The dependency lockfile is included.

This host uses the existing Docker image for Node and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The real production build passed TypeScript checking and Vite bundling. Browser checks use Chromium and the image's existing Playwright installation. The check script serves `dist/` at the required subpath using an ephemeral HTTP server, then closes the browser and server.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Validated desktop 1440×1000 and mobile 390×844: no document overflow, loaded Geist, actual advancing video playback, muted and loop attributes, 4px glass blur, responsive navigation, CTA hover color, and mobile menu opening/closing with pointer and keyboard. Browser JavaScript errors, console errors, failed requests, and HTTP failures are collected in `screenshots/browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`

## Assets and scope

The exact CloudFront MP4 and Google Fonts CSS URL from the prompt are used remotely. Both loaded successfully during browser validation. Their future availability and offline operation depend on those external services. Video screenshot frames vary naturally during playback.

The prompt defines a hero and menu toggle only. Navigation, Wellness chevron, login, and CTA buttons retain the specified visual and hover behavior; no destination, account flow, or additional section was supplied. No extra flows were invented. A small inline SVG favicon avoids a browser favicon request error.

`ready` in `result.json` means ready for review, not deployed. No deployment or push was performed.
