# Sky Estate

Project ID: `sky-estate`. A luxury real estate landing page titled **Galaxy Home**, branded **Aether Lane**, built from this project's `PROMPT.md`.

Uses React 18, TypeScript, Vite, Tailwind CSS 3.4, Framer Motion 12, Lucide React, and locally served Google Inter Tight in weights 400, 500, 600, and 700. The three original Figma assets are downloaded unchanged into `public/assets/`. No image substitutes or screenshot-based page rendering are used.

The page includes the floating navigation, accessible animated mobile overlay, layered parallax hero, overlapping mountain landscape, character-by-character scroll reveal, two opposing infinite marquees, and staggered statistics. Navigation anchors refer to the corresponding existing sections. The stats section has a responsive minimum height to provide enough scroll distance for the final reveal characters. Reduced-motion preferences disable parallax, marquee animation, and smooth scrolling.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite's base is `/motionsites-results/sky-estate/`. Open that path on the local development or preview server. Production files are in `dist/`, including `dist/index.html`; serve the directory at the configured path.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

Dependencies are recorded in `package-lock.json`; `node_modules/` is excluded from version control.

## Verification

The real TypeScript/Vite production build completes. Chromium checks run against `dist/` at the configured subpath, using Playwright Core already installed in the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script starts an ephemeral HTTP server inside the container and closes it after checking. It verifies desktop 1440×1000 and mobile 390×844, image and font loading, horizontal overflow, hero parallax, text reveal through the final character, visible statistics, desktop anchor navigation, mobile menu opening, Escape dismissal, link navigation, and CTA mailto destinations. It collects browser exceptions, console errors, and failed requests. `screenshots/browser-report.json` records the results.

Screenshots:

- `screenshots/desktop.png` — full page at desktop width, after exercising animations.
- `screenshots/mobile.png` — full page at mobile width, after exercising animations.
- `screenshots/desktop-stats.png` and `screenshots/mobile-stats.png` — statistics in view.
- `screenshots/mobile-menu.png` — open navigation overlay.

The final rendered screenshots were visually reviewed. The dependency audit reports zero vulnerabilities.

## Limitations

The prompt provides no contact address or backend. “Get in touch” uses a `mailto:` draft with an Aether Lane inquiry subject and an empty recipient; configure the real recipient in `src/main.tsx` before publishing. No message is sent by the site or during verification, and launching an external email application is not browser-tested.

All requested images and fonts were successfully retrieved and served locally. The original PNGs total approximately 15 MB, retained to preserve the exact requested assets. Screenshots capture animation state at the time of capture; the text reveal reverses when scrolling upward. Validation covers Chromium at the two required sizes, not every browser or device. No deployment or push was performed.
