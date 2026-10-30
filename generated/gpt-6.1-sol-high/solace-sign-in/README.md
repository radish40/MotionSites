# Solace sign-in

Fullscreen, responsive Solace login design built with React 18, TypeScript, Tailwind CSS and Vite. The only additional runtime dependency is lucide-react. Exactly four source files live in `src/`; `App.tsx` also mounts the React root.

The supplied `LiquidGlass.tsx` per-pixel canvas engine and `FadeUp.tsx` were extracted verbatim from `PROMPT.md`. The card uses real video refraction, with no backdrop blur. The form includes the requested staggered reveals, password visibility toggle, custom checkbox, inline Solace and Google SVGs, and Google Fonts Inter at weights 400, 500, 600 and 700.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The configured URL is `/motionsites-results/solace-sign-in/`. `dist/` contains the complete static build, including the video. Assets use the configured Vite base path.

On this host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Assets

The original video downloaded successfully without substitution from:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_135315_5f9e8a4c-09bc-4a97-9f75-8a387d4258ee.mp4`

It is stored as `public/assets/solace-background.mp4` and copied into the build to ensure same-origin canvas access and dependable playback. Inter loads from the exact Google Fonts link in the prompt. The project's own reference WebP was inspected visually; no screenshot-derived assets are used.

## Validation

The build runs TypeScript checking followed by a real Vite production build. Browser verification uses Chromium and the existing Playwright installation inside the Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The script serves the production build at its configured subpath, checks 1440×1000 desktop and 390×844 mobile, verifies loaded Inter, video playback, nonempty canvas pixels changing over time, and viewport overflow. It exercises password show/hide, checkbox on/off, prevented submission, native email validation, and secondary buttons. Evidence is saved to `screenshots/checks.json`; screenshots are `screenshots/desktop.png` and `screenshots/mobile.png`.

Both target viewports passed with no script errors and no overflow. Inter and the original video loaded successfully. Two video `net::ERR_ABORTED` entries in the evidence are streaming requests canceled when the checked pages closed after playback. Dependency audit reported zero vulnerabilities.

## Scope and limitations

This is the requested frontend design. Sign In prevents navigation; no authentication backend is connected. Reset password, Google and Join Now retain the specified button presentation without external navigation or account flows. The supplied refraction math and its square canvas scaling are unchanged. Google Fonts requires an internet connection. Browser validation covers the installed Chromium, not Safari or Firefox. Nothing was deployed or pushed.
