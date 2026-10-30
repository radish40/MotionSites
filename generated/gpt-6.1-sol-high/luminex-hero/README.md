# Luminex

A React landing page with a full-screen HLS film, glass navigation, and bottom-left hero content. Project ID: `luminex-hero`. Delivery status: **ready for review**, not deployed.

## Brief and implementation

`TASK.md` and `PROMPT.md` were read in full and retained unchanged. The complete design prompt specifies React, full-screen HLS video, a glassmorphic header, and bottom-left hero content. It supplies no exact wording, font, video URL, or additional interactions. The optional Luminex preview at `/home/opc/motionsites/assets/previews/luminex-hero.webp` was absent. The typography, copy, coastal direction, and brand mark are original choices for this brief; no reference-image fidelity claim is made.

Built with React 19, Vite 6, plain CSS, and hls.js light. All runtime assets are local. The video uses a real VOD HLS playlist and two four-second MPEG-TS segments, with native HLS support where available and MP4 fallback. Playback is muted and loops. Reduced-motion preference starts with a paused poster. The page includes pause/play, a mobile navigation menu, and accessible native dialogs for work, studio, and contact. Escape and close controls dismiss the dialogs and restore focus. Contact uses a demonstration `mailto:hello@luminex.studio` address; delivery and ownership of that address are not verified.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
```

The development URL includes `/motionsites-results/luminex-hero/`. The Vite base is configured to that exact path. Publishable output is in `dist/`, including `dist/index.html`, fonts, film segments, playlist, and fallback media. Serve it beneath that URL prefix.

The actual build used the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run build'
```

`package-lock.json` is retained. `node_modules/` is excluded from delivery. To regenerate the bundled media after installing dependencies, use `npm run prepare:media`. This runs the pinned `ffmpeg-static` executable against the included source video. The input is eight seconds long, so the script's 24-second upper bound produces the complete eight-second film.

## Assets and provenance

- Film: [Water Crashing Over The Rocks, Peter Fowler / Pexels](https://www.pexels.com/video/water-crashing-over-the-rocks-1093662/). Downloaded successfully from `https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4` into `public/media/coast-source.mp4`. Author/title also confirmed in [Pexels API documentation](https://www.pexels.com/es-es/api/documentation). The file was encoded locally to H.264 HLS; the poster is an isolated frame at three seconds. No page screenshot or reference video is used as the interface.
- Fonts: Manrope (400, 500, 600, 700) and DM Sans (400), downloaded from Google Fonts; original fetched stylesheet retained in `fonts-source.css`. Files are bundled locally. The display italic uses the system Georgia serif.
- Brand symbol, arrows, and favicon are project-native SVG.
- Asset acquisition issues: an initial Pexels discovery page returned HTTP 403; an initial candidate video URL returned HTTP 404. The final video download and font downloads succeeded. Python font fetching stalled and was replaced with bounded curl downloads. There are no failing asset requests in the final browser run.

## Verification

A real production build completed successfully. Browser checks ran against `dist/` at the configured subpath using Docker's Chromium and Playwright Core:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/check-browser.cjs'
```

The script starts a temporary local HTTP server in the same process and closes it afterward. It checks:

- Desktop 1440×1000 and mobile 390×844.
- Actual HLS manifest and segment requests, decoded 1920×1080 video, advancing time, and pause/play.
- Work, studio, and contact dialogs; Escape dismissal; mobile navigation.
- Reduced-motion paused startup and absence of horizontal overflow.
- No JavaScript/console errors and no failed HTTP asset requests.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/checks.json`, and `browser-build.log`. Both screenshots were visually inspected after improving the header contrast. Screenshots freeze the real video at three seconds using the playback control.

Limits: browser validation covers Chromium only. Native Safari HLS, physical mobile devices, and external email delivery were not tested. The film loops at its original cut; no seamless-loop claim is made. No server-side services are required or implemented. No deployment or push was performed.
