# Card Swap

Design ID: `community-superdesign-card-swap`.

A React and TypeScript implementation of the supplied Card Swap Showcase: four image cards with GSAP perspective transforms, a four-second automatic cycle, elastic motion, hover pause, image zoom, and the original “Reply Animation” reload control. The supplied card titles and descriptions are preserved. The stack is scaled on small screens and positioned to keep the heading visible.

Built with Vite, Tailwind CSS and GSAP. The requested Framer Motion, Lucide React, clsx and tailwind-merge dependencies are included. The prompt does not specify a downloadable font; the page uses the system sans-serif stack with Inter when installed.

## Run and build

With Node 22:

```sh
npm ci
npm run dev
npm run build
```

The configured base is `/motionsites-results/community-superdesign-card-swap/`. Publishable files are in `dist/`, including `dist/index.html` and all four local images. No deployment was performed.

The environment used this isolated Docker command:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The production build is served under its actual configured subpath by `scripts/check.cjs`. Run the browser checks using the container's existing Playwright Core and Chromium:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Checks cover desktop 1440×1000 and mobile 390×844, four loaded images, automatic promotion, hover pause and resume, replay on desktop and mobile, horizontal overflow, mobile card bounds, heading clearance, console errors and failed requests. Results are saved in `screenshots/browser-checks.json`. Captures: `screenshots/desktop.png` and `screenshots/mobile.png`.

## Assets and limitations

The four exact Unsplash images supplied in PROMPT.md were successfully downloaded unchanged and are served locally. Their URLs and sizes are recorded in `asset-manifest.json`. No substitute assets or screenshot extraction were needed. The optional original preview WebP was absent, so visual validation is against the supplied source and written instructions. Dark theme tokens and responsive positioning fill in styles omitted by the source. Screenshots capture the initial stack; timed browser checks validate motion separately. Browser validation uses Chromium only.

The animation implementation retains the supplied props and adds timeline cleanup and an overlapping-cycle guard for React lifecycle safety. All changes and outputs are confined to this project.
