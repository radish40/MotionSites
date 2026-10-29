# Cinematic Landing Page

A single-page **Bakery Facilities** website built with React 18, Vite, TypeScript, Tailwind CSS, GSAP, ScrollTrigger, SplitText and Lottie. No Framer Motion. Design ID: `cinematic-landing-page`.

The page includes three supplied bakery films with scroll-driven elliptical transitions, animated typography, a responsive seven-category gallery, scroll-revealed company text, a partner marquee, four original animated Lottie icons, desktop dropdowns, a mobile accordion menu, enquiry dialogs, contact links and a downloadable product overview.

## Run and build

Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/cinematic-landing-page/`. Vite's base is fixed to that required path. The publishable output is `dist/`, including `dist/index.html`. No deployment was performed.

This host uses the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Dependencies are locked in `package-lock.json`; `node_modules` is excluded from the deliverable.

## Validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The reproducible check starts an isolated temporary HTTP server inside Docker and uses its installed Playwright Core and Chromium. It loads the production build at the exact base path. Check evidence is in `browser-checks.json` and `verification.log`.

Validated at desktop **1440×1000** and mobile **390×844**:

- All three videos decode, all four font families load, and all four Lottie SVGs render.
- Region selection, desktop product dropdown, both ellipse transitions, product dialog and Escape dismissal.
- Newsletter email validation, mobile hamburger/accordion and category navigation.
- Horizontal overflow checks at the hero and all mobile content sections.
- No uncaught browser script errors or failed asset requests.
- Brochure PDF responds successfully. No newsletter was submitted and no external messages were sent.

Primary screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`. Additional screenshots show the gallery, scroll transition, About section, partnering section, footer and mobile menu. Screenshots pause videos at 0.5 seconds for a stable view; normal page playback remains automatic, muted and looping.

## Assets and prompt gaps

- All three original CloudFront MP4s from PROMPT.md are downloaded unchanged in `public/assets/hero-{1,2,3}.mp4`. JPEG posters were captured from those films in Chromium. The films total roughly 68 MB; they are original full-resolution files.
- All requested Google Font families and weights are downloaded from the exact supplied Google Fonts stylesheet, then served locally through `public/assets/fonts.css`. No runtime Google Fonts dependency remains.
- No product or partnering image URLs were supplied. Locally downloaded Unsplash photos are used. Photo identifiers: `photo-1555507036-ab1f4038808a`, `photo-1509440159596-0249088772ff`, `photo-1488477181946-6428a0291777`, `photo-1509722747041-616f39b57569`, `photo-1499636136210-6f4ee915583e`, `photo-1556911220-bff31c812dba`, `photo-1627485937980-221c88ac04f9`. Sources follow `https://images.unsplash.com/{identifier}?auto=format&fit=crop&w=900&q=85` (partner background uses width 1800).
- No Lottie JSON files were supplied. Four original lightweight line animations are defined in source and rendered with `lottie-react`.
- The prompt references a full history paragraph "in code above", but that paragraph is absent. The provided opening is retained and completed with brief general bakery-service copy; this is editorial text for review.
- Office cities are supplied, but street addresses, local legal entity names and regional contact details are absent. Office blocks show the supplied cities and route contact enquiries to the supplied Hong Kong phone/email. No street addresses are invented.
- No official brochure was supplied. The functional download contains a clearly labeled website product overview, not an official catalogue.
- Only English copy was supplied. The 繁 control opens a Traditional Chinese contact notice; it does not pretend to translate the entire site.
- The newsletter action prepares a subscription request in the visitor's email app. There is no backend and no claim of automatic subscription. Legal dialogs contain concise site-specific information for review, not supplied corporate legal policies.
- External LinkedIn and WhatsApp destinations are links only; account ownership and response availability were not verified.
- The prompt gives conflicting mobile gallery rules. The final explicit breakpoint list is followed: one column below 400px, two columns from 400px to 999px, four from 1000px.

The build reports Lottie's upstream use of `eval`. `dependency-audit.json` records npm's audit of the prompt-prescribed dependencies; major-version migrations were not made. All work is contained in this project; no push or deployment was performed.
