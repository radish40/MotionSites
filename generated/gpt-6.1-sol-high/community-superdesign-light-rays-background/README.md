# Light Rays Background

Design ID: `community-superdesign-light-rays-background`

A React and TypeScript implementation of the supplied LightRays design. It uses OGL for the animated cyan WebGL rays, Framer Motion for the entrance animation, Lucide for the Reply arrow, and Tailwind CSS for the supplied layout. The page preserves the prompt's text, charcoal background, central typography, subtle frame, and history-back Reply action.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The production URL base is `/motionsites-results/community-superdesign-light-rays-background/`. The complete static release is in `dist/`, including `dist/index.html`. No deployment was performed.

On this host, use the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Component

`src/Component.tsx` exports `LightRays` and `RaysOrigin`. It supports the prompt's origin, color, speed, spread, ray length, pulsation, fade distance, saturation, mouse tracking, noise, distortion, and class name props. The demo uses the exact supplied values. Rays render as a real animated WebGL canvas behind accessible HTML content.

The supplied shader used bottom-up fragment coordinates with top-down anchors. Both fragment and mouse coordinates now use the same top-down convention so `top-center` behaves as named. Initialization also cancels safely on unmount. On small screens the frame and Reply button use 24px insets. The default system sans-serif font is local; there are no remote font or image requests.

## Validation

A real TypeScript check and Vite production build were run. Browser validation serves `dist/` at its configured subpath using Chromium and Playwright from the available Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & server_pid=$!; node scripts/verify.cjs; result=$?; kill "$server_pid"; exit "$result"'
```

The checks cover desktop 1440×1000 and mobile 390×844, visible content, a single correctly sized canvas, changing rendered frames, mouse updates reaching WebGL uniforms, keyboard focus, Reply returning to the previous history entry, document overflow, failed network requests, and browser script errors. Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, and `screenshots/checks.json`.

## Assets and limitations

The optional reference file named in TASK.md was absent. The supplied PROMPT.md code and styles were used directly; no screenshot was used as page content and no asset extraction was needed. All dependencies are captured in `package-lock.json` and bundled locally. A small inline SVG favicon avoids an unrelated browser favicon request.

Browser checks use Chromium software WebGL in Docker; GPU performance and other browser engines were not measured. The effect requires WebGL. The Reply button follows browser history exactly as requested, so a fresh tab with no prior history has nowhere to return. This project is ready for review, not published.
