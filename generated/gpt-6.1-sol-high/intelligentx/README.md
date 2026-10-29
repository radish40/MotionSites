# IntelligentX

Design ID: `intelligentx`. A responsive **mėntality** mental wellbeing landing page, built from the supplied `PROMPT.md` using React, TypeScript, Vite, Tailwind CSS 4, and `motion/react`.

The page includes the clover wordmark, fixed glass navigation, animated mobile menu, three-line desktop headline with an inline eye, question capsule, language selector, and the exact supplied CloudFront video. Background color is `#EDEEF5`; Inter and Outfit load from Google Fonts. The project index name remains IntelligentX.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

This environment uses the existing Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

The publishable output is `dist/`, including `dist/index.html`. Vite's base is `/motionsites-results/intelligentx/`. Serve this directory at that path. No deployment has been performed. Dependencies are pinned by `package-lock.json`; `node_modules` is excluded from the handoff.

## Browser verification

The actual production build was served with Vite preview and checked using the image's Chromium and Playwright. Reproduce with:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build && (npm run preview -- --port 5173 > /work/screenshots/preview.log 2>&1 & SERVER_PID=$!; trap "kill $SERVER_PID" EXIT; node browser-check.cjs)'
```

Checks cover desktop 1440×1000 and mobile 390×844, horizontal overflow, background color, font availability, actual video decoding/playback, language switching, question submission, get-started behavior, and mobile menu opening, link selection, and Escape closing. Browser errors and failed requests are recorded in `screenshots/browser-report.json`.

Screenshots:

- `screenshots/desktop.png` and `screenshots/mobile.png`: requested viewport captures.
- `screenshots/desktop-full.png` and `screenshots/mobile-full.png`: entire hero including its bottom edge labels.
- `screenshots/mobile-menu.png`: expanded navigation.

## Scope and limitations

The prompt supplies a landing page only, without routes, resource content, or a question API. Navigation and get-started controls lead to the question input. Submitting a question displays an explicit message that the service is not connected; no question is sent or stored. The language control translates hero copy, the question control, and the tools label between English and Polish; navigation retains the supplied English labels.

The exact video URL and Google Fonts remain external network dependencies. Both loaded during browser verification; no failed asset requests were observed. The video is 21.3 MB and may require time to load on slower connections. Hero heights intentionally follow the prompt (110vh mobile / 140vh desktop), so the bottom labels are below the initial viewport and appear in full-page captures.
