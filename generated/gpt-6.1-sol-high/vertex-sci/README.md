# Vertex Sci

Design ID: `vertex-sci`. A single cinematic hero built with React, Vite, TypeScript, and Tailwind CSS. The page title is **Vertex Sci.** The source implements the specified logo, copy, monospace typography, grayscale video, entrance timing, fixed navigation, responsive columns, and animated mobile menu.

## Run and build

With Node 22 installed:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production base path is `/motionsites-results/vertex-sci/`. The complete static artifact is `dist/`, including `dist/index.html`. Serve that directory at the configured path.

The actual build on this host used the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache -e npm_config_cache=/work/.cache/npm -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

`package-lock.json` records the installed versions. No additional UI or icon libraries are used.

## Browser validation

```sh
docker run --rm -u 1000:1000 -e HOME=/work/.cache --shm-size=256m -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The check script starts an ephemeral HTTP server inside the container and visits the production files at their real base path. It checks desktop 1440×1000, mobile 390×844, and overflow at 320, 640, 768, and 1024 pixels. It checks the title, local font loading, actual video playback, completed reveal animations, desktop anchors and contact link targets, navbar scroll styling, mobile menu opening/closing, scroll locking, Escape dismissal, mobile navigation, and uncaught script errors.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/mobile-menu.png`. Machine-readable observations are in `screenshots/browser-report.json`. Screenshots capture a moving video, so the background frame varies between runs.

## Assets and scope

- The exact original MP4 was successfully downloaded from the CloudFront URL in `PROMPT.md` to `public/assets/fracture.mp4` (7,687,306 bytes). It is played as a real looping background video, with a CSS grayscale filter to satisfy the explicit black-and-white rule. The reference preview contains color; the written monochrome requirement takes precedence.
- The exact Google Fonts head links are retained. JetBrains Mono weights 300, 400, 500, 700, and 800 were also downloaded from Google's font files and bundled locally; `public/assets/google-fonts-source.css` preserves their source URLs. No substitute font is used. Unused Google Fonts language subsets are not required for the English page.
- The supplied Vertex Sci preview was inspected for composition only. No screenshot or extracted page image forms part of the implementation.
- The brief defines only this hero. Navigation uses anchors within its existing content. Inquire and Join Study use explicit fictional `.example` mailto targets; no real lab address, signup service, or backend was supplied. They must be configured with actual destinations before production use. No messages were sent during validation.
- On very short viewports the hero has a 650px minimum height to keep content accessible. The mobile menu supports keyboard focus, Escape, scroll locking, breakpoint cleanup, and reduced entrance motion preferences.
- Chromium desktop emulation was used; physical devices and other browser engines were not tested. Media range-request cancellations (`net::ERR_ABORTED`) may be logged while Chromium switches video requests; successful decoded playback is separately asserted.

No deployment or push was performed. `ready` means ready for review of the local build.
