# Hover reveal effect

Design ID: `community-superdesign-hover-reveal-effect`.

A full-viewport personal portfolio hero built with Vite, plain JavaScript, CSS, and SVG. The prompt specifies no framework. A monochrome portrait reveals its blue-lit color version through an organic SVG mask. The cursor follows with easing; five smaller blobs trail according to speed. Text and filled SVG social icons transition to white over the reveal in 300ms. Subtle waves and opposing parallax add movement. Mobile supports dragging and tapping; reduced-motion preferences disable trails, parallax, and wave animation.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the provided container:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and its local assets are ready for static hosting at `/motionsites-results/community-superdesign-hover-reveal-effect/`. Nothing was deployed.

## Validation

A real production build passed. Chromium via Playwright checked the production files at the configured subpath, at desktop 1440×1000 and mobile 390×844. Both had no JavaScript errors, failed HTTP assets, or horizontal/vertical overflow. Local portrait and Playfair font loaded. Checks cover name/Portfolio/all four social icon color inversion, moving trail radii, pointer-leave fade, keyboard focus, touch reveal/fade, and reduced-motion behavior. See `browser-checks.json` for captured values and `browser-check.cjs` for the reproducible browser check:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/desktop-reveal.png`, and `screenshots/mobile-reveal.png`. Desktop, mobile, and desktop reveal screenshots were visually inspected.

## Assets and customization limits

The original prompt contains `[YOUR NAME]`, `[IMAGE ONE]`, and `[IMAGE TWO]` placeholders, and supplies no profile URLs or portfolio destination. The optional reference file named in TASK.md does not exist. Therefore exact identity/image matching cannot be verified.

- “Alex Morgan” is an editable sample identity, not a claim about the portrait subject.
- The portrait is a locally stored Unsplash image: https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=90 . Both layers use this photograph to keep facial features aligned. Image one uses a grayscale treatment; image two uses its original blue color with a contrast treatment. No reference screenshot or video was used.
- Playfair Display was downloaded from Google Fonts and is served locally. Its OFL license is included under `public/assets/`.
- Replace the sample email `hello@example.com` and social platform home-page URLs in `index.html` with the owner's real destinations. External profile ownership/navigation was not tested; no messages were sent.
- Browser verification used container Chromium and emulated mobile input, not physical phones or every browser engine.
