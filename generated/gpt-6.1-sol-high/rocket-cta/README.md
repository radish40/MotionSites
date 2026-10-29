# Rocket CTA

React 18 + Vite + TypeScript implementation of the supplied Rocket CTA design (`rocket-cta`), using TailwindCSS, Framer Motion, `clsx` + `tailwind-merge`, Inter, Instrument Serif, and Material Symbols Outlined.

Includes the exact supplied copy, frosted dashboard frame, responsive Velorah video preview, animated CTA label, functional message composer, entrance animations, and independent dashboard/grass parallax. Text and controls are real DOM elements.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/rocket-cta/` on the development/preview server. Production files are in `dist/`, configured for this subpath.

On the supplied host, from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build && npm run check:browser'
```

The browser check uses the image's existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`. It starts a temporary local HTTP server for the production build and closes both server and browser afterward. Dependencies are locked in `package-lock.json`; `node_modules` is excluded from the deliverable.

## Validation

TypeScript and the Vite production build pass. Chromium checks ran against `dist/` at the configured subpath:

- Desktop 1440×1000 and mobile 390×844: exact main heading, loaded fonts, active video playback, loaded foreground fallback, correct chat visibility, and no horizontal overflow.
- CTA label slides on hover; button accepts keyboard focus.
- Desktop chat: Enter sends, empty Enter is ignored, Shift+Enter adds a newline, and the send button appends a user message plus a canned assistant reply and clears the composer.
- Parallax verified at the same widths using shorter viewport heights (700 desktop / 600 mobile) to provide scroll travel.
- No uncaught JavaScript errors. Expected Cloudinary HTTP 401 resource errors are recorded; the local foreground fallback succeeds.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Evidence: `screenshots/browser-report.json`. Both final screenshots were visually inspected.

## Asset recovery and limitations

The exact Cloudinary URL returns HTTP 401 with `cloud_name dy5er7kv5 is disabled`. The untransformed versioned URL and unversioned original also return 401. The page first requests the exact required external URL, then switches to `public/assets/grass-recovered.png` on failure.

Only the isolated grass foreground was extracted from this design's authorized reference `/home/opc/motionsites/assets/previews/rocket-cta.webp`. A reproducible copy is retained at `scripts/rocket-cta-reference.webp`, never included in the production build. `scripts/recover-assets.cjs` crops the 640×148 region starting at y=320, masks the neutral background at the top edge, and exports an alpha PNG. No page text, controls, or dashboard pixels appear in the recovered asset. Regenerate it with:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/recover-assets.cjs'
```

Recovered grass has lower resolution than the unavailable source and approximate edge transparency. Original full-resolution fidelity cannot be verified. The exact CloudFront video plays directly with the requested attributes. All specified Google Fonts loaded in Chromium; font/video availability depends on their hosts.

Chat uses the requested canned response; no AI service is connected. No destination or navigation behavior was supplied for the CTA/Velorah preview controls, so none is invented. Nothing was pushed or deployed.
