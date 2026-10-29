# Build With Us

Design ID: `build-with-us`. A single-page Forma landing page implemented from `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS, and lucide-react. The supplied CloudFront video fills the rounded card, with the translucent navigation, serif headline accent, and responsive contact card above it.

## Build and preview

With Node.js 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 5173
```

Open `http://localhost:5173/motionsites-results/build-with-us/`. The production output is `dist/`, configured for `/motionsites-results/build-with-us/`.

On the supplied host, run from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The dependency versions are recorded in `package-lock.json`. No deployment was performed.

## Verification

A real production build passed TypeScript checking and Vite compilation. Browser verification uses the image's Chromium and `/app/node_modules/playwright-core`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 5173 > /work/screenshots/server.log 2>&1 & server_pid=$!; trap "kill $server_pid" EXIT; node scripts/browser-check.cjs'
```

Verified at desktop 1440×1000 and mobile 390×844: video autoplay, font loading, viewport layout, no horizontal overflow, contact CTA, required input validation, multi-select and deselect, disabled sending button, and success state after the one-second simulated submission. The desktop fits the viewport; mobile expands vertically to fit the content. Browser evidence is recorded in `screenshots/browser-checks.json`.

- `screenshots/desktop.png` and `screenshots/mobile.png`: initial page, full-page captures.
- `screenshots/desktop-success.png` and `screenshots/mobile-success.png`: submitted state.

## Assets and scope

The video uses the exact remote URL supplied in the prompt. Inter and Instrument Serif load through the required Google Fonts CSS import. These external assets were reachable during verification and require internet access. A local 1.7 KB Noto Color Emoji subset ensures the exact waving-hand character renders in Chromium; its SIL Open Font License is included at `public/fonts/OFL.txt`. The favicon reuses the provided logo geometry.

Submission is the requested one-second simulation; it does not send email or store project details. The email link uses `mailto:hello@forma.co`. No social profile URLs or secondary-page content were provided, so the social links open their respective platforms and the four navigation links use the contact anchor. The source includes accessible input names, pressed states for service buttons, and a live success status.
