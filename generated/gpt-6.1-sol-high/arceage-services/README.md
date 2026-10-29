# Arceage Services

Responsive services section built with React 19, Vite 6, Tailwind CSS 4 and Motion (`motion/react`). Includes the reusable scroll-triggered character Typewriter, three animated Lottie illustrations, the specified service copy, Instrument Serif italic accent, and desktop/mobile schedule buttons. A minimal contact anchor makes both buttons functional; no booking backend was requested.

## Run and build

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The production base is `/motionsites-results/arceage-services/`. Deployable files are in `dist/`, including `dist/index.html`. Nothing has been deployed or pushed.

On this host, use the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.npm-home -e npm_config_cache=/work/.npm-cache -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser validation

```bash
docker run --rm -u 1000:1000 -e HOME=/work/.browser-home -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves the real production build at its configured subpath and uses Chromium with Playwright. It checks desktop 1440×1000 and mobile 390×844, document width, image loading, all three Lottie SVGs, fonts, script errors, and both responsive buttons scrolling to and focusing contact. It scrolls through the section to trigger reveals before capturing full-page screenshots.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/checks.json`

## Assets and limitations

All four exact supplied GitHub assets returned HTTP 404 during implementation:

- `https://github.com/dsMagnatov/Acreage-landing-assets/blob/main/1.jpg?raw=true`
- `https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/curry.json`
- `https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/tractor.json`
- `https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/beetle.json`

The direct raw `main/1.jpg` URL also returned 404. The original visual assets therefore could not be reproduced exactly. The page uses a locally saved agricultural field photograph from `https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=90` and three original local Lottie line illustrations. Their editable generator is `scripts/create-icons.py`. No original preview screenshot is used.

The exact requested Google Fonts import remains in global CSS; fonts require network access. The local fallbacks do not need external requests. A subtle dark overlay keeps the replacement photograph readable.

The build succeeds with upstream warnings about `eval` in the required Lottie player and a JavaScript chunk over 500 kB. Dependencies are locked in `package-lock.json`. Ready means available for review, not published.
