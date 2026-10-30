# Portfolio Cosmic

Design ID: `portfolio-cosmic-hero`. A single-page portfolio for Michael Smith, built from `PROMPT.md` using React, Vite, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Framer Motion, hls.js, and React Router. The index name remains **Portfolio Cosmic**.

Includes the 2.7-second loading counter, rotating loading words, original cosmic HLS background, floating navigation, GSAP hero entrance, cycling roles, four-card bento grid, journal, pinned parallax gallery, stats, and video-backed marquee footer. Project, journal, exploration, and resume controls open animated dialogs with Escape dismissal, focus restoration, and keyboard focus containment. Navigation scrolls smoothly; the email CTA uses the specified address.

## Build and run

Run from this directory using the existing image's Node 22 and npm:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`dist/` is the complete static artifact, with `dist/index.html` as entry point. The configured public base is `/motionsites-results/portfolio-cosmic-hero/`. `package-lock.json` pins dependencies. `node_modules/` is excluded from delivery.

For development, add `-p 127.0.0.1:5173:5173` to that Docker command and run `npm ci && npm run dev -- --port 5173`. Open `http://localhost:5173/motionsites-results/portfolio-cosmic-hero/`.

## Assets

- Both videos use the exact specified Mux HLS stream. `public/assets/cosmic-poster.jpg` is a standalone frame retrieved from its official Mux image endpoint at 3 seconds, used before playback. No page screenshot is used as a background or page.
- Inter weights 300–700 and Instrument Serif regular/italic were downloaded from Google Fonts and stored locally. `font-source.css` preserves source URLs; `public/assets/fonts.css` serves local fonts.
- The prompt gives no project, journal, or exploration image URLs. Local Unsplash images were selected for the specified subjects. Exact URLs are in `public/assets/sources.json`. Run `python3 scripts/assets.py` to fetch again (requires Python and curl).
- The optional reference `/home/opc/motionsites/assets/previews/portfolio-cosmic-hero.webp` did not exist. No other design or reference was read.

## Browser validation

Real production-build checks use Chromium and the image's installed Playwright Core. The included server serves the required subpath:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs & server=$!; node scripts/check.cjs; code=$?; kill $server; exit $code'
```

Checks cover desktop **1440×1000** and mobile **390×844**: loading completion, fonts, role rotation, HLS playback, smooth work navigation, project details, journal reading, resume, exploration lightbox, Escape dismissal, contact navigation, email target, all image loads, horizontal overflow before/after scrolling, and uncaught script errors. Results are recorded in `screenshots/checks.json`.

Required screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional loading, contact, and full-page screenshots are included. Visual review covered typography, composition, section order, and responsive layout.

## Limits

The optional preview was absent, so comparison is against the written prompt. Journal structure is specified without article text, and no resume file or social handles are supplied. Journal/project descriptions are original demonstration copy; Resume shows an on-page summary using supplied portfolio facts; social links lead to the named platform homepages. The email address is used exactly as supplied; delivery was not tested.

HLS playback requires network access and was verified at both viewport sizes. Native Safari HLS and physical mobile devices were not tested. Reduced-motion CSS disables CSS loops and smooth scrolling; the specified GSAP scroll effects remain enabled.

Build succeeds with advisory Vite warnings about runtime bundle size and a public font stylesheet resolved at runtime. Browser checks confirm the stylesheet and fonts load at the required base path. Nothing was deployed or pushed, and no messages, extra sessions, or agents were used.
