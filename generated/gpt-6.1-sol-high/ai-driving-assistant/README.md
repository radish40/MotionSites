# AI Driving Assistant

Design ID: `ai-driving-assistant`. Page brand: **Auren — Your car. Its mind.**

This project implements the full HTML design in `PROMPT.md`: the responsive glass header, gradient hero, supplied SVG branding, small driving-video preview, “Hands Off.” typography, email form, pinned GSAP video expansion and scrubbing, “Effortless.” / “Anywhere.” transitions, animated voice waveform, route drawing, and checkpoint animations. The original copy, responsive rules, timeline, and reduced-motion treatment are preserved.

The stack is native HTML, CSS and JavaScript with **GSAP 3.12.5 / ScrollTrigger**. Inter Tight, Orbitron and JetBrains Mono, both scripts, and the exact supplied MP4 are stored locally in `assets/`. `asset-report.json` records their original URLs and sizes. No external runtime requests are needed. A small favicon derived from the supplied brand shape avoids a browser favicon 404.

## Build and preview

With Node 22/npm installed:

```sh
npm ci
npm run build
npm start
```

Open `http://localhost:4173/motionsites-results/ai-driving-assistant/`. The preview server supports byte ranges for video seeking. `dist/` contains the complete static deliverable; deploy its contents at `/motionsites-results/ai-driving-assistant/`. Asset paths are relative and work at that prefix. No deployment was performed.

On this host, Node/npm and Chromium are provided by the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && npm run check'
```

To preview with Docker, run the same image with `-p 4173:4173` and `npm start` as its command. No application packages need installation; the dependency lockfile is included. The browser check uses `/app/node_modules/playwright-core` and `/usr/bin/chromium` from that image.

## Verification

`npm run check` starts a temporary local server, exercises Chromium, writes `browser-checks.json`, and saves:

- `screenshots/desktop.png` — 1440×1000 hero.
- `screenshots/mobile.png` — 390×844 hero.
- `screenshots/voice.png` — expanded video and waveform.
- `screenshots/route.png` — completed route and checkpoints.

Checks cover loaded fonts/video, fullscreen expansion, both story words, waveform, route checkpoints, video scrubbing, reverse scroll, mobile header layout, email-format validation, reduced-motion blur behavior, horizontal overflow, script/console errors, failed requests, and external runtime requests. Desktop and mobile screenshots were also visually inspected.

## Scope and limitations

The prompt's Service/About/Contact labels, menu button and Log In button do not specify destinations or actions; their supplied presentation is preserved. The email form retains the supplied no-navigation submission and native email-format validation. It does not collect, store, or send addresses. No authentication or waitlist service was invented. Reduced-motion mode follows the supplied implementation: it removes blur/scale/flyby effects but retains scroll scrubbing. The scroll story intentionally spans 1200 viewport heights, as specified.
