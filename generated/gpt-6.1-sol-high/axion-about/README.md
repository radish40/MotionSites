# Axion About

Implementation of `PROMPT.md` as a single React component in `src/About.tsx`, using React 18, TypeScript, Tailwind CSS 3.4 with its default theme, and `ArrowRight` from lucide-react. Typography uses Tailwind's system font stack. Copy, responsive layouts, spacing, image ratios, and the 500ms CTA text-roll and arrow rotation follow the supplied prompt.

The production output is in `dist/`. Its configured public path is `/motionsites-results/axion-about/`. This project has not been deployed or pushed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the displayed local URL followed by `/motionsites-results/axion-about/`.

The actual build used the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

`package-lock.json` pins dependencies. `node_modules/` is excluded from delivery.

## Assets

Both exact image URLs from `PROMPT.md` downloaded successfully. Their original WebP responses are bundled under `public/assets/` and copied into `dist/assets/`, so the delivered page does not depend on external image or font requests. Each supplied image is 1280×956; the requested CSS aspect ratios and `object-cover` determine its visible crop. No replacement images or custom fonts are used.

## Browser validation

The built static files were served locally at the configured subpath and checked using headless Chromium and the image's existing `playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

Checks cover 1440×1000 desktop, 390×844 mobile, 768×1000 tablet, and 1024×1000 desktop. All four loaded both images, displayed the correct responsive image count, had no script/console/HTTP errors, and had no horizontal page scrolling. The CTA accepts keyboard focus and clicks. Hover checks confirm a −20px text translation, rotation from −45° to 0°, and the specified hover background color.

Evidence:

- `screenshots/desktop.png`: full page at a 1440×1000 viewport.
- `screenshots/mobile.png`: full page at a 390×844 viewport (the page extends below the viewport).
- `screenshots/desktop-hover.png`: desktop hover state.
- `screenshots/small-desktop.png`: additional 1024px layout evidence.
- `screenshots/browser-checks.json`: measured layout and interaction results.

Desktop and mobile screenshots were also visually inspected.

## Known prompt limitations

The prescribed desktop `grid-cols-[26%_1fr_48%]`, gaps, and `whitespace-nowrap` paragraph cause the intrinsic center column to expand. At 1440px the large image extends into the nominal right padding; at 1024px its right edge is approximately 40.8px outside the viewport and is clipped by the specified section `overflow-hidden`. The exact requested classes are preserved. This clipping is recorded rather than treated as horizontal scrolling.

The prompt specifies the CTA's appearance and hover behavior but supplies no click destination or action. The semantic button therefore has no navigation handler; integrating a destination is left to the enclosing product.
