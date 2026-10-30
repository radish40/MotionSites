# Crypto Wealth

Project ID: `crypto-wealth-hero`. The rendered brand and page title are **ContentFlow**, as specified in `PROMPT.md`.

A React 18 + TypeScript + Vite landing page with default Tailwind CSS utilities, lucide-react icons, and Inter weights 300–900 from Google Fonts. Two full-height sections share a fixed video background. Scrolling fades and lifts the hero, zooms the background from 1 to 1.3, and reveals the video showcase and animated analytics dashboard.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The production output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/crypto-wealth-hero/`; serve this directory at that URL path. No deployment was performed. Dependencies are pinned in `package-lock.json`; `node_modules/` is excluded from deliverables.

## Assets

The two original supplied MP4s were downloaded intact into `public/assets/` and copied by Vite into `dist/assets/`. Both decode and autoplay muted in Chromium. No image generation, extraction, or replacement assets were needed.

- `background.mp4`: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260417_061226_74f0749c-a22d-42b3-895e-5d6203bc741c.mp4
- `showcase.mp4`: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260415_154932_f36efd90-557d-4cfb-add6-79336918bd53.mp4
- Inter: requested from Google Fonts through preconnect and stylesheet links in `index.html`. Successfully loaded during browser verification; continued font availability depends on that external service.
- The optional design preview at `/home/opc/motionsites/assets/previews/crypto-wealth-hero.webp` was absent. Implementation follows the complete written prompt; comparison against that preview was unavailable.

## Validation

`npm run build` runs TypeScript checking and a real Vite production build. The final dependency audit is saved in `dependency-audit.json` and reports zero vulnerabilities.

Run the browser checks against the built output:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script uses the image's existing Playwright and Chromium, starts a temporary HTTP server with video range support, and tests the real publish subpath at desktop **1440×1000** and mobile **390×844**. It verifies the page title, Inter font, four feature cards, both videos' playback and decode status, hero opacity, showcase opacity, background zoom, CTA/home anchors, desktop navigation links, script errors, failed requests, and horizontal overflow. Results are in `screenshots/browser-checks.json`.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-showcase.png`
- `screenshots/mobile-showcase.png`

All screenshots were visually inspected. The mobile showcase retains the prompt's small-screen dark text and bottom-right scaled dashboard. Videos remain moving assets, so screenshot frames vary between runs.

## Scope and limitations

This is the specified landing page. Navigation and Get started scroll to the existing showcase; the logo returns to the hero. Dashboard values are the supplied illustrative data. No additional product, pricing, authentication, or publishing flows were added. Reduced-motion styles shorten entrance animations and disable continuous decorative ring rotation. Browser validation covers Chromium at the two requested viewports; other browser engines and physical-device autoplay policies were not tested.
