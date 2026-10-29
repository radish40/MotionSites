# Gear Shop

Design ID: `gear-shop`. A static Vite page with three 390 × 844 iPhone mockups, vanilla HTML, inline CSS, and vanilla JavaScript. The screens use the specified coral palette, supplied photography, iOS chrome, SVG rings, and staggered animations. They display in a row at 0.744 zoom and stack below 1000px.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On the provided host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable static build is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/gear-shop/`; serve the directory at that URL. Nothing has been deployed or pushed. `package-lock.json` pins dependencies. `node_modules/` is excluded from source control.

## Verification

The production build was tested in real headless Chromium using the supplied Docker image's Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves only this project's build at its intended subpath. Checks cover desktop 1440 × 1000 and mobile 390 × 844, screen arrangement, horizontal overflow, image loading, search and empty results, filters, product selection, swatches, cart totals/open/close, category menu, Escape dismissal, preview playback, and reduced motion. Browser console errors, script errors, and failed requests are captured. Detailed results: `screenshots/checks.json`.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. The mobile screenshot captures the full vertical layout from a 390 × 844 viewport. Both were visually reviewed. The dependency audit reported zero vulnerabilities with the resolved Vite 6.4.5 dependency set.

## Assets and limits

All five specified Figma PNGs and the supplied Unsplash avatar were successfully downloaded into `assets/images/`; no runtime image requests go to external hosts. Original image pixels are used, not a preview screenshot. A local Noto Emoji subset renders the requested fire emoji; its OFL license is included in `assets/fonts/`.

The Substance OTF files requested by the prompt were not provided. Inspection of the supplied site's asset references did not locate them. Local Substance font-face declarations and the exact requested system fallback stack are implemented; the captured environment uses the fallback. This is a known typography limitation. See `assets/fonts/README.md` for replacement instructions.

Interactions are local demonstrations. Cart state lasts for the current page load, color previews use CSS filters on the supplied single product image, and the play button generates a quiet three-tone preview with Web Audio because no audio file was supplied. No checkout, authentication, or backend is added.
