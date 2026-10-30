# Glow Cursor Button

Design ID: `community-superdesign-glow-cursor-button`.

A standalone call-to-action on a dark canvas, with an olive glass-like surface, a right-arrow SVG, and a soft lime glow. Pointer coordinates update the `--cursor-x` and `--cursor-y` CSS variables to move the surface and border highlights. The page uses native HTML, CSS, and JavaScript with no runtime dependencies or external assets. The prompt specifies no framework, exact button copy, font, or downloadable assets.

The button supports mouse, touch, and native Enter/Space activation, a visible keyboard focus ring, reduced motion, and an accessible status announcement. Activation briefly displays “Let’s go” before resetting. This is a component demonstration; no navigation or backend is specified.

## Build

With Node 22 and npm:

```sh
npm ci
npm run build
```

In the provided host environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The static output is in `dist/`, including `dist/index.html`. Relative asset URLs support the required `/motionsites-results/community-superdesign-glow-cursor-button/` mount path. The build does not require Vite.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

The check script serves the actual build at the required subpath using a temporary HTTP server, then uses the image’s existing Playwright and Chromium. It stops the server and browser on completion.

Validated desktop 1440×1000 and mobile 390×844: centered layout, no horizontal overflow, cursor coordinate updates and reset, visible keyboard focus, Enter and Space activation, touch activation, timed feedback reset, reduced-motion styles, and successful local resource loading. No JavaScript or browser console errors were observed.

Screenshots, also visually reviewed:

- `screenshots/desktop.png` — desktop with the cursor highlight toward the arrow.
- `screenshots/mobile.png` — mobile resting appearance.
- `screenshots/checks.json` — machine-readable browser check results.

## Assets and limitations

The optional project reference at `/home/opc/motionsites/assets/previews/community-superdesign-glow-cursor-button.webp` was absent. Visual decisions therefore follow the written prompt; pixel matching against that reference could not be assessed. All visual elements are real DOM, CSS gradients, and inline SVG, using the system Arial/Helvetica font stack. No asset recovery or external font request was necessary. Tests used Chromium, including mobile emulation; physical devices and other browser engines were not tested. No deployment or push was performed.
