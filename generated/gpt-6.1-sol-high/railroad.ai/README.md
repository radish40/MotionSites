# Railroad.ai

Landing page built from this project's `PROMPT.md` using React, Vite, TypeScript, Tailwind CSS, framer-motion, lucide-react, and shadcn/ui-style HSL design tokens. Includes the original train-window background video, liquid-glass navigation and form, staggered blur animation, responsive typography, and accessible email validation.

## Run and build

With Node 22 installed:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

In the supplied environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The deployable static output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/railroad.ai/`. Preview at that path. No deployment or push was performed.

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

This serves the actual production build under its required subpath and uses Chromium through the image's installed Playwright. Checks cover desktop 1440×1000 and mobile 390×844, decoded and playing video, muted/loop/inline attributes, viewport overflow, Get Started focusing the email field, required email validation, valid form submission and local persistence, desktop navigation anchors, mobile navigation visibility, and JavaScript errors. Reports are saved in `screenshots/checks.json`. Screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; they capture the initial page after entrance animations. Both were visually reviewed.

## Assets and scope

- The exact original MP4 from the prompt was downloaded successfully, without modification, to `public/assets/railroad-background.mp4` and copied into the build. Source: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260317_100335_dc625816-c3c1-4b00-b93e-4cb301cf5ea5.mp4
- The exact Google Fonts import is included and loaded during browser checks. As specified, the actual text uses the system font stack rather than Instrument Serif or Barlow.
- The optional reference `/home/opc/motionsites/assets/previews/railroad.ai.webp` does not exist. The page was built from the written specification; no reference extraction or substitute imagery was needed.
- Only the requested hero exists. Navigation links resolve to anchors in that hero; no additional destination pages were specified.
- No waitlist backend was provided. The form validates email and saves it only in this browser's local storage, with an explicit status message. It does not register a remote subscription or send email.
- Reduced-motion preferences skip text entrance animation. Playback and rendering were checked in the supplied desktop Chromium engine with a mobile viewport; physical iOS/Android devices were not tested.
