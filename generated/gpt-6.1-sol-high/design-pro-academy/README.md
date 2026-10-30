# DesignPro Academy

A full-screen DesignPro product design education hero, implemented from this project's `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React.

## Run and build

With Node.js 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured base URL is `/motionsites-results/design-pro-academy/`. The complete static build is in `dist/`, including `dist/index.html`, local fonts, and the video fallback. Serve it at that base path.

The host used for this project has no Node installation. The actual build command was:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build'
```

Run `npm ci` in the same container before building on a clean checkout. Dependencies are locked in `package-lock.json`; `node_modules` is excluded from delivery.

## Implementation

- Exact supplied hero copy, circular brand mark, pill navigation, responsive hamburger menu, and enrollment CTA.
- The exact CloudFront video URL is the primary source, with autoplay, muted, looping, inline playback and cover positioning. An identical downloaded MP4 is the local fallback if the remote request fails.
- `src/ShinyText.tsx` uses Framer Motion to continuously sweep a 100-degree gradient from left to right over three seconds, using `#64CEFB` and white.
- Inter weights 400–700 are hosted locally. Fonts were downloaded from Google Fonts; source URLs are retained in `public/assets/inter-source.css`.
- Navigation and enrollment open accessible, dismissible information dialogs. Native dialog behavior provides focus containment and Escape dismissal. Mobile navigation exposes its expanded state and closes with Escape.
- Reduced-motion preferences stop the text sweep and pause background playback.

## Browser verification

The actual production build was served at its required subpath and checked using Chromium with Playwright Core in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Screenshots: `screenshots/desktop.png` (1440×1000) and `screenshots/mobile.png` (390×844). Machine-readable observations are in `screenshots/checks.json`.

Verified video decoding and active playback, local Inter loading, no horizontal overflow, no page script errors, enrollment opening/closing, Escape dismissal, mobile menu navigation, every desktop information link, and animated gradient progression. A separate browser context deliberately blocked the remote video and verified the local fallback and reduced-motion pause. Screenshots were visually reviewed.

## Scope and limitations

The optional project reference image was absent at `/home/opc/motionsites/assets/previews/design-pro-academy.webp`; the written prompt is the visual specification. No reference screenshot was used as page content, and no asset reconstruction was necessary. The supplied video returned HTTP 200 and decoded at 1924×1076 in both required viewport checks. No external asset requests failed during the normal checks.

Only the requested hero is implemented. No destination pages, application service, contact address, course details, instructor biographies, articles, or testimonial quotes were supplied. Navigation therefore opens small information panels; enrollment transparently states that the next program is opening soon. There is no data submission or invented enrollment completion. No deployment or push was performed. Browser checks cover Chromium, not Safari or Firefox; screenshot frames naturally vary with the looping video.
