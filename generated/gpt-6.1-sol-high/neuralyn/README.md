# Neuralyn

Dark analytics SaaS landing page built from this project's `PROMPT.md` using React, Vite, TypeScript, Tailwind CSS, Framer Motion, and a local shadcn/ui Button implementation (Radix Slot, CVA, clsx, tailwind-merge). The Services menu uses Radix Dropdown Menu. Inter 400/500/600/700 and Instrument Serif regular/italic are bundled from the requested Fontsource packages.

The two sections include the specified copy, liquid-glass announcement, video-backed dashboard preview, entrance animations, hero parallax, sequential testimonial word reveal, and author row. Navigation links hide on mobile. Reduced motion disables entrance/parallax effects and video autoplay. An empty 50vh scroll runway allows the last testimonial word to reach the specified `end center` scroll offset.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The required production base is `/motionsites-results/neuralyn/`. `dist/index.html` and all published resources are built and included. Serve `dist/` mounted at that URL prefix; all media and fonts are local.

The actual build in this environment used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build'
```

`package-lock.json` is included. `node_modules/` is ignored and is not a deliverable.

## Browser validation

The reproducible checker serves the actual `dist/` under its production prefix inside a temporary container, using the image's Chromium and Playwright Core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

Screenshots:

- `screenshots/desktop.png` — 1440 × 1000
- `screenshots/mobile.png` — 390 × 844
- `screenshots/desktop-reviews.png` and `screenshots/mobile-reviews.png` — testimonial at the end of scrolling
- `screenshots/checks.json` — asset, font, video, overflow, interaction, reduced-motion, and browser error results
- `screenshots/build.log` — real production build output

Checked Sign In validation/submission and Escape dismissal, desktop Services dropdown, Contact submission, CTA scrolling, testimonial word opacity changes, image decoding, local font loading, and video playback. Desktop and mobile have no horizontal overflow, script/console errors, or failed asset responses in the final run.

## Asset provenance and limitations

The supplied reference path `/home/opc/motionsites/assets/previews/neuralyn.webp` does not exist. No other project or design reference was read. The prompt lists four PNG filenames without providing their source URLs; exact original appearances could not be recovered or compared.

- `public/assets/hero-background.mp4`: downloaded successfully, unchanged, from the exact CloudFront URL in `PROMPT.md`.
- `public/assets/hero-dashboard.png`: original, locally authored analytics preview, rasterized from the isolated dashboard element in `scripts/asset-source.html`. Its data, icon shapes, and layout are approximations because the original image is unavailable. It is used only as the requested dashboard image; the page itself is real React DOM.
- `public/assets/logo.png`: original N monogram rendered from the isolated SVG in `scripts/asset-source.html`; an approximation of the unavailable logo.
- `public/assets/quote-symbol.png`: locally rendered isolated quotation mark; an approximation of the unavailable original.
- `public/assets/testimonial-avatar.png`: substitute portrait downloaded from `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=faces`, re-encoded as PNG using browser canvas. This is illustrative, not a verified portrait of the named testimonial author.

To regenerate the three drawn assets and re-encode the existing portrait, run `node scripts/create-assets.cjs` inside the same Docker environment, then rebuild. Source and generated assets are entirely inside this project.

The supplied prompt does not define authentication, a contact backend, or a signup destination. Sign In and Contact use accessible native dialogs with local form validation and explicit preview-only results; no data is sent or stored. The main CTA scrolls to the dashboard preview. No deployment, push, external messages, agents, or additional sessions were performed. `ready` means ready for review, not deployed.
