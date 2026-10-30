# AI Runtime

Static, single-viewport landing page for design `ai-runtime`. Document title: **Intelligence Designed To Evolve**. Built with HTML, CSS and vanilla JavaScript, following this project's TASK.md and PROMPT.md.

## Build and run

No runtime dependencies or framework. The dependency lockfile is committed as a project artifact; no node_modules directory is required.

```sh
npm ci
npm run check
npm run build
```

On this host, use the existing Node/Chromium Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run check && npm run build'
```

`dist/` contains the complete static site. Serve it at `/motionsites-results/ai-runtime/`. HTML, CSS, JS and local asset references are relative, so they work under that subpath. The build copies source files and assets without transformation.

## Verification

Run the browser checks against the built files:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script creates an ephemeral HTTP server inside the container at the specified subpath and uses real Chromium through the image's installed playwright-core. It checks desktop 1440×1000, mobile 390×844 and short mobile 390×650, video autoplay, final counters, page dimensions, headline fitting, navigation state, CTA hover and anchor, mobile menu links/overlay/Escape/resize closing, reduced motion, local fallback font and video recovery. It records JavaScript errors and failed network requests.

Evidence:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/mobile-menu.png`
- `screenshots/browser-report.json`

## Assets and recovery

- The video uses the exact required CloudFront URL as its primary source. `assets/background.mp4` is a byte-identical downloaded copy, used only if that remote source fails. The original video loaded and played in desktop and mobile Chromium checks.
- Inter 400/500/600, BubbledotICG-FinePos and Font Awesome 6.5.2 load from the exact specified CDN stylesheets. Font Awesome uses the specified integrity hash. No Bubbledot font files are stored locally. OnlineWebFonts attribution: [Web Fonts](http://www.onlinewebfonts.com/fonts), whose supplied stylesheet states CC BY 4.0.
- `fonts/GeistPixel-Circle.woff2` is the required fallback, downloaded from the official [vercel/geist-font repository](https://github.com/vercel/geist-font/blob/main/fonts/GeistPixel/webfonts/GeistPixel-Circle.woff2). The accompanying license is in `fonts/Geist-LICENSE.txt`. As a fallback, it is normally not fetched when Bubbledot loads; verification explicitly loads it.
- No original `assets/logo.webp` was supplied. The only brand mark source was this design's allowed `/home/opc/motionsites/assets/previews/ai-runtime.webp`. `scripts/recover-logo.cjs` isolates only the mark at source rectangle x=356, y=32, width=26, height=23, and writes a 52×52 WebP asset. It contains no page text, controls or background composition. The small source makes this a raster approximation of the original mark. All layout, copy, controls and animation are real HTML/CSS/JS.

To repeat the logo recovery, mount only the allowed reference read-only:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -v /home/opc/motionsites/assets/previews/ai-runtime.webp:/reference.webp:ro -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/recover-logo.cjs /reference.webp'
```

## Scope and limitations

This is the requested landing page. The prompt supplies no authentication, product, case-study or contact destinations; links target existing elements within this viewport, and menu navigation updates the active indicator. There is no authentication service or additional page. The background is moving footage, so captured frames vary over time. CDN availability remains external; Geist Pixel Circle is the local display fallback. Verification covers Chromium, not Safari or Firefox. No deployment or push was performed.
