# Urban Jungle

Design ID: `urban-jungle-hero`. A 500vh scroll-driven landing page with a full-screen nature film, Dirtyline headline, GSAP pill navigation, and a glass About panel with an infinite partner marquee.

## Stack and source

React 19 and TypeScript, Vite, Tailwind CSS v4 through `@tailwindcss/vite`, GSAP with ScrollTrigger and ScrollToPlugin, hls.js, and BrowserRouter in StrictMode. All requested dependencies, including lucide-react and motion, are declared; the specified animation is implemented with GSAP. `package-lock.json` locks the installed dependency versions.

- `src/App.tsx`: ScrollVideo, ScrollFloat, GlassPanel, and PillNav.
- `src/index.css`: fonts, Tailwind theme, navigation, and responsive styling.
- `public/`: the downloaded original Dirtyline font and original MP4.
- `dist/`: actual production build, ready for review at `/motionsites-results/urban-jungle-hero/`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the configured subpath, `/motionsites-results/urban-jungle-hero/`.

On this host, which has no Node/npm, the build was run using the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Browser verification

The actual `dist/` build is served by the project-local verification script. It uses Chromium and Playwright already provided by the Docker image; no browser package installation is required:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 \
  browser-check.cjs
```

Evidence is saved in `screenshots/browser-checks.json`. Checks cover desktop 1440×1000 and a fresh mobile 390×844 page, 500vh container height, horizontal overflow, font loading, video readiness and seeking, headline exit, pill hover, Home/About smooth navigation, mobile menu opening/closing and Escape, and About text visibility. Page script errors and failed requests are captured. The three local video request cancellations are expected from StrictMode media cleanup/reinitialization; the film loads and its start/end seeking is verified.

Screenshots:

- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/desktop-about.png`
- `screenshots/mobile-about.png`
- `screenshots/mobile-menu.png`

## Assets and interpretation

The dedicated video specification names a CloudFront MP4 while the assembly snippet names a Mux HLS stream. The original CloudFront MP4 was downloaded unmodified to `public/urban-jungle.mp4` and is the primary film. The Mux URL is retained as a runtime fallback with the requested hls.js buffering and highest-quality settings; primary-asset browser checks do not exercise that fallback. The video renders as a real muted inline video, without canvas, and is scrubbed using decoder-aware queued seeking.

The original Dirtyline WOFF2 is hosted locally. Manrope and Instrument Serif use the exact Google Fonts CSS import and loaded successfully in Chromium. Google Fonts and the emergency HLS fallback require internet access; the primary film and headline font are local. Vite rewrites the public font URL for the required subpath.

HOME scrolls to the top and ABOUT to the bottom. The prompt supplies labels but no separate destinations/content for SERVICES and CONTACT; both link to the supplied About panel. No additional sections or contact form were invented.

## Limitations

The supplied film is approximately 20.2 MiB and 6.04 seconds long. Vite emits a nonfatal chunk-size advisory for the JavaScript containing React, GSAP, and hls.js. Chromium was checked; Safari/native HLS was implemented but not tested on a Safari device. This project is built locally for acceptance and has not been deployed or pushed.
