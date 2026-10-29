# FAQ CTA

Design ID: `faq-cta`. A React + TypeScript + Vite + Tailwind CSS implementation of the supplied CTA, FAQ accordion, and footer. Uses Inter and the specified remote Logoipsum SVG, with Lucide chevrons and no additional UI library.

The CTA uses the exact five animated radial gradients and registered custom properties from PROMPT.md. The FAQ opens the first answer by default, allows one open answer, and supports click, Enter, and Space. The footer follows the specified responsive grid. Minor sizing constraints on the newsletter input prevent flex overflow.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The production base path is `/motionsites-results/faq-cta/`. Open that path on the development or preview server. Deployable static files are in `dist/`, including `dist/index.html`. No deployment was performed.

This host uses the existing Docker image for Node and Chromium. From this project directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The check script serves the actual production build at its configured subpath using a temporary HTTP server. It verifies desktop 1440×1000 and mobile 390×844, all FAQ toggles, single-open state, keyboard activation, CTA hover shadow, email validation, gradient interpolation, reduced motion, font and logo loading, console errors, and horizontal overflow. Extra overflow checks cover 320, 480, 768, 900, 901, and 1100 pixels.

Full-page screenshots: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png). Machine-readable browser results: [browser-checks.json](screenshots/browser-checks.json).

## Scope and limitations

- CTA destination and signup service were not supplied; the CTA retains the specified presentation and hover behavior.
- Newsletter uses native email validation, without a backend or a claim that an email was subscribed.
- Footer links retain the specified `href="#"` placeholders.
- Google Fonts and the supplied remote logo require network access. Both loaded successfully during browser verification.
- Gradient interpolation uses modern CSS `@property`; reduced-motion users receive the static gradient.

The project is prepared for review, not published. Dependencies are recorded in `package-lock.json`; `node_modules` is excluded from source control.
