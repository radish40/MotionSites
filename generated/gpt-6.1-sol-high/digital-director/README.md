# Digital Director

Design ID: `digital-director`. A single viewport portfolio for Adam Roberts, implemented from this project's TASK.md and PROMPT.md with React, TypeScript, Tailwind CSS, Vite, and lucide-react. The browser title is **Adam Roberts - Design & Engineering**.

The page uses the exact CloudFront video URL, specified GP SVG, Inter, and basis33. Its content is real HTML over an autoplaying, muted, looping video with no dark overlay. Desktop has four metadata columns and a two column bottom section; mobile uses two metadata columns and a staggered fullscreen navigation menu. PLAY SHOWREEL opens the original video in browser fullscreen with native controls. Escape and the menu close button restore focus to the hamburger.

## Run and build

With Node 22 installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Vite's base is `/motionsites-results/digital-director/`. Open that path on the development or preview server. `dist/` contains the complete static build and `dist/index.html` is the entry point.

This host uses the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The script serves the actual `dist/` build at its required subpath, runs the image's Chromium using playwright-core, and writes `screenshots/browser-report.json`. It checks 1440×1000 and 390×844 viewports, document overflow, footer visibility, loaded fonts, advancing muted video playback, desktop video scaling, navigation, showreel fullscreen, and mobile menu opening and closing through its links, X, and Escape. It records script errors and failed requests. Screenshots are `screenshots/desktop.png`, `screenshots/mobile.png`, and the additional `screenshots/mobile-menu.png`. Screenshots were also visually reviewed.

## Sources and limits

Only this design's reference `/home/opc/motionsites/assets/previews/digital-director.webp` was viewed. No reference image is embedded in the page, and no assets were extracted. Original video and font endpoints loaded successfully in Chromium. External video and fonts require network access. Video stream requests can be reported as `net::ERR_ABORTED` when Chromium closes a page; both viewport checks independently verified readyState 4, video dimensions, and advancing playback.

The written prompt takes precedence where the preview differs, including the brand blurb. At widths up to 420px and heights up to 860px, the services list uses a slightly tighter 1.45 line height to keep the footer completely within the locked viewport. The rest of the requested layout and responsive values are preserved. Navigation and Schedule a call retain the specified `href="#"` placeholders. Browser fullscreen support is required for showreel fullscreen. Screenshots capture one moment of the moving video; frames vary over time. Real mobile device browser chrome was not tested.

basis33 is served by [OnlineWebFonts](https://www.onlinewebfonts.com/fonts), whose supplied stylesheet identifies its font license as [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Inter is loaded through Google Fonts using the exact requested stylesheet.

No deployment, push, other sessions, agents, or messaging were performed. `ready` in result.json means ready for review, not deployed.
