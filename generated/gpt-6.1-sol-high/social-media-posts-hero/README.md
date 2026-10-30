# Social Media Posts

Design ID: `social-media-posts-hero`. A React + TypeScript + Vite + Tailwind implementation of the six animated social media cards in `PROMPT.md`, with Lucide icons, seven Google Font families, glass treatments, text entrance animations, and six original locally stored videos.

## Run and build

Requires Node 22 and npm. Run `npm ci`, then `npm run dev`. Build with `npm run build`; the static output is `dist/`. The configured public base is `/motionsites-results/social-media-posts-hero/`.

On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

No deployment or push was performed. The dependency lockfile is included; `node_modules/` is a local build dependency and is excluded from version control.

## Verification

Run browser checks against the actual production output:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check-browser.cjs'
```

The script uses the image's existing Chromium and Playwright, starts a temporary HTTP server with video range support, and closes it on completion. It checks desktop 1440×1000 and mobile 390×844; card dimensions, spacing and rounded corners; video decoding and autoplay; page errors; font loading; button hover/focus; and the custom fifth-video replay. It saves `screenshots/desktop.png`, `screenshots/mobile.png`, and detailed measurements in `screenshots/browser-checks.json`.

The fixed three-column 384px grid is preserved on mobile as required by the prompt. Horizontal and vertical scrolling occur inside the outer container; all six cards remain reachable. The document itself has no horizontal overflow. The Learn More button has hover, active, and keyboard focus feedback. No destination, modal, or additional product behavior was specified, so clicking it does not navigate.

## Assets and limitations

All six exact source MP4s were downloaded successfully and are shipped under `public/media/`. `asset-report.json` records their source URLs and download results. `scripts/download-assets.py` reproduces the download attempts using curl. Card five uses a React ref/effect and requestAnimationFrame for a 0.5-second fade at both ends and restarts after 100ms without native looping.

The original signed CleanShot background URL returns HTTP 403. Attempts with the signature removed and with a download query also return HTTP 403. The optional reference `/home/opc/motionsites/assets/previews/social-media-posts-hero.webp` is absent, so neither the original background nor a reference-derived extraction was available. `public/bg.jpeg` is an explicitly approximate neutral gray/green gradient, generated locally by `scripts/create-background.cjs`; it is not the original photograph. The full-page image uses cover/center/no-repeat as requested. Replace this JPEG with the recovered original to restore full background fidelity. No screenshot or video of a complete page is used as the interface.

Google Fonts is loaded through one link in `index.html` as requested and therefore requires network access. The screenshots are captures of the real running page; video frames can differ on subsequent captures. The missing visual reference prevents a pixel-for-pixel reference comparison.

The final browser run passed all assertions. The replay check pauses the other five videos after the desktop screenshot to isolate seek/restart timing under headless Chromium. Two `net::ERR_ABORTED` media range requests were recorded during that explicit seek; the fifth video subsequently restarted, advanced, and faded in successfully. There were no script errors or failed font requests. Mobile checks recorded no failed requests. These details remain visible in the browser report rather than being filtered out.
