# Scroll Landing Page

Design ID: `scroll-landing`. A WISA football landing page built with React 19, Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Motion, GSAP ScrollTrigger and Lucide React. No additional npm dependencies. Package versions use the ranges specified in `PROMPT.md`; `package-lock.json` records the installed versions.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run build
npm run preview -- --port 5173
```

The production URL is `http://localhost:5173/motionsites-results/scroll-landing/`. Vite's base is `/motionsites-results/scroll-landing/`; publish the contents of `dist/` under this path. `dist/index.html` and the local video are included. Nothing has been deployed or pushed.

The host used for this task has no Node/npm. The actual build command was:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm install && npm run build'
```

Use `npm ci` for repeat builds after installation. `node_modules/` is ignored and is not part of the deliverable.

## Implementation

The fixed video follows scroll progress from the page top to the specified footer threshold. The `video.seeking` guard prevents competing seeks; a `seeked` callback catches the final position, and an end offset of 0.04 seconds avoids decoder blank frames. The header moves out between 500 and 800 pixels. The page includes the hero, two 200-pixel spacers, GSAP word reveal and three-column content, and the specified glass footer. Navigation text and arrows use the supplied fly animations. Mobile layout keeps the same content with a smaller heading, stacked content and footer links. The desktop navigation is hidden on mobile as specified.

The original `src/index.css` content is preserved; responsive adjustments are in `src/layout.css`. Manrope and JetBrains Mono load from the exact Google Fonts import. The required model-viewer 3.4.0 module remains in the document head.

## Asset provenance and gaps

- The supplied CloudFront MP4 returned HTTP 200 and was downloaded intact. Original SHA-256: `bbbd41af048ea752f1f3fd985268015464654b42a5d4434f524a2c11e4190f3c`.
- Its video track is 3840×2160 HEVC. Chromium initially reported readyState 4 but videoWidth 0, displaying black. The same footage was converted to 1920×1080 H.264/yuv420p, without its unused audio track, using FFmpeg in a disposable container. The delivered file is `public/assets/wisa-scroll.mp4` (about 17 MB), copied to `dist/assets/`. No reference screenshot was used as a page background or embedded image.
- Conversion recipe: `ffmpeg -i original.mp4 -an -c:v libx264 -preset fast -crf 20 -vf scale=1920:-2 -pix_fmt yuv420p -g 12 -movflags +faststart wisa-scroll.mp4`. The shorter GOP supports seeking. `public/assets/provenance.json` and `screenshots/source-media.json` record source details.
- `PROMPT.md` refers to exact SVG path data “above,” but includes none. The four-path WISA mark was recreated using this project's visual reference; the wireframe globe is inline SVG. These are approximations.
- The prompt specifies the service paragraph styles but omits their words, and does not give the footer brand paragraph. Brief football-focused copy was supplied; the brand uses its supplied tagline.
- Actual ticketing, contact, social profile, newsletter and legal destinations were not supplied. Relevant navigation goes to existing sections; enquiry links use illustrative WISA mail addresses; social links use platform homepages. These are integration placeholders. No purchase, subscription, message or external submission was performed.

## Browser verification

Production `dist/` was served through Vite preview at the required subpath and tested with the installed Playwright Core and real Chromium from the supplied Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'sh scripts/serve-check.sh'
```

`npm ci` must have been run first. The test script uses `/app/node_modules/playwright-core` from that image; Playwright is not added to project dependencies.

Validated at desktop **1440×1000** and mobile **390×844**:

- Real 1920×1080 video frames load; video progress advances with scrolling and reverses back to zero.
- Loading screen clears, both font families load, and external font/model-viewer requests succeed.
- Desktop navigation fly animation, hero arrow animation, stadium section navigation, and footer About navigation work.
- Header leaves the viewport after the specified scroll interval; GSAP text reveals to full opacity.
- Every internal anchor resolves. No horizontal overflow at the hero, service section, footer entrance or page bottom.
- No page script errors, failed requests, or HTTP error responses in the final run.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, plus desktop/mobile program and footer views and a mobile footer-bottom view. Machine-readable observations are in `screenshots/browser-report.json`.

## Validation limits

This was Chromium verification, not Safari/Firefox or physical-device testing. Fonts and the required model-viewer module still need network access. Mail handlers and external social destinations were inspected but not submitted or verified as actual WISA accounts. The source's specified footer formula is preserved: at 1440×1000 the short footer cannot reach 20% from the viewport top before the document ends, so the final desktop scroll position displays approximately 10.49 of 11.04 seconds; mobile reaches the final usable frame. Readiness means ready for review, not published.
