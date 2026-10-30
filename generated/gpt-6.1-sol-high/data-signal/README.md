# Data Signal

Design ID: `data-signal`. Brand: **Vantage**. Document title: **Stop Digging Through Dashboards**.

A single static `index.html` with inline CSS and JavaScript, local media/fonts, no framework, and no runtime dependencies. The screen uses the exact supplied CloudFront MP4 as its first video source, the prescribed copy and desktop layout variables, glass demo controls, responsive navigation, and staggered entrance motion. There is no page scrolling.

## Build and run

The host has no Node/npm. Run from this directory:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/index.html` and `dist/assets/` are the complete static artifact. Assets use relative URLs and work under `/motionsites-results/data-signal/`. No Vite is used because the required stack is native HTML.

Local preview (no deployment):

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run serve'
```

Open `http://localhost:4173/motionsites-results/data-signal/`.

Browser checks (uses the image's existing Playwright and Chromium; no downloaded browser or committed node_modules):

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run check'
```

## Verification

See `screenshots/browser-checks.json` for the real browser run. The script starts and stops its own local server. It checks 1440×1000 desktop, 390×844 mobile, 768×1024 tablet, 360×640 short mobile, and 844×390 landscape. It verifies page bounds, loaded fonts, live video decoding and autoplay, completed entrance motion, compact navigation inert/focus/close behavior, demo opening and closing, CTA integration hooks, and reduced motion. JavaScript and console errors are captured.

Required captures: `screenshots/desktop.png` and `screenshots/mobile.png`. Additional capture: `screenshots/mobile-menu.png`. Screenshot evidence freezes the real MP4 at 2 seconds after checking playback; normal page playback remains animated. Media range requests canceled during seeking or page teardown can appear as `net::ERR_ABORTED` in the raw browser report; these are distinguished from decoding or asset failures.

## Asset provenance and limitations

- **Background:** the mandatory CloudFront URL is used verbatim. It returned HTTP 200 and was decoded in Chromium. `assets/background.mp4` is a byte-for-byte downloaded local fallback and is also used in the demo viewer. The prompt supplied no separate demo movie; the viewer therefore plays the supplied cinematic video with native controls.
- **Thumbnail:** no source image was supplied. `scripts/recover-thumbnail.cjs` extracts only the 160×160 smoke image at `(1052,658)` from this design's 1280×956 preview, `/home/opc/motionsites/assets/previews/data-signal.webp`. A feathered clone of nearby smoke removes the baked-in play circle; the live play control is a real button. This small central reconstructed region is approximate, and the recovered image is limited to the preview resolution. No page screenshot is used as background or layout. To regenerate, mount that single preview read-only at `/reference.webp` in the same Docker image and run `node scripts/recover-thumbnail.cjs`.
- **Fonts:** the prompt names “Reference Sans” and “Reference Display” but provides neither binaries nor URLs. Those exact variable fonts could not be located. The CSS retains the requested family names and weight ranges as replacement hooks, but the bundled binaries are **DM Sans** and **Bodoni Moda**, respectively. Both are variable fonts and are hosted locally; the headline is weight 500 and never uses Playfair Display. This is a disclosed visual approximation, not verified exact font fidelity. Sources: [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans), [Bodoni Moda](https://github.com/google/fonts/tree/main/ofl/bodonimoda). SIL Open Font Licenses are included in `assets/`.
- **Logo:** reconstructed SVG paths follow the specified circle, shard colors, and dimensions. Exact source paths were not supplied.
- **Responsive details:** the prompt refers to additional source short-height/landscape rules without including them. The included overrides preserve the described layout and were checked at the sizes above; no original mobile reference was available.
- **Navigation and conversion:** About/Services/Contact retain semantic fragment links; the brief provides no destination sections or URLs. Sign Up and Get Started emit `vantage:signup` and `vantage:get-started` window events. They are verified integration hooks, not a connected account service. No extra marketing sections, invented registration form, or backend is included.

`ready` in `result.json` means the static build is ready for management-session review with these disclosed limitations. It does not mean deployed or exact missing-font matching. Work was confined to this project; no other designs, agents, sessions, pushes, deployments, or messages were used.
