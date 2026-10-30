# Prioritize

Responsive landing hero for `prioritize-hero`, implemented from TASK.md and PROMPT.md with React, TypeScript, Tailwind CSS v4, Motion (`motion/react`), and lucide-react. Includes the exact brand SVG, dotted background, handwritten sticky note, four layered decorative groups, animated entrance, responsive navigation, and reduced-motion support.

## Build

Use Node 22 with `npm ci && npm run build`. For development run `npm run dev` and open `/motionsites-results/prioritize-hero/`.

The host workflow is:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Publishable output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/prioritize-hero/`. The dependency lockfile is included. No deployment or push was performed.

## Validation

The real production build passed TypeScript and Vite compilation. Reproduce the Chromium checks with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 /work/scripts/browser-check.cjs
```

The script starts and closes its own local HTTP server and checks the exact nested base path. Desktop 1440×1000 and mobile 390×844 passed with zero console/script errors, zero failed requests, all font faces and avatars loaded, and no horizontal overflow. Tested primary CTA, all desktop navigation/auth controls, mobile menu opening/closing and item selection, dialog close/Escape, and integration hover scaling. Also checked 768px tablet overflow and reduced-motion rendering. Desktop and mobile screenshots were visually inspected.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`, and machine-readable `screenshots/checks.json`.

## Assets and limits

The designated preview `/home/opc/motionsites/assets/previews/prioritize-hero.webp` was absent. The implementation follows the full written specification; reference-image comparison was unavailable. No screenshot is used as page content.

Original Google Fonts CSS was successfully retrieved for Inter 100–500 and Caveat 400–700. Exact binaries are stored locally and bundled by Vite; original source URLs are retained in `public/assets/fonts-source.css`. The four avatar SVGs are local copies of the specified `https://api.dicebear.com/7.x/avataaars/svg?seed=...` URLs using Felix, Aneka, Sam, and Maya. Images retain `referrerPolicy="no-referrer"` and original URLs in `data-source`. All runtime assets load locally with no external network dependency. Folders and UI blocks use real SVG/DOM, intentionally clipped at card edges and scaled down on mobile.

Only a landing hero and navigation were specified. Navigation opens concise information dialogs. Trial and sign-in controls disclose product-preview status; no account backend, registration, payment service, or invented prices are provided. Native dialogs support focus containment and Escape dismissal. Ready indicates local delivery for review, not a live deployment.
