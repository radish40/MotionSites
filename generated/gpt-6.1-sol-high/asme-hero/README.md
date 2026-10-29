# Asme

Single-page cinematic hero for design `asme-hero`, implemented from `PROMPT.md` using Vite, React 18, TypeScript, Tailwind CSS 3, and Lucide React. The page uses the supplied video, Instrument Serif, liquid glass borders, and the specified responsive layout.

The video fades using cancellable 500 ms requestAnimationFrame animations. It fades out with 0.55 seconds remaining, waits 100 ms after ending, resets, and fades in again. A ref prevents duplicate fade-outs. The exact remote source is primary; an identical local video provides a fallback.

## Build and run

Requires Node 22/npm. On this host, run inside the provided Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`dist/` contains the complete static build. The configured public base is `/motionsites-results/asme-hero/`. Serve `dist/` at that path. To develop locally:

```bash
npm ci
npm run dev
```

Open `/motionsites-results/asme-hero/` on the Vite development server.

## Browser verification

The reproducible check uses Chromium and playwright-core already provided by the Docker image. It starts an ephemeral HTTP server within its container, serves the real production build at the configured base, runs checks, captures screenshots, and shuts down.

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node browser-check.cjs'
```

- Desktop: 1440×1000; mobile: 390×844.
- Video autoplay, real decoded frames, fade-out and restart across two loops.
- Original video and Google font load successfully; deliberate remote video failure exercises the bundled fallback.
- No horizontal or vertical overflow; heading stays within the viewport.
- Sign Up focuses the email field. Invalid email is rejected; valid email shows honest preview feedback.
- Navigation, Manifesto, social buttons, Login form, dialog close buttons, and Escape are exercised.
- Script errors, console errors, and failed requests are captured.

Artifacts: `screenshots/desktop.png`, `screenshots/mobile.png`, `screenshots/browser-checks.json`, and `screenshots/dependency-audit.json`.

## Scope and limitations

This is a static hero preview. Newsletter submission and Login have no backend and explicitly say so; no email or credentials are stored or transmitted. The prompt supplies no navigation destinations, manifesto copy, or social URLs, so these controls open small local informational dialogs. Sign Up uses the existing newsletter field. No additional sections or services are included.

The required Google Fonts CSS import remains external and requires network access; serif fallback remains available. Both regular and italic Instrument Serif are requested. The supplied 20,064,148-byte video is included locally as a fallback, increasing distribution size. Browser autoplay ultimately depends on the visitor’s browser policy; the video is muted and plays inline as specified. No asset failures occurred in the normal verification run.

No deployment or push was performed. `ready` in `result.json` means ready for review.
