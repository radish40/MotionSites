# Pill Nav

Design ID: `community-superdesign-pill-nav`. A working implementation of the supplied Pill Navigation showcase, built with React 18, TypeScript, Tailwind CSS, GSAP, React Router 6, and Lucide icons. Vite produces the static site in `dist/` at `/motionsites-results/community-superdesign-pill-nav/`.

The page retains the prompt's copy, colors, spacing, rocket, pill links, rising circle and sliding labels, logo rotation, entrance animation, and fixed Replay Animation button. Smaller screens use an animated hamburger dropdown. Keyboard focus activates pill animations; Escape dismisses the mobile menu. The current hash route determines the active link. Selecting a mobile link animates the dropdown closed. Mobile padding adapts to fit the requested 390px viewport.

## Build and run

With Node 22 and npm available:

```bash
npm ci
npm run build
npm run dev
```

Open the development server at `/motionsites-results/community-superdesign-pill-nav/`. `npm run preview` serves the production build. The lockfile records installed versions.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

A real TypeScript and Vite production build passed. Chromium tests serve the actual `dist/` files at the required subpath:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script uses the image's existing Playwright Core and Chromium, starts a temporary HTTP server, and closes it when complete. Verified:

- Desktop 1440×1000 and mobile 390×844 with no horizontal overflow.
- Four desktop links; rising-circle hover, label transition and reversal, keyboard focus, active route, and rotating logo.
- Mobile menu open/close, navigation dismissal, Escape dismissal, and replay reload.
- No script or console errors, failed network requests, or HTTP resource errors.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, plus `desktop-hover.png` and `mobile-menu.png`. Machine-readable browser results are in `screenshots/checks.json`.

## Assets and limitations

The optional reference `/home/opc/motionsites/assets/previews/community-superdesign-pill-nav.webp` was absent. The supplied React source and Tailwind classes were used as the visual specification; screenshot similarity to that unavailable reference cannot be verified. No reference extraction or raster stand-in was used. The rocket and replay icons are real SVG, and the prompt's default system sans-serif font needs no external font request. All runtime assets are bundled locally.

This is the requested component showcase. Collection, About, and Contact demonstrate React Router navigation while retaining the showcase; the prompt supplies no separate page content. Validation used Chromium, not other browser engines or physical devices.

`npm audit` reported two moderate package entries involving React Router 6 and its dependency. The suggested fix changes the required major version to 7, so the prompt's `^6.28.0` requirement is retained. This demo uses fixed local link destinations and no SSR hydration. See `npm-audit.json` for the exact report.

Status `ready` means ready for review. No deployment or push was performed.
