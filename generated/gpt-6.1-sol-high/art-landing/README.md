# Art Landing

Design ID: `art-landing`. A two-section landing page built with React 19, TypeScript, Vite 6, Tailwind CSS 4, and Motion 12 (`motion/react`). It uses the specified logo path, typography, remote videos, responsive copy layouts, red second section, signature, cloud parallax, and oval CTA.

The production files are in `dist/`, with the configured base path `/motionsites-results/art-landing/`. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the configured base path on the Vite server. The build includes TypeScript checking and writes `dist/index.html` and its assets.

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The lockfile is included; `node_modules` is excluded from the deliverable.

## Browser verification

Run from this directory after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

The script serves the actual production build at its configured subpath, opens Chromium using the image's installed Playwright Core, records browser results, and saves screenshots. It checks desktop at 1440×1000 and mobile at 390×844.

Verified on 2026-10-29:

- Production build passed, including TypeScript checking; npm reported zero dependency vulnerabilities.
- No JavaScript page errors, failed network requests, or horizontal layout overflow at either required viewport. The known cloud HTTP 401 is recorded separately.
- Manrope, Italiana, and Marck Script loaded successfully.
- Both specified videos loaded at 1280×720. The hero played on entry; the bottom video played when scrolled into view. Chromium pauses the offscreen bottom video initially.
- “Get started” is keyboard focusable and scrolls the internal main container to the second section.
- Desktop hover reaches the specified translucent white background and 48px backdrop blur. Touch devices retain their normal button styling.
- Cloud parallax reaches −100px on desktop and −24px on mobile.
- Desktop/mobile hero, second-section, and bottom screenshots were captured and visually reviewed.

Primary captures: `screenshots/desktop.png`, `screenshots/mobile.png`. Additional captures: `screenshots/desktop-section2.png`, `screenshots/mobile-section2.png`, `screenshots/desktop-bottom.png`, `screenshots/mobile-bottom.png`. Raw results: `screenshots/browser-checks.json`.

## Asset issues and implementation notes

The specified cloud URL returns HTTP 401 with `x-cld-error: dsdhxhhqh cannot be accessed via this endpoint`. Its URL is retained in the source. An image error handler switches to the included `public/cloud-fallback.svg`, a locally authored soft cloud bank. This preserves the transition and parallax but cannot reproduce the unavailable original cloud asset exactly. Both videos and Google Fonts worked during verification; runtime access to these external services is required.

The prompt specifies the topic but does not provide literal text for the two SaaS description paragraphs or the two closing paragraphs. Suitable business-automation copy fills these slots. All explicitly supplied text is preserved. Because no CTA destination is supplied, “Get started” scrolls to the second section without adding another product flow. Reduced-motion preferences disable cloud parallax and smooth scrolling.

Status `ready` means ready for review, not published.
