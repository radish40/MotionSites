# Innovation Summit

Design ID: `innovation-summit`. Unfold by MEWS is a static event app showcase built from `PROMPT.md`, using native HTML and CSS with Vite 6.4.5. The three 393 × 873 phone frames present Home, Speakers, and FAQs on the specified muted purple background.

Includes the original looping video and speaker portraits, local fonts, CSS entrance animations, a single CTA sheen, the 93% FAQ content transform, responsive wrapping and frame scaling, and reduced-motion styling. No runtime JavaScript or external asset requests are needed.

## Run and build

With Node 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

Open `/motionsites-results/innovation-summit/` on the displayed development or preview address. The production output is `dist/`, including `dist/index.html`; its configured public base is `/motionsites-results/innovation-summit/`.

This environment uses the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Browser verification

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh \
  louislam/uptime-kuma:2 -c 'node scripts/check.cjs'
```

The check serves the real production files under the required subpath inside the temporary container and uses Playwright Core with Chromium 148. It checks 1440 × 1000, 390 × 844, 820 × 1180, 320 × 740, and 1024 × 1000. It records dimensions, overflow, portrait loading, font loading, video playback, FAQ fit, chip row fit, console/script/network failures, CTA keyboard focus, and reduced-motion behavior. Menu and CTA clicks are exercised as static preview controls. The script exits unsuccessfully if a required check fails.

Evidence:

- `screenshots/desktop.png`: full-page desktop capture, 1440 × 1000.
- `screenshots/mobile.png`: full-page capture from a 390 × 844 mobile viewport.
- `screenshots/checks.json`: machine-readable browser results.

## Assets and limitations

The exact supplied CloudFront MP4 and Higgs portrait URLs were successfully downloaded to `public/assets/`. `scripts/download-assets.py` preserves their source URLs and can refresh the assets. General Sans and Satoshi come from Fontshare; Inter, Michroma, Poppins, and Archivo come from Google Fonts and are served locally. Axiforma was named without a supplied licensed file or URL, so section headings use the specified Satoshi fallback and metadata uses Poppins.

Vite reports that the public font stylesheet is left for runtime resolution. It is copied into `dist/assets/fonts.css` and its successful loading is verified in the browser. Unused fallback font faces can remain `unloaded` because the browser only downloads the faces used by the page.

Chromium cancels some MP4 range requests with `net::ERR_ABORTED` while fetching/playing media. These are recorded separately as `mediaAborts`; playback was independently verified with a ready state of 4, increasing playback time, and an unpaused video. No HTTP failures or console/script errors remain in the final checks.

As required by the prompt, chips and FAQ rows are visual, and menus/ticket buttons have no navigation or application behavior. Reduced motion disables all entrance/sheens and hides the moving video over a static gradient. Modern CSS scaling is verified in the supplied Chromium; other browser engines were not tested. Nothing was deployed or pushed.
