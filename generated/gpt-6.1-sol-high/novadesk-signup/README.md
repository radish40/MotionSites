# NovaDesk Signup

Single-page sign-up design implemented with React, TypeScript, Tailwind CSS, Vite, and lucide-react. The page uses the specified system fonts, SVG brand mark, exact remote background video, responsive form and desktop glass panel. No UI component library is used.

## Run and build

With Node.js 22 and npm:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The production output is `dist/`, with its base set to `/motionsites-results/novadesk-signup/`. Serve and open that path, including the trailing slash.

The host used for this project has no Node installation. The actual production build used the available Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install && npm run build'
```

Use `npm ci` instead of `npm install` to reproduce the locked dependency tree.

## Browser verification

The browser check serves the real `dist/` output at the required subpath and uses Playwright Core with Chromium from the same Docker image:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check.cjs
```

The check covers desktop 1440×1000 and mobile 390×844, horizontal overflow, decoded muted video playback, required email validation, password visibility, agreement checkbox, submit feedback, social buttons, footer/terms links and notification dismissal. Results are saved to `screenshots/checks.json`. Screenshots of the initial page are `screenshots/desktop.png` and `screenshots/mobile.png`.

## Assets and limits

The exact CloudFront MP4 specified in `PROMPT.md` is used directly. It returned HTTP 200 and decoded successfully in Chromium. It remains an external runtime dependency. No fonts are fetched. The provided NovaDesk logo path is rendered as SVG; the remaining interface icons come from lucide-react. Only this design's supplied visual reference was inspected; no screenshot assets were used in the page.

The written prompt's “Sign up” heading takes precedence over “Join us” in the visual reference. The form uses native validation and React state. No authentication service, OAuth credentials, existing-account route, or legal documents were supplied. Submitting valid fields, choosing social sign-in, or opening the ancillary links displays honest preview feedback; no account creation or external navigation is claimed. No deployment or push was performed.

Both viewport checks passed with zero browser script errors and no layout overflow. Chromium reported two aborted video stream requests in its network log; the video nevertheless decoded at 1920×1080 and was actively playing, muted, in both captures. The raw request records are retained in the browser report.
