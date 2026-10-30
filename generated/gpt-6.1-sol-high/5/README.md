# Glassmorphism Agency Hero

Design ID: **5**. A responsive React landing page using Vite, TypeScript, Tailwind CSS v4, motion/react, hls.js, react-use-measure, clsx, tailwind-merge and lucide-react. The requested copy, gradients, glass pill and CTA, native video integration and continuous logo cloud are implemented as live DOM.

## Original media is unavailable — default uses a local approximation

The original HLS and MP4 assets still return 404, including a fresh check of the exact public fallback path. **The delivered default page uses the documented animated CSS approximation; it does not play original footage.** It mounts no video element and makes no request or availability probe to either missing source. The reviewed desktop/mobile composition is preserved. Logo substitutes also remain approximations.

The earlier live acceptance failure is retained unchanged in `screenshots/live-check.json`. It identified the original page-load 404s; the new local production checks cover the corrected default behavior. No management checker was changed, and no new public deployment or live acceptance is claimed.

## Re-enable original media after restoration

Both exact source URLs and the real hls.js/native-HLS-to-MP4 fallback are preserved in `src/lib/hero-media.ts` and `src/hooks/useHeroMedia.ts`.

- For an explicit per-visit diagnostic opt-in, open `/motionsites-results/5/?media=original`. This will request the original URLs, so it can still produce network errors while they remain unavailable. It does not persist to other visits.
- For a restored production source, set `VITE_ENABLE_ORIGINAL_MEDIA=true` in the build environment and rebuild. `.env.example` documents the default `false`. Confirm original footage and both source paths before enabling this globally.
- An opted-in visit attempts each applicable source once, without network retries. If both fail, it retains the CSS approximation and hides playback controls. Controls only appear after media becomes playable. Native HLS is selected when browser HLS support is available without MediaSource; otherwise hls.js is used, then the exact MP4 fallback.

## Run and build

With Node 22: `npm ci`, then `npm run dev`. Visit `/motionsites-results/5/`. `npm run build` produces `dist/`. The Vite base is `/motionsites-results/5/`.

This host used Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

No deployment or push was performed. The dependency lockfile is retained; node_modules is excluded from delivery.

## Browser verification

Run `node scripts/check.cjs` inside the same image after building. This strict local check serves the real default production build without mocking or intercepting any requests, checks initial load and reload at 1440×1000 and 390×844, captures console errors, script errors, failed requests and HTTP errors, and fails on any of them. It also asserts zero original-source requests, no overflow, loaded logos, moving slider, keyboard CTA activation and reduced-motion behavior. It writes `screenshots/checks.json`, `screenshots/desktop.png` and `screenshots/mobile.png`.

Run `node scripts/check-sources.cjs` separately for opt-in source-handler tests. It writes `screenshots/source-handler-checks.json`. Those tests intentionally intercept the source responses: a generated WebM tests playback/pause/resume after HLS failure; native-HLS selection is simulated to exercise native error-to-fallback handling; lack of HLS support and failure of both sources are also covered. These results demonstrate handler behavior with fixtures only, **not original footage restoration or actual native-HLS decoding**. No fixture is shipped as a hero asset. Expected simulated 404s are confined to this separate test.

The CTA's mailto link is activated by a trusted keyboard event in the test; opening the OS email composer is prevented in headless CI. Actual mail delivery or appointment scheduling is not claimed.

## Assets and limitations

- The exact Cloudflare HLS URL returns HTTP 404 with err-code 1020002. Direct-download and alternate manifest-parameter recovery attempts also returned 404. The relative MP4 URL has no supplied source host or file and returns 404 on the isolated server. The native video hook retains both exact URLs and switches to MP4 on fatal HLS failure. The video uses screen blending, automatic height, full width, a negative top margin and a gradient fade. Actual original video playback cannot be verified until that asset is restored.
- An original CSS-drawn abstract purple light treatment appears when video is unavailable. It is an approximation, not recovered footage or a screenshot. It animates gently and respects reduced motion. Playback controls hide when no playable source exists.
- The catalog confirms no optional original preview exists. No reference image was read or extracted; exact fidelity to such a reference cannot be verified.
- The supplied Tailus SVG URLs redirect to an unrelated smoothie website. Other similarly named Tailus logos also failed. Local symbols were restored from `https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/{openai,nvidia,github,vercel,linear}.svg`. Adjacent wordmarks are typeset approximations. Original symbols are retained in `public/logos/*-symbol.svg`; `python3 scripts/restore-assets.py` reproduces their composition.
- Inter regular is self-hosted in `public/media/inter-regular.ttf`, downloaded from `https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf`. Medium/semibold use browser synthesis.
- No booking URL or business email was supplied. The CTA opens a prefilled email draft with the recipient left for the visitor. It does not schedule an appointment. A booking destination must be supplied for public launch.
- The production build succeeds with a nonfatal large JavaScript chunk warning, chiefly from hls.js. The default browser report must contain zero console or request errors. Manual recovery evidence and separate fixture tests are not default-page network behavior.

`ready` means ready for management review with these explicit asset limitations, not deployed or restored original footage.

See `provenance.json` for a machine-readable distinction between original-source availability, local substitutes and fixture-only validation.
