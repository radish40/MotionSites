# New Era Automotive Hero

Design ID: `new-era-automotive-hero`.

A responsive, full-screen automotive hero built with React, Tailwind CSS, and Vite. It includes the original looping car video, gradient decorative typography, Logoipsum navigation, shopping CTA, and Bebas Neue tagline. The hero uses the requested 600px minimum and 965px maximum height. Desktop navigation hides below 1024px; the brand name and Sign In hide below 640px. The CTA stacks on mobile.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview
```

Open `/motionsites-results/new-era-automotive-hero/`. Vite's base is configured for that exact subpath. The complete static build is in `dist/`, including `dist/index.html` and all media/fonts.

On this host, use the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -e npm_config_cache=/work/.cache/npm -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

The reproducible check serves the production build at the required subpath and uses the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Passed at desktop **1440×1000** and mobile **390×844**:

- Original MP4 decodes at 1764×1176; muted autoplay and inline playback work.
- Playback wraps to the start at the end of the 10.04-second clip.
- Inter 400/500/600 and Bebas Neue load from local assets.
- Correct hero heights (965px desktop, 844px mobile), responsive navigation visibility, and no horizontal overflow.
- Navigation, brand, Cart, and Shop Now links respond with their intended hash destinations.
- No browser script errors or failed HTTP asset requests.

Screenshots were visually inspected: `screenshots/desktop.png` and `screenshots/mobile.png`. The check pauses the video at two seconds only when capturing screenshots; normal page playback remains automatic and looping. Raw results are in `screenshots/checks.json`. The final dependency install reported zero audit vulnerabilities.

## Assets and provenance

- `public/assets/automotive.mp4` is an unchanged local copy of the exact requested [CloudFront video](https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260213_051817_c7d8ccc6-bfaa-417c-8474-e5cefeea26b4.mp4). The original URL returned HTTP 200; no video reconstruction was needed.
- `public/assets/automotive-poster.webp` is copied from this design's supplied `/home/opc/motionsites/assets/previews/new-era-automotive-hero.webp`. This reference contains only car artwork, with no interface text or controls. It is used solely as the video's loading poster. All page typography, navigation, gradients, and controls are real DOM/SVG elements.
- Google Fonts were downloaded locally: Bebas Neue 400 from `fonts.gstatic.com/s/bebasneue/v16/`, and Inter 400/500/600 from `fonts.gstatic.com/s/inter/v20/`. Their exact filenames are preserved in the font URLs represented by the local TTF files; no substitute fonts are used. Initial Python downloads stalled; direct curl downloads succeeded. No runtime external requests are required.
- The small pinwheel, cart, and arrow icons are inline SVG implementations matching the prompt's descriptions.

## Scope and limits

This deliverable is the specified hero only. Shop, Blog, About Us, Contact Us, Sign In, and Cart use integration-ready hash links; no destination pages, authentication, product inventory, or checkout were specified or added. Link checks verify navigation targets, not those downstream features. The video intentionally uses object-cover, so the car crops more tightly in portrait view. Validation used Chromium; other browser engines were not tested. No deployment or push was performed.
