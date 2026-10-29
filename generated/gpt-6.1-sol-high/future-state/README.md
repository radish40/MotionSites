# Future-State

NOVA_AI cinematic landing page built from PROMPT.md using Vite, React, TypeScript, Tailwind CSS, and lucide-react. Project index: Future-State; ID: future-state.

## Run and build

Use Node 22: `npm ci`, then `npm run dev`. `npm run build` runs TypeScript validation and generates dist/. Vite base: `/motionsites-results/future-state/`.

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

For production verification inside the same container, start `node scripts/serve.cjs`, then run `node scripts/check.cjs` with another docker exec. The server serves this project's dist/ on port 4173. Checks use the image's playwright-core and Chromium.

## Behavior

The exact supplied video is fetched as a blob and decoded into up to 120 resized ImageBitmaps. The fixed canvas uses cover scaling and 0.1 scroll smoothing. A scrubbable video covers initial decoding. Cleanup aborts loading, closes bitmaps, cancels animation, removes listeners, and revokes the blob URL. IntersectionObserver reveals replay on re-entry.

The prompt supplies two sections without pricing content, contact endpoint, or a separate demo app. Navigation uses existing anchors: main → hero, tiers → spacer, features → second section, talk to us → introduction. Begin Today enters section two; Run The Demo returns to the start of the scroll experience. Share uses native sharing where available, with clipboard fallback. No backend is required.

## Validation

The real TypeScript and Vite build passes. Chromium checks run at desktop 1440×1000 and mobile 390×844 at the configured subpath. Detailed results are in screenshots/checks.json, including font loading, frame extraction, scroll changes, navigation, sharing, reveal replay, script errors, and overflow.

Required screenshots are screenshots/desktop.png and screenshots/mobile.png. Additional captures show each viewport's second section. These are real browser captures and are not used as page assets.

## Assets and limitations

The exact Flexo Soft Medium stylesheet is included in the HTML head; both Tailwind font families use it. Font provider attribution: [Web Fonts](https://www.onlinewebfonts.com/fonts), provider-declared CC BY 4.0. The exact supplied CloudFront video is used directly. Both external services must remain reachable. A system font and dark background remain if unavailable. Frame decoding takes roughly 30–40 seconds in this software-rendered container and uses memory; the fallback video covers initial loading. Sharing and clipboard depend on browser support and secure context (localhost works).

No deployment or push was performed. The ready status means the local artifact is ready for review.
