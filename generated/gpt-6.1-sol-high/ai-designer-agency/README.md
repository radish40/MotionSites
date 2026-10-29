# AI Designer Agency

Single-page VIRALMEDIA agency site implementing `PROMPT.md`. Project ID: `ai-designer-agency`.

Built with React, Tailwind CSS, Framer Motion, hls.js, and Vite. Includes the seven specified sections, liquid-glass controls, Barlow and Instrument Serif, word-by-word scroll reveal, animated project previews, video backgrounds, and responsive layouts.

## Build and run

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The app uses `/motionsites-results/ai-designer-agency/` as its base URL. Open that path on the Vite server. `dist/` is the complete static output and includes `index.html` and locally stored media.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

## Browser verification

The checks run against the built `dist/` files at the required subpath, using the image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

`browser-report.json` records desktop 1440×1000 and mobile 390×844 results: script errors, failed requests, image and font loading, video readiness, horizontal overflow, Get Started navigation, CTA destinations, required email validation, and subscription feedback. Screenshots include `screenshots/desktop.png` and `screenshots/mobile.png` (full page), plus viewport captures of the hero, about, work, and CTA sections. Full-page captures show the about text at the initial scroll-dependent opacity; it reveals during scrolling.

## Assets and limitations

- The exact supplied hero MP4, four GIF previews, and three pravatar images are stored locally. `asset-report.json` lists their original URLs; `fetch-assets.py` can fetch them again.
- The exact CleanShot showcase URL returns HTTP 403. Retrying with browser headers did not resolve it; Chromium also blocks it with `ERR_BLOCKED_BY_ORB`. The original URL is retained and falls back to the locally stored supplied hero video. The original showcase footage cannot be reproduced while that source is unavailable.
- The exact Mux HLS URL is used through hls.js, with native HLS fallback. It requires network access, as do the Google Fonts stylesheet and fonts. Both fonts and HLS playback were checked in Chromium. Safari native playback was implemented but not tested on Safari.
- A large-chunk build advisory may be emitted for the HLS library; it does not prevent a successful production build.
- No backend, mailing service, booking calendar, verified agency email address, social profile URLs, blog content, or legal pages were supplied. Subscription and project/call requests open the user's email client using `hello@viralmedia.agency` as a demo destination. No email is sent automatically and no subscription is claimed to be saved. Replace this address before using it commercially. Blog, careers, privacy, and terms footer links create relevant email requests; the header Blog link reaches the Company links. Social links point to their respective platform homepages.
- Reduced-motion settings disable background autoplay and smooth scrolling. No deployment or push was performed.
