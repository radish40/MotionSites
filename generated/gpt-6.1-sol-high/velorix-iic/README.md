# Velorix IIC

Design ID: `velorix-iic`. A full viewport velorix hero built from the exact React component in `PROMPT.md`: black background, looping purple geometry video, centered headline and monospaced supporting copy, pill navigation and buttons, and an animated mobile menu.

## Run and build

React 18 + TypeScript + Vite, Tailwind CSS 3, and lucide-react. The supplied Supabase dependency is retained; this design does not use persistence. Dependencies are pinned by `package-lock.json`.

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

Development URL: `http://localhost:5173/motionsites-results/velorix-iic/`.

The host environment provides Node through Docker. From this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static deliverable is `dist/`, including `dist/index.html`. Its configured publishing base is `/motionsites-results/velorix-iic/`. Serve the contents of `dist/` at that path. No deployment or push was performed.

## Assets and fidelity

- The original video was successfully retrieved, unchanged, and stored at `public/assets/velorix-background.mp4`. Source: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_155101_f2540600-6fe9-433e-8e48-b3f4b72f0727.mp4
- Video metadata observed in Chromium: 3828 × 2164, approximately 10.04 seconds. It autoplays muted, loops, uses inline playback, and fills the viewport with `object-cover`, as supplied.
- Inter 400, 500, and 600 are hosted locally. `font-source.css` preserves the Google Fonts source URLs. Supporting text uses the supplied Courier New / Courier / monospace stack; the exact installed monospace fallback can vary by device.
- Menu, X, and ArrowRight use the required lucide-react components.
- The design's own preview at `/home/opc/motionsites/assets/previews/velorix-iic.webp` was inspected for composition only. No screenshot-derived page or extracted assets were used.
- Original responsive sizes, copy, menu delays, easing, blur, and hover transitions are retained. Accessibility additions expose menu expansion state, make closed menu contents inert, and provide visible keyboard focus. A small inline favicon avoids an unrelated missing-resource request.

## Browser verification

The real production build was served at the required subpath and exercised using the image's Chromium and Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script creates a temporary HTTP server inside that container and closes it after testing. See `browser-report.json` and `verification.log` for evidence.

Checks cover desktop 1440 × 1000 and mobile 390 × 844, font loading, actual video autoplay and time advancement, muted/loop flags, no horizontal or vertical overflow, navigation and CTA clicks, mobile menu toggle, Escape, link selection, and backdrop dismissal. Browser script/console errors and failed HTTP responses/requests are checked.

Screenshots, also visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`

Screenshots capture the video at three seconds for reproducibility; the delivered page plays normally.

## Scope and limits

This is the supplied presentational marketing section. Navigation links retain `href="#"`; “Join the wait” and “Watch it unfold” retain their supplied button-only behavior. No form, modal, destination pages, or backend were specified or invented. Browser verification used Chromium; other browser engines and physical devices were not tested. Mobile video cropping follows the original `object-cover` behavior. `ready` means available for review, not published.
