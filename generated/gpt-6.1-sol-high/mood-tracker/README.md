# Mood Tracker

Soul Canvas is a React wellness app mockup with three realistic iPhone frames: daily check-in, mood patterns, and a mood log. Built with Vite, TypeScript, Tailwind CSS, and lucide-react using the layout, copy, video assets, avatar, font, and staggered animations from `PROMPT.md`.

The desktop view presents all three screens side by side. Mobile stacks the phones vertically. Choose a mood, enter notes, adjust vitality from 1 to 5, and press Done to save a check-in. Saved entries are available in history and search. The period selector switches between today's prompt and a count of check-ins over the last seven days. The information, profile, and suggestions controls open in-phone panels; back and navigation controls move between phones.

## Build and run

Requires Node.js 22 and npm, or the supplied Docker image. All commands below run from this project directory.

```sh
npm ci
npm run build
npm run dev
```

Docker build on the provided host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` contains the complete static build. Vite's base is `/motionsites-results/mood-tracker/`. To inspect the built version locally:

```sh
python3 serve.py
```

Open `http://localhost:4173/motionsites-results/mood-tracker/`. This is a local verification server, not a deployment.

## Browser verification

The reproducible Chromium checks use the image's existing Playwright installation:

```sh
docker run --rm --network host -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 browser-check.cjs
```

The script checks desktop 1440×1000 and mobile 390×844, phone content clipping, horizontal page overflow, video playback, font loading, period switching, information panel, mood selection, notes, energy boundaries, saving, history, search, suggestions, and persistence after reload. It records browser errors and failed requests in `screenshots/browser-checks.json`. Chromium cancels some MP4 transfers while seeking, looping, or reloading; these `ERR_ABORTED` entries are retained in the report. All three videos are separately checked for successful playback with no media errors. Initial-state screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`; the mobile screenshot captures the full vertically stacked page at a 390 px width, temporarily extending the capture viewport so Chromium paints every frosted card; interactions and overflow checks run at 390×844. Videos are paused at the same early timestamp only for screenshot capture.

## Assets and limits

All three exact CloudFront MP4s and the Pexels avatar supplied in the prompt are copied to `public/assets/` and included in the build. The unmodified videos total approximately 126 MB. `capture-posters.cjs` generated lightweight JPEG fallback posters directly from these videos. The requested font stylesheet link remains in the document head; a local copy of the same WOFF2 font takes precedence for rendering. An earlier browser run encountered a timeout while requesting the provider’s remote WOFF file; matching the local font-face definition to the provider’s regular face removes that remote font-file dependency. The requested external stylesheet itself remains a network dependency.

Font: [Helvetica Neue ME via OnlineWebFonts](https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME). Font provider attribution: [Web Fonts](http://www.onlinewebfonts.com/fonts), CC BY 4.0 as stated in its stylesheet. Avatar: [Pexels source photo](https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100). Video source URLs are retained in `PROMPT.md`.

Check-ins use this browser's local storage, with no backend or account service. Pattern percentages are the fixed mockup values requested in the design. Storage and browser autoplay settings can affect persistence and video playback; posters remain available. Chromium may pause offscreen videos on the vertically stacked mobile page, so browser checks verify each video while its phone is visible. The prescribed fixed desktop phone dimensions can require horizontal scrolling on tablet-width windows. No publishing, pushing, or deployment was performed.
