# BookedUp

A responsive growth-agency hero built from `PROMPT.md` with React, TypeScript, Tailwind CSS v4, motion/react, and lucide-react. It includes the requested typography, orange glow components, client avatars, consultation cards, and two animated marquee tracks at tablet sizes.

## Run and build

Requires Node 22 and npm. All commands run from this directory.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured public base is `/motionsites-results/bookedup/`. The complete static build is in `dist/`, including `dist/index.html`. Serve `dist/` at that prefix.

On the supplied host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Verification

`browser-check.cjs` serves the real production build at the configured subpath and runs Chromium through the image's existing playwright-core installation:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

Checks cover desktop 1440×1000, mobile 390×844, and tablet 820×1000; horizontal overflow; loaded fonts and avatars; moving marquee tracks; both CTA dialogs; closing by button and Escape; script and console errors; failed requests; and reduced motion. Results are saved in `screenshots/checks.json`. Full-page visual captures are `screenshots/desktop.png` and `screenshots/mobile.png`.

The five-card cycle measures exactly 1200px and repeats the same rotations, matching the requested 40-second, 1200px motion without a reset jump. The second track appears only on tablets. Reduced-motion users receive stationary cards and no pulsing animation.

## Assets and limitations

The exact four Unsplash URLs remain in `AVATARS` in `src/App.tsx`; their downloaded images are bundled locally. Both requested remote font CSS imports are retained, with local copies of SK Reykjavik Rounded Regular and Inter as the final font-face definitions, so rendering does not depend on remote font files. All local asset requests passed verification. `font-source.css` and `inter-source.css` preserve the source responses. Remote imports register additional unused font faces; validation checks that the actual local faces are loaded rather than requiring every remote face to load.

Typography: [SK Reykjavik Rounded Regular / Web Fonts](https://www.onlinewebfonts.com/fonts), supplied by the prompt's OnlineWebFonts source with its CC BY 4.0 attribution notice; [Inter / Google Fonts](https://fonts.google.com/specimen/Inter). Portraits: [Unsplash](https://unsplash.com/), exact photo sources recorded in `AVATARS`.

Both CTAs open accessible native preview dialogs. No calendar, video, contact endpoint, or booking backend was supplied, so the dialogs clearly state that consultation booking is not connected. No forms submit data. This is a static design deliverable, not a live booking service. No deployment or push was performed.
