# Focus AI

Design ID: `focus-ai-landing`. A complete implementation of the supplied Velorah landing-page prompt, with six sections, black backgrounds, Instrument Serif display type, Inter body type, liquid-glass buttons, entrance animation, three MP4 backgrounds, and an hls.js-powered background stream.

The project index title remains **Focus AI**. The visible brand and browser title use **Velorah**, as specified by PROMPT.md.

## Stack and output

React 18, TypeScript, Vite, Tailwind CSS, hls.js, Radix UI dialog primitives, and lucide-react. The remaining requested dependencies are installed and locked in `package-lock.json`. Tailwind includes the requested HSL tokens, dark mode, radii, accordion animations, and tailwindcss-animate plugin.

The production files are in `dist/`, including `dist/index.html`. Vite uses the required `/motionsites-results/focus-ai-landing/` base. Host the contents of `dist/` at that path. No deployment or push was performed.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the displayed local origin at `/motionsites-results/focus-ai-landing/`.

On the supplied Docker-only host, from this project directory:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci --no-audit --no-fund && npm run build'
```

The actual initial build used `npm install --no-audit --no-fund && npm run build` in this image. TypeScript and the production build both passed. Vite reported a non-fatal bundle-size advisory because hls.js is included in the main bundle (798.24 kB, 251.75 kB gzip).

## Browser verification

The included script starts a temporary HTTP server for the real `dist/` output and uses the image's Chromium and playwright-core. It closes the browser and server after completion:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/browser-check.cjs
```

Verified at 1440 × 1000 and 390 × 844:

- No page errors, console errors, or failed network requests.
- No horizontal overflow at either viewport.
- All four video elements playing, with decoded dimensions and readyState 4; the Mux stream plays through hls.js.
- Instrument Serif and Inter loaded successfully.
- Feature selection updates the active button, including on mobile.
- App CTA navigates to the join section.
- Preorder, tour, and subscription dialogs open, validate an email, show local confirmation, and close with Escape.
- Privacy and terms dialogs open and close.
- Mobile dialog fits within the viewport.

The 11 assertions and media evidence are saved in `screenshots/browser-report.json`. Full-page screenshots, visually reviewed, are `screenshots/desktop.png` and `screenshots/mobile.png`; viewport sizes refer to the browser, so the full-page PNGs are taller. Video imagery varies over time.

## Assets and limits

All four original video URLs are used exactly as supplied. They returned HTTP 200 and played in Chromium during verification. Fonts are loaded from Google Fonts, including the exact Instrument Serif link in the prompt. The CSS import corrects the prompt's `Instrumental Serif` typo: the actual family is `Instrument Serif`, loaded by the HTML link, and Inter is imported in CSS. External video and font availability remains dependent on their providers.

The optional reference `/home/opc/motionsites/assets/previews/focus-ai-landing.webp` does not exist in this environment. No other design was read, and no preview was substituted for the page. All layout, text, and controls are real DOM elements. No asset extraction or generated substitute imagery was needed.

The feature buttons implement the selection state specified by the prompt; the shared feature copy and 35% progress indicator stay as specified. Navigation uses anchors to the existing six sections. The action dialogs are local demonstration interactions, with an explicit preview disclosure: they do not submit personal data, charge a deposit, create a reservation, book a tour, or subscribe an email. Policy dialogs describe this preview and are not production legal documents. No backend or actual app destination was supplied. Native HLS fallback is implemented but was not tested on Safari; the tested browser uses hls.js.
