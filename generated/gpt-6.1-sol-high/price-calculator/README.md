# Price Calculator

Design ID: `price-calculator`. A working Webfluin Studio project estimation section built from this project's `PROMPT.md`.

## Implementation

React 19, Vite 6, Tailwind CSS 4, a locally owned Shadcn-style Slider using Radix Slider primitives, and a shared `useToast` hook with Radix Toast rendering. The calculator uses native labeled radios and checkboxes, keyboard-accessible slider controls, visible focus states, and polite live price announcements. No extra submission or booking flow is added.

All three prices update immediately using the specified service, page, content, SEO and timeline formulas. Default estimates are agency **$12,000**, freelancer **$5,000**, and Webfluin Studio **$1,299**. Prices use dollar prefixes and locale separators. The dark two-column desktop section becomes a single column below 1024px.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/price-calculator/`. The complete static output is in `dist/`, including `dist/index.html`. Serve this directory at that URL. Source dependencies are locked in `package-lock.json`; `node_modules/` is ignored and must not be included in a delivery archive.

On the supplied host, which lacks Node/npm, run from this project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Verification

The real production build succeeded. Chromium checks run against the built output at its configured subpath, using Playwright from the supplied Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.mjs'
```

The check script starts and stops its own temporary HTTP server and browser. It verifies:

- All three pricing formulas over all 1,080 input combinations.
- Desktop service selection, both add-ons, rush/fast timelines, pointer slider operation, keyboard arrows, Home/End and page bounds.
- Mobile service, content and timeline interaction.
- Two-column desktop and stacked mobile layouts, with no horizontal overflow at 1440×1000 and 390×844, plus widths 320, 768, 1024, 1280 and 1920.
- No browser script/console errors or failed resource requests.

Full-page screenshots (captured with the required viewport dimensions) are in `screenshots/desktop.png` and `screenshots/mobile.png`. Results are saved in `screenshots/checks.json`. Both screenshots were visually inspected.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/price-calculator.webp` was absent. Layout, colors, typography sizes and controls were implemented from the written prompt; visual matching against the original preview could not be performed. No other designs were read. The prompt provides no external images or specific font family, so the page uses system sans-serif and monospace fonts, CSS, inline checkmark SVGs, and a local SVG favicon. There are no runtime external asset or font requests.

The description below “Estimated Cost” was written to fill the unspecified paragraph. No persistence or backend is requested; reloading restores defaults. Toast infrastructure is available, with no unsolicited toast behavior added. The requested section is fully interactive DOM, not a reference screenshot. Nothing has been deployed or pushed.
