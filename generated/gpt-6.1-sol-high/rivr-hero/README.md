# RIVR

Responsive DeFi hero built from this project's `PROMPT.md`, using React 19, TypeScript, Vite, Tailwind CSS 4, `lucide-react`, and `motion/react`. Includes the specified video background, Helvetica Regular, entrance animations, glass yield card, mobile branding, and SVG corner masks. The page uses real DOM text and controls.

## Build and run

With Node 22 and npm:

```bash
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/rivr-hero/` on the preview server. Vite's base is configured for this exact path. Static output is in `dist/`, including `dist/index.html`.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`package-lock.json` records the installed dependency versions. `node_modules` is excluded and is not part of the delivery.

## Browser validation

Run after building:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script serves only this project's `dist` at the required subpath inside the temporary container and uses the image's Playwright Core and Chromium. It does not deploy anything.

Validated desktop 1440×1000 and mobile 390×844:

- TypeScript and production build passed; npm install reported zero vulnerabilities.
- Original video loaded at 3828×2164, autoplay advanced, and muted/loop/inline attributes were verified.
- Specified Helvetica Regular loaded through the original WOFF2 endpoint.
- Book Demo hover scale measured approximately 1.02; both buttons and Library were clicked; desktop menu hover states were exercised.
- No browser console errors, uncaught script errors, failed requests, or horizontal/vertical viewport overflow in either viewport.
- One main element and the required heading were verified.
- Both screenshots were visually reviewed. For reproducible still images, the test pauses the actual video at two seconds only during screenshot capture; the shipped page continuously plays it.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/checks.json`.

## Assets and scope

The video uses exactly the CloudFront source URL in `PROMPT.md`. The stylesheet preserves the specified Helvetica font-face URLs and theme/body reset. Both external assets returned HTTP 200 and loaded successfully in Chromium. No substitute or extracted assets were needed. The optional RIVR reference WebP was absent at the specified path; visual verification used the written requirements and the rendered page.

Navigation destinations, dropdown contents, demo booking, Discord invitation, and documentation URLs were not supplied. Controls retain the specified visual hover/tap behavior without invented destinations, dropdown content, or backend workflows. This is the requested hero section only.

External video and font availability remain dependent on their original hosts. Browser validation used headless Chromium at the two requested sizes, not physical devices or other browser engines. The site is ready for review and has not been deployed or pushed.
