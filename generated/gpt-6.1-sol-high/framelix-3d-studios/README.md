# Framelix 3D Studios

A dark cinematic landing page for **Framelix 3D**, design ID `framelix-3d-studios`. Built from this project's TASK.md and PROMPT.md using React, TypeScript, Tailwind CSS, tailwindcss-animate, Vite, and Framer Motion.

The page includes the desktop navigation, ticket cart, full-height video hero, animated title and CTA, seamless lavender marquee, and gray Shipping Now section. The two original videos are served locally. Inter is imported from Google Fonts. Layout and controls are real DOM elements; the reference image is not used as the page.

## Build and run

Requires Node 22 and npm. All commands run from this directory:

```sh
npm ci
npm run build
npm run dev
```

The static output is `dist/`, with the required base path `/motionsites-results/framelix-3d-studios/`. `dist/index.html` exists. To preview the production build at that path:

```sh
node scripts/serve.mjs
```

Visit `http://localhost:5173/motionsites-results/framelix-3d-studios/`.

The host lacks Node; the actual build used the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

Real headless Chromium with `/app/node_modules/playwright-core` from the same Docker image was used against the production build. Reproduce:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.mjs & server_pid=$!; node scripts/check.cjs; check_status=$?; kill "$server_pid"; exit "$check_status"'
```

Verified at 1440×1000 desktop and 390×844 mobile:

- Both original videos decode and autoplay muted, looped, and inline.
- Reel dialog opens and closes; native video playback controls are available.
- Buy Now adds one product and opens the cart; Remove, Escape, and the empty-cart link work.
- Navigation hides on mobile, Inter loads, and the marquee animates.
- No JavaScript errors, failed requests, or horizontal overflow.
- A 768×1024 reduced-motion check confirms the marquee stops and the layout fits.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png` (full-page captures at the required viewport sizes). Machine-readable observations: `screenshots/browser-checks.json`. Screenshots were also visually inspected. Animated video frames vary between captures.

## Assets and limitations

- Original hero video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260223_060517_9feec9ab-18e4-477a-b034-de5903a67e91.mp4
- Original shipping video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260223_063954_03a5f7ec-5f10-4acb-ba8d-dce4815217db.mp4
- Both URLs returned successfully; downloaded originals are in `public/assets/`. No video reconstruction or reference extraction was necessary.
- Only this design's permitted preview was viewed. It shows the dragonfly artwork rather than the complete website.
- No logo asset or logo URL was supplied. `public/assets/logo.svg` is an original geometric F monogram, rendered as an image with the requested white filter. Its appearance is an approximation.
- The prompt provides navigation labels but no destination URLs, contact address, commerce endpoint, or prices. Reels/Projects open the supplied reel, Pipeline scrolls to Shipping Now, and contact-related links use an **unverified template address**, `hello@framelix.com`. Replace it with the studio's confirmed address before publishing. No email was sent.
- Buy Now operates a local in-memory cart and offers a contact link; no payment or order is processed. Cart state resets on reload.
- Google Fonts is an external runtime dependency; it loaded successfully during browser checks. System sans-serif is the fallback.

No deployment, push, external message, additional design, or agent session was created.
