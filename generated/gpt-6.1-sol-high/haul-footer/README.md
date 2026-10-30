# HAUL!

Design ID: `haul-footer`. A React footer scene built with Tailwind CSS, `motion/react`, and `lucide-react`, following this project's PROMPT.md. Includes the supplied logo path, Inter 400/500/600/700, responsive footer, animated introduction/card, and scroll-driven foreground truck. All runtime assets are local.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
```

The production output is `dist/`, configured for `/motionsites-results/haul-footer/`. Serve it at that prefix. No deployment was performed.

The actual build in this environment used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

`package-lock.json` records installed versions. `node_modules` is excluded from delivery; use `npm ci` to restore it.

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node checks/browser.cjs'
```

The check serves `dist/` in a temporary container using Node HTTP and Chromium/Playwright. It checks desktop 1440×1000, mobile 390×844, and tablet 768×1024: responsive spacer height, truck transform changes on scroll, seven navigation links, social hover color, keyboard focus, image/font loading, horizontal overflow, console errors, and failed requests. All passed. Machine-readable evidence: `checks/browser-results.json`.

Screenshots `screenshots/desktop.png` and `screenshots/mobile.png` show the scene scrolled into view at the requested viewport sizes. Additional `*-full.png` files include the introductory spacer and complete scene. Screenshots were visually inspected.

## Assets and limitations

- Background saved unmodified as `public/assets/landscape.webp` from the exact [Higgs image URL](https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260430_115327_3f256636-9e63-4885-8d0b-09317dc2b0a5.png&w=1280&q=85). Retrieved successfully, 1280×724.
- Foreground saved unmodified as `public/assets/truck.png` from the exact [Figma asset URL](https://roof-wish-40038865.figma.site/_components/v2/f31fd17907ce60745d45e83a61d44fd3810d5f25/truck_1.8c4bff83.png). Retrieved successfully, transparent 8064×2865 PNG. Original file is approximately 19 MiB.
- Inter CSS retrieved from [Google Fonts](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap); all four referenced Google font files downloaded and CSS URLs changed to local paths. Imported through the project CSS and bundled by Vite. No runtime network dependency.
- Optional reference `/home/opc/motionsites/assets/previews/haul-footer.webp` was absent. Visual matching was assessed against the complete written prompt; no reference extraction or substitute imagery was used.
- Link destinations were not supplied. Navigation and social anchors use `#`; no application pages, store listings, or social accounts are invented. Hover/focus work, but destination content cannot be validated.
- No push, deployment, messaging, other sessions, or agents were used.

Status `ready` means ready for review, not published.
