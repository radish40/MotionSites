# Viktor Portfolio

Design ID: `viktor-portfolio`. A cinematic two-page portfolio for **Viktor-O**, with a modern architect introduction and the **Projecty Engine** project detail page.

Implemented with React 19, Tailwind CSS 4, Vite, `motion/react` (AnimatePresence and entrance animations), and lucide-react. Orbitron, Space Grotesk, and JetBrains Mono are bundled locally. The interface includes the technical specifications, glass project card, capability tags, expandable project description, architecture/performance blocks, and circular navigation controls. Mobile video backgrounds occupy 50vh and fade into the page content. Text and controls are real DOM elements.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The complete static deliverable is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/viktor-portfolio/`; serve the output at that path. The two views use `#home` and `#project`, supporting browser history and direct links without server rewrites. With one project specified, both circular arrows return to the home view.

## Assets

The exact two CloudFront MP4 files specified in PROMPT.md were downloaded unchanged to `public/assets/hero.mp4` and `public/assets/project.mp4`. Both play muted, inline, looped, with automatic preloading. The specified `https://picsum.photos/seed/tech/200/200` image was downloaded to `public/assets/tech.jpg`; the supplied seed resolved to a cloud photograph. It is displayed as the small project thumbnail with grayscale styling.

Font CSS was obtained from Google Fonts for all requested families and weights. Original CSS is retained as `public/assets/fonts-source.css`; `fonts.css` references the downloaded font files. Runtime assets require no external network requests.

The supplied `/home/opc/motionsites/assets/previews/viktor-portfolio.webp` was inspected as this design's visual reference. No reference screenshot or extracted page image is used in the implementation. No asset recovery or substitutes were necessary.

## Validation

Production build completed successfully. Browser validation uses the image's Chromium and existing Playwright installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves the actual `dist/` files temporarily on port 4173 inside its container, then closes the server. Checks cover desktop 1440×1000 and mobile 390×844, both pages, video readiness and playback, font availability, horizontal overflow, Next Project, View Project, Read More/Read Less, Back Home, both circular arrows, direct project links, and the reduced-motion video preference. Script errors, console errors, failed requests, and HTTP errors are recorded in `screenshots/checks.json`.

Screenshots are full-page captures taken at the requested viewport sizes:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-project.png`
- `screenshots/mobile-project.png`

All four compositions were visually inspected. Reduced-motion preferences stop background autoplay. Selection and keyboard focus styles are included.

## Limits

Validated in the available headless Chromium browser; Safari, Firefox, and physical devices were not available for testing. Mobile autoplay remains subject to device/browser power-saving policies. Supplementary descriptive copy and technical values were authored where the prompt supplied no exact wording. The site is ready for management-session acceptance; it has not been deployed or pushed.
