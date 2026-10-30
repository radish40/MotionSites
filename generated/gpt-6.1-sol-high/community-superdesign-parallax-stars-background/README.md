# Parallax Stars Background

Design ID: `community-superdesign-parallax-stars-background`.

A React + TypeScript implementation of the component supplied in `PROMPT.md`. The page displays “PURE CSS” above “PARALLAX PIXEL STARS” over a dark radial gradient. Three CSS box-shadow layers contain 700 one-pixel, 200 two-pixel, and 100 three-pixel stars, traveling upward over 50, 100, and 150 seconds. Each layer repeats at 2000px for a continuous loop. Star positions are randomized once per mount and memoized across renders.

The supplied dependencies are retained. Vite builds the application; ordinary CSS implements the supplied utility styles. The page has no controls, as in the prompt's `App.tsx`. All text and stars are rendered with real DOM/CSS.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
```

Open the dev server at `/motionsites-results/community-superdesign-parallax-stars-background/`. The production build is in `dist/`, including `dist/index.html`. Resource URLs use this same required base path.

On the provided host without Node:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` records the installed dependencies. `node_modules` is excluded from delivery.

## Component API

Import `ParallaxStarsBackground` from `src/Component.tsx`.

| Prop | Default | Behavior |
| --- | --- | --- |
| `title` | `"PURE CSS\nPARALLAX PIXEL STARS"` | Newline-separated title text |
| `speed` | `1` | Multiplies animation speed; zero pauses |
| `children` | None | Optional content below the title |
| `className` | Empty string | Additional container classes |

The title uses Lato Light, 10px letter spacing, 50px desktop type and 30px mobile type. The page honors the user's reduced-motion preference by stopping star animation. Decorative layers are hidden from accessibility APIs.

## Validation

The actual TypeScript check and Vite production build passed. Chromium checked the built static site through an HTTP server at the required subpath:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

- Desktop: 1440 × 1000; mobile: 390 × 844.
- Exact title, responsive font sizes, full viewport height, and locally loaded font verified.
- All three particle counts, animation durations, and matching repeat layers verified.
- Movement over time and reduced-motion behavior verified.
- No page overflow, browser console errors, script errors, or failed asset requests.
- No interactive controls are specified by the default app; the browser check confirms this.
- Screenshots manually inspected: `screenshots/desktop.png` and `screenshots/mobile.png`.
- Detailed results: `screenshots/browser-checks.json`.

Screenshots pause the animations at one second for a clear capture; the delivered page animates normally. Each new mount generates a new random star arrangement.

## Assets and limitations

Lato Light was successfully obtained from Google Fonts and bundled as `public/fonts/lato-light.ttf`, so the delivered site needs no external asset requests. `font-source.css` preserves the downloaded font declaration; its source is `https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap`. The font file came from `https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh7USew8.ttf`. The SIL Open Font License is included at `public/fonts/OFL.txt`, obtained from the Google Fonts repository.

The optional design preview `/home/opc/motionsites/assets/previews/community-superdesign-parallax-stars-background.webp` was absent. Visual implementation follows the complete supplied source; comparison against that preview was therefore unavailable. No screenshot-derived assets were used. Browser validation used Chromium, not physical mobile hardware. The 2000px particle field follows the original implementation and is intended for the specified viewport sizes.

Status `ready` means available for acceptance review. This project has not been deployed or pushed.
