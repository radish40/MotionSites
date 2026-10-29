# Interactive Discovery

Design ID: `interactive-discovery`. A full-screen Lithos geology hero built with React 18, TypeScript, Vite, Tailwind CSS and lucide-react. Uses the exact supplied images, Inter and italic Playfair Display, staggered entrance animations, and the 260px cursor-following canvas spotlight with the requested gradient stops and 0.1 easing.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/interactive-discovery:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Production files are in `dist/`. Vite base is `/motionsites-results/interactive-discovery/`; open that path when previewing. The dependency lock file is included; `node_modules` is excluded.

## Verification

The real production build (`tsc -b && vite build`) passed. Chromium checked the built page at the configured subpath on desktop 1440×1000 and touch mobile 390×844. Both have no overflow. Verified the data-URL reveal mask, Start Digging, desktop topic buttons, mobile menu, touch activation, sign-up dialog, Escape dismissal and reduced-motion CSS. No browser page errors or failed requests were recorded.

`browser-check.cjs` is the repeatable browser check; run it inside the supplied image after starting `npm run preview -- --port 4173`. It uses `/app/node_modules/playwright-core` and `/usr/bin/chromium`.

Evidence:

- `screenshots/desktop.png`: default desktop hero.
- `screenshots/mobile.png`: default mobile hero.
- `screenshots/spotlight.png`: second image revealed with the soft mask.
- `browser-report.json`: actual browser observations.
- `result.json`: delivery manifest and checks.

All screenshots were visually inspected. The exact supplied image URLs loaded HTTP 200 in Chromium (1280×724), along with the Google Fonts CSS and both font files. Host Python image requests received 403; this did not reproduce in the actual browser. No replacement assets are used.

## Behavior and limits

Mouse movement and touch drag move the reveal. Start Digging brings it into the middle of the landscape and shows an exploration hint. Navigation changes contextual copy; the hamburger opens the mobile menu. Sign Up opens a keyboard-accessible native dialog with email validation and a local confirmation. It is a frontend preview, without backend registration, transmission or email storage.

The original external image and font URLs require network access. The canvas mask follows the supplied per-frame data-URL implementation; device performance may vary. Installation reported three npm audit advisories (one moderate, two high). The deliverable is static; no deployment or push was performed.
