# CleanTech

Terova's scroll-driven circular-systems landing page, implemented from `PROMPT.md`. Project ID: `cleantech`. This is a static React 18 + Vite + TypeScript site, with Tailwind CSS, Framer Motion, and Lucide React.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/cleantech/` on the local server. Vite's base and all production resource URLs use that subpath. `dist/index.html` and the accompanying `dist/` files are the complete static deliverable.

The host used for this build has no Node installation. The equivalent container command, run from this directory, is:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Implementation

The fixed video hero fades over 60% of a viewport, followed by the specified 170vh spacer. The about paragraph uses Framer Motion character opacity transforms. The 400vh impact sequence contains a sticky canvas and two timed statistics overlays. The canvas extracts up to 120 scaled ImageBitmap frames from the supplied video and smooths scroll position using requestAnimationFrame. A seek-based video remains available as the fallback. The logo and five-dot decoration stay fixed.

Both exact supplied CloudFront MP4 files were downloaded into `public/assets/`. Google Fonts Inter, weights 300–700, is served as a local variable WOFF2 font. `inter-google.css` preserves the source stylesheet for provenance and is not loaded by the page. There are no required runtime requests to third-party asset hosts. The Tailwind `font-sans` override is preserved separately from the Inter body font.

## Browser verification

The check uses the existing Chromium and Playwright Core installation in the same Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp --shm-size=1g -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script serves the actual production build at its configured subpath. It checks 1440×1000 desktop and 390×844 mobile layouts, hero autoplay, anchor navigation, scroll fade, character reveal, extracted canvas frames, both statistics, return-to-top, script errors, failed HTTP responses, and horizontal overflow. Screenshots are saved under `screenshots/`; `desktop.png` and `mobile.png` show the hero, with additional about and statistic captures. Machine-readable evidence is written to `screenshots/checks.json`.

Completed validation: production TypeScript/Vite build passed; both viewports passed with 120 extracted frames each, zero script errors, zero failed resource responses, and no horizontal overflow. A separate forced-unavailable ImageBitmap check confirmed seek-based fallback playback at 6.49 seconds of the 10.04-second film. Character opacity was measured at 1 for the first character and 0.3 for the final character during the reveal. All eight screenshots were visually reviewed. The fallback check can be repeated without re-extracting frames using the same command with `--fallback-only` appended.

## Limits

The prompt supplies no company LinkedIn profile, telephone number, or email address. The social notch preserves the requested icons; LinkedIn opens its generic home page, and phone/email use unaddressed `tel:` / `mailto:` links. No contact details have been invented. The die is decorative, as specified. Frame extraction time and memory consumption vary with browser/device; seek-based playback is the intended fallback. Verification covers Chromium, not physical mobile devices or other browser engines. No deployment or push was performed.
