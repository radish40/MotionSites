# Orbis NFT

Design ID: `orbis-nft`. A four-section Orbis.Nft space collection landing page built with React, TypeScript, Vite and Tailwind CSS, with lucide-react icons. The implementation follows the supplied `PROMPT.md`: navy/cream/neon palette, Anton and Condiment typography, liquid glass, six CloudFront videos, responsive navigation/social controls, three rarity cards, and the final native-aspect video section.

## Run and build

With Node 22:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

In this host environment, use the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The completed static build is in `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/orbis-nft/`; visit that path when running the development or preview server. No deployment or push was performed. `package-lock.json` records the installed dependencies; `node_modules/` is ignored.

## Browser validation

The real production build was served inside a temporary Docker container and tested using `/app/node_modules/playwright-core` and `/usr/bin/chromium` from the existing image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run preview -- --port 4173 > /work/screenshots/server.log 2>&1 & server=$!; trap "kill $server" EXIT; node scripts/check-browser.cjs'
```

The script checks desktop 1440×1000 and mobile 390×844, document overflow, loaded fonts and videos, playback as each video enters view, navigation anchors, the creator link, object detail open/close, and FAQ open/Escape dismissal. It records JavaScript exceptions and failed requests. Screenshots are full-page captures at the specified viewport widths, with the original viewport heights used for layout.

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/browser-checks.json` — raw browser observations

Muted inline autoplay videos can be paused by Chromium while off screen; the script separately checks playback after scrolling each into view. Screenshots capture one animation instant, so they do not demonstrate motion by themselves.

## Assets and boundaries

All six videos use the exact supplied CloudFront URLs directly. Anton and Condiment load from the exact Google Fonts CSS URL in `index.html`. These external assets loaded during verification and require network access at runtime.

The prompt names `/texture.png` but provides no source image or URL. `public/texture.png` is an original subtle grayscale grain approximation, reproducible with `python3 scripts/create-texture.py`. Its fixed overlay uses the prescribed lighten blend mode, 0.6 opacity and cover sizing. The optional project preview `/home/opc/motionsites/assets/previews/orbis-nft.webp` was absent; no reference extraction or screenshot-based page rendering was used. Pixel matching against that preview could not be performed.

No project-specific social URLs, email recipient, checkout, contract, wallet or marketplace were supplied. Twitter/GitHub controls therefore open their platform homepages, and Mail opens an email composer with the project subject and no invented recipient. Buy NFT leads to the collection; card arrows show the corresponding animated object and rarity. See All Creators leads to the Orbis introduction. FAQ uses only information present in the prompt. These destinations are documented implementation assumptions, not a live minting system.
