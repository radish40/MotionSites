# Cosmic

Design ID: `cosmic`. Brand: **COSMIQ.** Page title: **COSMIQ - What's Beyond**.

Implemented the supplied full-viewport cinematic hero using React 18, TypeScript, Vite 5, Tailwind CSS 3 and lucide-react. No additional runtime packages. Includes 40 deterministic twinkling stars, the supplied non-looping video at 1.56×, animated concentric circles, staggered headline reveal, foreground rock, responsive navigation, animated mobile menu and Share. Navigation uses anchors within this single hero because the prompt specifies no additional pages or sections. Share uses native sharing where available and clipboard otherwise.

## Run and build

Requires Node 22/npm, or the provided Docker image. All commands run from this project.

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

`npm run dev` starts Vite for development. Build output is `dist/`, with `dist/index.html` present. Vite's base is `/motionsites-results/cosmic/`.

To preview the built site with the included static server:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -p 4173:4173 \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs'
```

Visit `http://localhost:4173/motionsites-results/cosmic/`.

## Browser verification

Real Chromium checks run against the production build using the image's existing playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/serve.cjs & node scripts/check.cjs'
```

Passed at 1440×1000 and 390×844: actual video playback through `ended`, playback attributes, headline reveal, 40 stars, both circles, decoded rock image, loaded fonts, no document overflow, desktop links, clipboard Share, menu open and close, mobile navigation, Escape and focus restoration. No page script errors, failed requests or HTTP errors were observed. Inter loads when the mobile menu opens because it has no visible text in the closed mobile hero.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/mobile-menu.png`, and `screenshots/browser-checks.json`. Screenshots show the completed animation; the page itself is live React/DOM/video, not a screenshot.

## Assets and limitations

- The supplied CloudFront video downloaded successfully and is bundled unchanged as `public/assets/cosmiq.mp4`.
- The exact supplied rock URL returned **HTTP 401**, with `x-cld-error: cloud_name dy5er7kv5 is disabled`. Retrying the untransformed image and a combined Cloudinary transform also failed. The included `rock.png` is a transparent silhouette cut from the supplied video's final frame, aligned to that frame's dimensions to preserve the foreground depth effect. This is a documented approximation of the unavailable overlay. `scripts/extract-rock.cjs` reproduces the cutout from the video.
- All three required font links are retained in `index.html`. Fonts are also bundled locally. The supplied Black Mustang WOFF/WOFF2/TTF files are rejected by Chromium because the OS/2 table declares version 5 while containing only version 4 fields. `scripts/repair-font.py` corrects the local TTF's version marker and checksums, without changing glyphs or metrics. The original TTF is retained beside the repaired copy for reproducibility. Local Anton and Inter (300/400/500/600) are downloaded from Google Fonts.
- Black Mustang source attribution: [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), whose supplied stylesheet states CC BY 4.0. Original font stylesheet is preserved as `scripts/black-mustang-source.css`.
- Native OS Share UI was not automated; Chromium's clipboard fallback was verified on both viewports. Animation checks were performed in Chromium, not other browser engines.
- Installation reported two dependency audit advisories (one moderate, one high) in the requested Vite 5 toolchain. No forced major-version updates were applied.

Ready for management-session review. No deployment or push was performed.
