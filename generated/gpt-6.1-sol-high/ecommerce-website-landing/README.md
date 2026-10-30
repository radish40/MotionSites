# E-commerce Website

Design ID: `ecommerce-website-landing`.

A complete health and wellness storefront built with React, Vite, TypeScript, Tailwind CSS, local shadcn/ui-style Button and Accordion components, Radix primitives, and lucide-react icons. It follows all nine sections in PROMPT.md: sticky navigation, animated hero, medication grid, weight loss, product carousel, science and nature badges, FAQ, wellness guides, and footer.

## Run and build

Node 22 and npm are required. On a machine with Node:

```bash
npm ci
npm run dev
npm run build
```

The configured base path is `/motionsites-results/ecommerce-website-landing/`. The production output is `dist/`, including `dist/index.html` and six static product entries. Product links also support trailing slashes. Host the contents of `dist/` at the configured subpath. No SPA rewrite is required for the generated product routes.

The host used for this build has no Node installation. Reproduce the actual build here with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

The dependency lockfile is included. `node_modules` is ignored and is not part of the deliverable. No deployment or push was performed.

## Interaction and validation

Navigation scrolls to the relevant page sections; mobile navigation opens and closes. Product buttons link to static product detail pages. The carousel supports previous, next, and pagination controls. Radix powers the single-open FAQ and accessible dialogs. Forms validate input and show local confirmation states. Dialogs support Escape, focus trapping, and return focus. Marquees run in opposing directions for 30 seconds, pause on hover, and respect reduced motion.

Run the production browser checks with the existing Chromium and playwright-core in the image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The test script starts and closes its own temporary HTTP server and browser. It checks the actual production output under its configured subpath, desktop 1440×1000 and mobile 390×844, static product entries, main interactions, local image loading, reduced motion, script errors, failed requests, and horizontal overflow. Results are in `screenshots/browser-checks.json`; full-page captures are `screenshots/desktop.png` and `screenshots/mobile.png`. Both screenshots were visually reviewed. System fonts are used; there are no runtime font or image CDN dependencies.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/ecommerce-website-landing.webp` was absent. PROMPT.md supplied no product asset URLs or additional exact feature/FAQ copy. Therefore pixel-level reference comparison was unavailable; unspecified supporting copy is original.

Six original isolated SVG product illustrations were created locally with pastel backgrounds, bottle/vial shading, and editable text. They are real image assets inside a DOM layout, not screenshots. Regenerate them with `python3 scripts/create-assets.py`. Their designs and product pricing beyond the specified semaglutide price are illustrative.

Five lifestyle photographs were successfully downloaded from Unsplash into `public/assets/`, with no external image requests at runtime:

| Local asset | Source |
| --- | --- |
| consultation.jpg | https://images.unsplash.com/photo-1573496359142-b8d87734a5a2 |
| walking.jpg | https://images.unsplash.com/photo-1518611012118-696072aa579a |
| food.jpg | https://images.unsplash.com/photo-1512621776951-a57141f2eefd |
| wellness.jpg | https://images.unsplash.com/photo-1544367567-0f2fcb009e0b |
| nature.jpg | https://images.unsplash.com/photo-1472396961693-142e6e269027 |

No authentication, prescribing, checkout, email delivery, or newsletter service was supplied. Those interactions are frontend demonstrations; form data stays in memory and resets on reload. Informational and social links open a local contact dialog. Footer badges are graphic representations; the LegitScript mark explicitly states verification pending. This is a design deliverable, not a live clinical service. `ready` means ready for management-session review, not published.
