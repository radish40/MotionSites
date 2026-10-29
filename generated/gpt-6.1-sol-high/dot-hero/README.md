# Dot

A single-screen React landing page implementing `PROMPT.md`. Project ID: `dot-hero`.

Uses React 19, TypeScript, Tailwind CSS v4, Vite, and `motion/react`. The page includes the fixed pill navigation, blue Link up control, animated headline and subtitle, the exact supplied looping video, and the Nokia-font typing sequence with a blinking cursor. The four components live in `src/App.tsx`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The development and preview URL uses `/motionsites-results/dot-hero/`. Vite's base is configured to this publication path. `dist/` contains the completed static build, including `dist/index.html`. No deployment has been performed.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

The production build passed TypeScript checking and Vite compilation. Chromium checked the built files at the publication subpath using desktop 1440×1000 and mobile 390×844 viewports.

- Both viewports: no uncaught script errors, no failed requests, no horizontal overflow.
- The specified video loaded at 1920×1080 and played automatically, muted and inline.
- Instrument Serif, Inter, and Nokia Cellphone FC Small loaded successfully.
- The typing animation changed through the supplied messages; the blinking cursor and headline animations rendered.
- The Link up control and desktop navigation links resolved to their in-page targets; the logo returned to the hero. Desktop links are hidden on mobile as specified.
- Screenshots were visually inspected for both viewports, including the text placement over the phone screen.

Evidence: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/browser-checks.json`.

To repeat the browser checks, after building:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD":/work -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

The check script serves `dist/` temporarily inside the container and uses its existing Chromium and playwright-core. No browser dependencies are added to the project.

## Assets and scope

The MP4 uses the exact CloudFront URL in the prompt. Google Fonts and the required onlinewebfonts CSS import remain external. All loaded successfully during validation, but an internet connection and continued upstream availability are required. No replacement images or preview screenshots are used in the page.

The prompt specifies a landing page only. Navigation and Link up point to existing hero content; no peer matching, signup, or messaging service is implemented. Screenshots capture a moment in a continuously animated video and typing sequence.
