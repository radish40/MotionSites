# Arceage Contact Us

Design ID: `arceage-contact-us`. A responsive contact section implemented from this project's `PROMPT.md` with React 19, Tailwind CSS v4, Motion (`motion/react`) and Vite 6. Includes the scroll-triggered Typewriter component, staggered field reveals, exact copy, blur validation and green button hover.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/arceage-contact-us/`. Open that path on the development or preview server. The production files are in `dist/`, including `dist/index.html`; serve them under that subpath.

On this host, build using the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency versions are saved in `package-lock.json`. `node_modules/` is excluded from delivery.

## Verification

A real production build passed. Headless Chromium checks against the built site cover desktop 1440×1000 and mobile 390×844, horizontal overflow, field count, untouched state, blur validation, invalid and valid email/phone, optional empty/filled fields, required fields, green button hover and prevented submission. Both Google Fonts loaded. No browser script errors occurred.

Repeat the browser checks in Docker (the image provides Chromium and Playwright):

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Evidence:

- `screenshots/desktop.png` — initial desktop layout.
- `screenshots/mobile.png` — full mobile page captured at a 390×844 viewport.
- `screenshots/desktop-validation.png` — populated form with validation icons.
- `screenshots/browser-checks.json` — assertions and asset HTTP responses.

Screenshots were visually inspected.

## Asset issues and limitations

The exact supplied Google Fonts CSS import is used. Both font families returned HTTP 200 during verification.

The supplied GitHub `tick-circle.svg` and `close-circle.svg` URLs both returned HTTP 404. The specified URLs remain in the CSS mask layers, with local SVG circle-check and circle-X fallbacks in `public/icons/`. These are copied into `dist/icons/` and use the configured base path. Asset failures are recorded in the browser report; the fallback masks keep validation visible.

As explicitly specified, submission calls `preventDefault()` and does not send a message or display a fabricated success state. Phone validation requires a leading `+`. The optional message is a single-line text input. Google Fonts require an internet connection; system font fallbacks are configured. Nothing has been deployed or pushed.
