# Impressive Hero

Design ID: `impressive-hero`. A fullscreen VEX hero built with React 18, TypeScript, Vite, and Tailwind CSS using its default theme. Includes the specified background video, liquid-glass navigation and tagline, character heading transitions, delayed fades, and responsive sizing. No extra runtime libraries.

## Build and run

Requires Node 22.12+ and npm:

```sh
npm ci
npm run build
npm run dev
```

The build outputs `dist/index.html` and all required assets. The configured public base is `/motionsites-results/impressive-hero/`. Open that path on the dev server, or use `npm run preview` after building.

On this host, the actual build used:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

Production build passed with TypeScript checking. The Docker image's Playwright Core and Chromium tested the built files at the actual public base, at 1440×1000 and 390×844. Video autoplay, muted/loop flags, decoded 1920×1080 frames, heading completion, desktop/mobile navigation visibility, hover color changes, anchor clicks, chat button clicks, and horizontal overflow checks passed. No browser console or script errors were recorded. Installation reported zero dependency vulnerabilities.

Reproduce the browser checks after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

See `screenshots/checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`. Screenshots use the actual video paused at 3 seconds for reproducible stills; normal page playback loops continuously. Both screenshots were visually reviewed. The mobile heading has an extra 8px of room per side to keep the final period with its line at 390px.

## Assets and limitations

- The exact prompt video returned HTTP 200 and was downloaded unchanged to `public/assets/hero.mp4`, then bundled into `dist/assets/hero.mp4`. Original source: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4 . No external network request is needed for playback.
- The optional project preview `/home/opc/motionsites/assets/previews/impressive-hero.webp` was absent. No reference extraction or substitute artwork was used.
- Uses the exact system font stack: Helvetica Neue, Helvetica, Arial, sans-serif. Font availability depends on the viewing OS; no external fonts are required.
- The prompt supplies no chat endpoint or separate navigation sections. Both Start a Chat buttons are visual controls with no external action. Navigation links and Explore Now link to the existing bottom tagline. No additional pages or chat interface were invented.
- Browser validation covers Chromium at the two required sizes, not every device or browser.
- Ready means ready for review. Nothing was deployed or pushed.
