# RIVR DeFi

Design ID: `rivr-defi-landing`.

A responsive RIVR landing page built with React, TypeScript, Vite, Tailwind CSS v4, Motion (`motion/react`), and Lucide React. Includes the full-screen video hero, glass yielders card, SVG inverted documentation corner, responsive metrics, white feature cards, video CTA, and footer. Motion entrances run once on view; reduced-motion preferences are respected by UI transitions.

## Run and build

The host environment uses Docker for Node and Chromium. From this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

With Node installed locally, use `npm ci`, `npm run dev`, or `npm run build`. The lockfile pins resolved dependencies. `node_modules/` is generated and excluded from version control.

The production output is `dist/`, with the configured public base `/motionsites-results/rivr-defi-landing/`. Serve it at that path. Nothing has been deployed or pushed.

## Browser verification

The production build was served from the required subpath in a temporary Docker container. Chromium/Playwright checked desktop **1440 × 1000** and mobile **390 × 844**:

- Both original background videos load, decode, and play muted inline.
- Helvetica loads successfully from its recovered local file.
- No page script errors, console errors, failed requests, or horizontal overflow.
- Book Demo, documentation, staking, audits, cross-chain, Launch App, Read Docs, and Discord controls open the expected dialogs; Escape and close controls dismiss them.
- Back-to-top navigation works. All feature cards were scrolled into view before screenshot capture.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and machine-readable `screenshots/browser-checks.json`. Screenshots are full-page captures at the stated viewport sizes. They show one instant of each animated video.

Reproduce using the provided server and browser script:

```bash
docker run -d --rm --name rivr-defi-check -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs'
docker exec rivr-defi-check node scripts/check.cjs
docker stop rivr-defi-check
```

## Assets and limits

Both exact CloudFront URLs from `PROMPT.md` remain the primary video sources in `src/components/Shared.tsx`. Identical MP4 files downloaded from those URLs are bundled under `public/assets/` and used if a primary source fails. No generated replacement imagery or screenshot backgrounds are used.

The prescribed Helvetica URL initially returned HTTP 403 to a basic Python request. Retrying with a browser User-Agent and onlinewebfonts Referer recovered the original WOFF2, WOFF, and TTF files. Those files are self-hosted; the specified font base remains in the font-face EOT/SVG sources. The successful WOFF2 means those legacy URLs are not needed by Chromium.

The optional reference `/home/opc/motionsites/assets/previews/rivr-defi-landing.webp` was absent. Visual implementation follows the supplied component specification; comparison to that reference could not be performed. Copy abbreviated by the prompt is completed with short related descriptions.

The prompt supplies no application backend, booking service, wallet integration, official community destinations, technical documentation, or audit reports. Relevant buttons therefore open accessible informational dialogs that explicitly describe preview limitations. No transactions, bookings, or external submissions are simulated. Metrics and claims are design copy from the prompt, not verified live protocol data.
