# Reveal Hero

Design ID: `reveal-hero`. A single-page PureFlow One hero built from this project's `PROMPT.md` using React 18, TypeScript, Vite, Tailwind CSS, and lucide-react. The required Supabase dependency is included; this hero needs no backend or credentials.

The supplied remote images remain at their exact URLs. Inter loads from Google Fonts. The hero includes the supplied SVG logo, desktop pill navigation, responsive mobile menu, eased cursor tracking, ref-driven SVG grid offset, and a hidden canvas that regenerates the radial reveal mask on every animation frame. All styling and copy follow the prompt, including the 260px spotlight, 48px grid, full viewport height, and text positioned 224px from the bottom on desktop and 48px on mobile/tablet.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite's base is `/motionsites-results/reveal-hero/`. Open that path on the dev or preview server. The production output is `dist/`, with `dist/index.html` and hashed CSS/JS assets. `package-lock.json` locks dependencies; `node_modules/` is excluded from source delivery.

On the provided host, use its existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Validation

The production build passed TypeScript and Vite compilation. Browser checks use the image's existing Chromium and playwright-core and serve `dist/` at the actual required subpath, without deploying:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

Verified desktop 1440×1000, tablet 700×1000, and mobile 390×844: correct hero height and text bottom offset, no document overflow, and canvas resizing to the viewport. The checker verifies changing mask pixels and grid direction after mouse movement, mobile menu open/close and item selection, and Escape dismissal. It also checks browser exceptions, console errors, failed requests, font availability, and both remote images.

Artifacts:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-report.json` (measured layout, asset responses, and interaction results)

## Scope and limitations

Only this hero is implemented. The prompt supplies no destinations or flows for Discover, View Specs, Reserve Yours, or desktop navigation, so those remain presentation buttons. The mobile navigation toggle works and selecting an item dismisses its menu. No extra sections, reservation flow, video, backend, or deployment were added.

Both supplied images and the Google font loaded successfully during validation. They remain external runtime dependencies, as required; offline rendering is not guaranteed. The mobile image crop and text over the image follow the exact supplied layout. The required canvas-to-data-URL mask updates continuously and may cost more CPU on less powerful devices. Touch devices display the initial centered reveal; cursor movement controls it on pointer devices.

Status `ready` means ready for management-session review, not published or deployed.
