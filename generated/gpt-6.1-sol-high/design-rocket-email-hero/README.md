# Email Marketing

Design ID: `design-rocket-email-hero`

Design Rocket Certificates email-style marketing page implemented from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, and lucide-react. Includes all provided copy, three original looping videos, Instrument Serif / Inter, numbered learning outcomes, CTA cards, and the complete footer.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/design-rocket-email-hero/` on the development or preview server. Production output is `dist/`, configured for that same base path. All three videos are copied into `dist/assets/`.

For this environment:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Installation and the final production build were actually completed. The first typecheck exposed a missing Vite type reference, which was corrected. Final TypeScript and Vite build passed. The dependency lock is included; node_modules is excluded from the handoff.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

This uses existing Playwright and Chromium inside the image, serving the built files temporarily at the required subpath. It closes the browser and HTTP server afterward.

Verified at 1440 × 1000 and 390 × 844:

- No JavaScript errors, failed network requests, or horizontal overflow.
- Desktop container: 640px wide, hero: 820px high. Mobile container: 358px wide, hero: 650px high.
- Both Google Fonts loaded successfully.
- All three videos decode and advance when visible, with muted, loop, autoplay, and playsInline enabled. Chromium pauses offscreen autoplay videos until scrolled into view.
- Enrollment, Get Started, and footer wordmark section navigation work.
- CTA hover changes color and moves up 2px; video hover scales to 1.03.
- Four learning steps and six labeled social links are present.

Full-page screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Detailed browser evidence: `screenshots/checks.json`. The screenshot script pauses videos at two seconds for consistent captures; the actual page plays normally.

## Assets and limitations

The three exact CloudFront videos from the prompt were downloaded successfully and saved without modification:

- `public/assets/hero.mp4` from `hf_20260419_064822_f120e48a-d545-45dd-a02d-facb07829888.mp4`.
- `public/assets/lead-ai.mp4` from `hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4`.
- `public/assets/roadmap.mp4` from `hf_20260417_110451_9f82b157-dc92-4a9f-a341-c25594ec20e1.mp4`.

All originated from `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/`, as specified in the prompt. Combined size is about 47 MiB. No substitute or extracted visuals were necessary. The optional design-specific reference preview was absent at the specified path, so visual verification uses the written specification and rendered page. Google Fonts remain external; browser loading succeeded in this run.

The prompt does not provide enrollment, social profile, legal, support, or mailing-list destinations. CTAs navigate between relevant local sections and do not complete registration or purchase. Social links open platform homepages. Privacy and Terms use unverified conventional Design Rocket URLs. Support and Unsubscribe open an unverified support email address, with an unsubscribe subject for the latter; they do not change subscription state. External destinations were not opened or submitted during checks. Replace provisional links with approved destinations before a real campaign.

Mobile overrides reduce content padding and heading sizes, tighten social spacing, and set a minimum hero height. Keyboard focus styles and reduced-motion transition support are included. Validation used Chromium with desktop and mobile viewport sizes, not physical devices or other browser engines.

`ready` means ready for management-session review. Nothing was deployed, pushed, or sent.
