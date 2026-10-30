# Sync AI

A single-viewport Stellar.ai landing page built from this project's `PROMPT.md`. Project index: **Sync AI** (`sync-ai`).

Uses React, TypeScript, Tailwind CSS and Lucide React. Inter weights 400, 500, 600 and 700 are imported from Google Fonts. Runtime dependencies are limited to React, React DOM and Lucide React; Vite, TypeScript and CSS tooling are development dependencies.

The page includes the specified responsive typography, staggered entrance animations, white video fades, glass partner badge, five text logos and mobile navigation. The menu toggles between Menu/X icons, exposes its expanded state, closes with Escape, and resets when resizing to desktop.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run dev
```

On the provided host, build using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

`dist/` contains the complete static build, including `dist/index.html` and the local MP4. The configured base path is `/motionsites-results/sync-ai/`. Serve the build at that path. For local Vite preview, run `npm run preview` and open `http://localhost:4173/motionsites-results/sync-ai/`.

## Verification

The production build completed successfully with TypeScript checking and Vite. Browser checks use the image's existing Playwright Core and Chromium; no test dependency is installed into this project:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The script serves the actual `dist/` under its configured subpath, verifies desktop 1440×1000 and mobile 390×844, and writes its measurements to `screenshots/browser-checks.json`. Verified:

- No horizontal or vertical document overflow at either required size.
- Local video loads, autoplays, advances, is muted and has looping enabled.
- Inter loads successfully, both heading arrangements render, and all five partners appear.
- Mobile navigation opens and closes, updates `aria-expanded`, and closes with Escape.
- CTA controls accept pointer clicks without script errors.
- No page exceptions, console errors, failed network requests or HTTP errors.

Screenshots: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png), [mobile menu](screenshots/mobile-menu.png). Desktop and mobile screenshots were visually inspected.

## Asset provenance and limits

The exact MP4 specified in the prompt was successfully downloaded without transformation to `public/assets/stellar-background.mp4` and copied into the build. Source:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_153826_e9005cf7-a1c7-4c7d-886f-fea22d644a9c.mp4

The project's permitted visual reference `/home/opc/motionsites/assets/previews/sync-ai.webp` was inspected. It shows the same colored meadow footage. All interface colors are monochrome; the supplied video retains its original colors, consistent with that reference and the exact video CSS in the prompt. No reference image was embedded, and no assets were extracted from it.

Google Fonts loaded successfully in the browser checks. It remains an external request and falls back to sans-serif if unavailable. No signup, authentication, navigation destinations or desktop dropdown content were supplied in the prompt; those buttons retain the requested visual and hover states without invented application flows. The specified mobile menu is functional. Reduced-motion preferences shorten entrance animations; the supplied background video continues playing as specified.

This is a static frontend ready for review, not a deployed service. No deployment, push or external messaging was performed.
