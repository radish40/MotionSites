# HR SaaS Hero

Design ID: `hr-saa-s-hero`. A React hero implemented with Tailwind CSS v4, Motion, and Vite. Publication base: `/motionsites-results/hr-saa-s-hero/`. The ready-to-serve static build is in `dist/`.

The page uses the exact supplied video, vertically flipped with `scaleY(-1)` and `object-fit: cover`, with the specified transparent-to-white gradient stops. Main content has 290px top padding, a 1200px maximum width, and 32px vertical gaps. Desktop heading sizes are 80px Geist medium and 100px Instrument Serif italic. Mobile typography and the email form adapt to fit 390px screens; the 290px top padding remains intact.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Open the Vite server at `/motionsites-results/hr-saa-s-hero/`. Serve the contents of `dist/` at that same path. No deployment or push was performed. Dependencies are captured in `package-lock.json`; `node_modules/` is excluded from delivery.

## Validation

The production build was tested using Chromium and the existing Playwright Core installation in Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script serves only this project's built output, under the publication base, and checks desktop 1440×1000 and mobile 390×844. It verifies horizontal overflow, exact content spacing, font availability, video decoding/autoplay, flipped cover styling, pause/resume, required and malformed email validation, valid form feedback, and absence of browser script/console/HTTP errors. A separate reduced-motion check confirms the background video starts paused. Motion respects the user's reduced-motion preference.

Screenshots were visually reviewed and are saved as `screenshots/desktop.png` and `screenshots/mobile.png`. They are full-page captures at the required viewport sizes, with the actual video paused at two seconds for reproducibility. Mobile naturally scrolls vertically because the required 290px top padding is retained. Detailed measurements are in `screenshots/checks.json`.

## Assets and limits

- Video: downloaded unchanged from `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4` into `public/assets/hero.mp4`. Chromium decoded it at 1928×1072 and played it successfully.
- Fonts: actual Geist (400/500/600) and Instrument Serif italic files downloaded from Google Fonts. Original stylesheet URLs are recorded in `font-source.css`. Fonts and video are bundled locally; the delivered page makes no third-party requests.
- The optional design reference WebP was absent at the supplied location. Layout follows `PROMPT.md`; no visual-reference comparison could be performed.
- The prompt supplies no description text or specific review-brand artwork. Supporting description copy was written for this hero, and review marks were recreated using inline SVG/text. The requested headline, CTA, and review count are preserved.
- The signup form is a frontend demonstration with native email validation and explicit preview feedback. No account is created, no email is stored, and no backend service is configured.
