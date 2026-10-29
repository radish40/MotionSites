# Minimal Workflow SaaS

Design ID: `minimal-workflow-saas`. A faithful implementation of the supplied Script landing page: full-viewport CloudFront video, minimal navigation, staggered hero entrance, dark gradient CTA, glass task highlight, and a nine-task queue that advances every 4.5 seconds and silently resets after its tripled sequence. The supplied LogoCloud component exists but is intentionally not rendered.

Built with React 19, TypeScript, Vite 6, Tailwind CSS 4 through `@tailwindcss/vite`, Motion 12 (`motion/react`), and `lucide-react`. Google Inter weights 400, 500, 600, and 700 and the exact supplied MP4 are downloaded into `public/assets/` and copied into the build. No runtime external asset requests are required.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Without host Node, from this directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable output is `dist/`, including `dist/index.html`. Serve at `/motionsites-results/minimal-workflow-saas/`; Vite's base is configured to this exact path. Nothing was deployed or pushed. The dependency lockfile is included; `node_modules/` is ignored.

## Browser verification

The reproducible check uses the existing Docker image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

It serves the real production build at the required subpath and checks desktop 1440×1000 and mobile 390×844, font loading, autoplay/muted/loop video playback, responsive navigation visibility, button hover/click, keyboard focus, horizontal overflow, browser script errors, and failed requests. The desktop check waits through a real complete queue cycle, including the silent reset. Evidence is saved in `screenshots/browser-checks.json`, `screenshots/desktop.png`, and `screenshots/mobile.png`.

## Scope and limitations

The prompt supplies no navigation destinations, registration flow, or service backend. Navigation links use same-page placeholders; Join us and Register Now! retain their specified visual button behavior without an invented workflow. LogoCloud is not shown, as required. Video frames change throughout playback, so screenshots capture one moment of the animation. White task text may have low contrast during lighter frames; the exact prescribed video treatment and text opacity are retained.

The video and all four font assets downloaded successfully. A Python download attempt stalled; fetching the same font URLs with curl succeeded. The build emits a harmless warning about the base-prefixed public font stylesheet; the file is included in `dist/assets/`, and real browser verification confirms it resolves. No external asset failures remain.
