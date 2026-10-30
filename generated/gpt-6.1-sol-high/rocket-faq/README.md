# Rocket FAQ

Design ID: `rocket-faq`. A real React 18 + Vite + TypeScript implementation of the UI Rocket FAQ specified in `PROMPT.md`. Uses TailwindCSS, Framer Motion, Radix UI Accordion, `clsx`, and `tailwind-merge`.

The page includes all three categories and all 15 supplied answers, single-open collapsible answers, category resets, keyboard navigation, independent cursor-tracked gradient borders, staggered scroll reveals, reduced-motion support, and the specified email link. The responsive layout uses the specified 1080px container, 280px desktop sidebar, and black background.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/rocket-faq/` on the development or preview server. Vite's base is configured for this path. The complete static build is in `dist/`, including `dist/index.html` and bundled fonts. The dependency lock is `package-lock.json`; `node_modules` is ignored and is not part of the deliverable.

On this host, Node and Chromium are supplied by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v /home/opc/motionsites/generated/gpt-6.1-sol-high/rocket-faq:/work \
  -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build && npm run check:browser'
```

## Validation

`scripts/browser-check.cjs` serves the actual `dist/` at its required subpath in a temporary process and uses the image's Playwright Core and Chromium. It checks desktop 1440×1000 and mobile 390×844; all 15 answers at both sizes; single-open and collapse behavior; resetting on category switches; keyboard Enter and ArrowDown; email target; cursor coordinates and border masking; font readiness; horizontal overflow; JavaScript/console errors; and reduced motion. A separate browser context disables the external Google stylesheet to confirm the local fonts still load.

Artifacts:

- `screenshots/desktop.png`: complete desktop capture.
- `screenshots/mobile.png`: full-page capture at a 390×844 viewport.
- `screenshots/browser-report.json`: observed browser-check results.
- `result.json`: delivery status and checks.

## Assets and limitations

The only supplied visual reference inspected was `/home/opc/motionsites/assets/previews/rocket-faq.webp`. It was used for visual comparison only; no screenshot, frame, or extracted image is used in the website. The UI is live DOM and CSS. No bitmap assets were required by this design.

Inter (variable 100–900, Latin) and Material Symbols Outlined (variable font, `expand_more` subset) were downloaded from Google Fonts and included under `public/fonts/`. The exact returned Google CSS files are preserved there as source records. The Google Fonts stylesheet link requested in the prompt also remains in `index.html`; the local icon family takes precedence so rendering does not depend on that request.

The specified semantic foreground color is represented as `hsl(0 0% 100% / <alpha-value>)` in Tailwind so its required `/60`, `/70`, and `/80` utilities work correctly. The initial color is pure white. The page follows the prompt's black background even though the small reference preview appears slightly lighter.

Browser validation covers Chromium, not Safari or Firefox. The email link was checked without launching an external mail client. No deployment, push, external messages, or additional sessions were performed. `ready` means the static build is available for management-session acceptance, not that it has been published.
