# CozyPaws

Single-page pet store hero built from `PROMPT.md` with React, TypeScript, Vite, Tailwind CSS, and Lucide React. The design uses the supplied mint/forest/orange palette, Google Fonts, seven external asset URLs, responsive mobile/tablet/desktop layouts, and staggered entrance animations. Reduced-motion preferences are respected.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/cozypaws/` on the development or preview server. Vite's base is set to that exact path. The production deliverable is `dist/`, including `dist/index.html`. The dependency lockfile is `package-lock.json`.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

The following runs an isolated temporary HTTP server against the actual built `dist/` subpath and uses the image's Playwright Core and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

Verified desktop 1440×1000, mobile 390×844, and tablet 834×1112. No horizontal or vertical document overflow, JavaScript errors, failed requests, or HTTP error responses were observed. Both fonts and all supplied images loaded. Screenshots were visually reviewed:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/tablet.png`

Detailed browser observations are saved in `screenshots/checks.json`. Interaction checks cover product search, product preview, adding to cart, changing quantity and subtotal, toggling favorites, reviews, navigation/account dialogs, mobile CTA/product arrow, and Escape/close dismissal. Native dialogs provide modal focus containment and restore the triggering control's focus.

## Scope and limitations

This is a static hero prototype. Product/cart/favorite changes stay in React state for the current visit. Initial badges reproduce the requested counts; only the supplied Cat House product is demonstrated in the previews. No checkout, accounts, inventory, or backend is connected.

The supplied video asset is a PNG, and no playable video or specific review URLs were provided. The play control opens the review preview with links to TikTok and YouTube homepages. Delivery, brand, and account controls open compact local informational panels.

All supplied images remain remote, as requested, and Google Fonts load externally. No asset failures were observed during verification; future availability requires those hosts. No generated images, downloaded source assets, deployments, pushes, other sessions, or subagents were used.
