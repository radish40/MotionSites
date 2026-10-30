# Synapse

Design ID: `community-superdesign-synapse`.

A responsive AI infrastructure landing page built from this project's `PROMPT.md`: Vantablack background, Instrument Serif headings, Inter UI, violet/cyan ambient light, floating glass navigation, animated hero, infinite metrics ticker, interactive feature cards, code integration window, and four-column footer.

Implemented with Vite 6 and vanilla JavaScript/CSS. The prompt does not mandate a framework or provide specific external artwork. All illustrations, icons, orbits, and lighting are CSS or inline SVG; page text and controls are real DOM elements.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base path is `/motionsites-results/community-superdesign-synapse/`. Open that path on the development or preview server. The complete static build is in `dist/`, including `dist/index.html` and locally hosted fonts.

On the provided Docker environment, from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible test starts a temporary HTTP server inside its container, serves the actual `dist/` at the required base path, and uses Chromium with the image's existing Playwright library:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

Passed at desktop **1440×1000** and mobile **390×844**:

- No browser script errors or failed resource requests.
- Document width equals viewport width; no horizontal layout overflow.
- Instrument Serif and Inter are loaded.
- Primary CTA navigates to the developer integration section.
- Python/TypeScript tabs change the displayed code and filename.
- Copy control writes the selected snippet to the clipboard and reports success.
- Normal-motion checks confirm orb, ticker, and border animations, scroll reveal, and card hover movement.

Full-page screenshots captured at the required viewport sizes are `screenshots/desktop.png` and `screenshots/mobile.png`. Machine-readable observations are in `screenshots/browser-checks.json`. Screenshots use reduced motion for stable captures; animations were checked in a separate normal-motion browser context. Both screenshots were visually reviewed.

The dependency installation reports zero known vulnerabilities. Keyboard focus styles, semantic navigation, live copy feedback, and reduced-motion support are implemented.

## Acceptance correction

Added a literal space after the hero copy's `<br>` in `index.html` (`idea.<br> Connect`). At 390×844, where CSS hides the break, the rendered text now contains `idea. Connect`. At 1440×1000, the explicit desktop line break remains visible. All wording and design styles are preserved.

Rebuilt the production bundle and refreshed both required screenshots. The browser check now asserts the rendered sentence boundary and the expected responsive break display in both viewports. Navigation, code tabs, copying, font loading, motion, script errors, and overflow checks all passed again. The refreshed desktop and mobile screenshots were visually reviewed.

## Assets and limitations

Instrument Serif and Inter were downloaded from Google Fonts and are served locally; no runtime external asset requests are required. Font license files are in `public/fonts/licenses/`. The optional original reference `/home/opc/motionsites/assets/previews/community-superdesign-synapse.webp` was absent. No reference images or screenshot fragments were used, so exact reference-image matching could not be verified.

The prompt specifies a visual design and component behavior rather than exact marketing copy; the Synapse copy and sample snippets were authored for that design. Metrics, testimonials represented by initial avatars, SDK names, and code are illustrative design content. This is a static marketing implementation; it does not call an AI service or provision credentials. Navigation targets real sections, and copy/language controls work locally. Nothing has been pushed or deployed.
