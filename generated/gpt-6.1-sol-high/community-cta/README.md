# Community CTA

Single-file HTML implementation of `PROMPT.md`, with inline CSS and the requested responsive layout, copy, full-opacity video, email input, button states, and overlapping avatar elements. Project ID: `community-cta`.

The real static build is in `dist/`, including `dist/index.html`. Relative runtime asset paths support `/motionsites-results/community-cta/`. No framework, application dependencies, or JavaScript animations are used. `package-lock.json` is included.

## Build and check

From this directory, on the supplied host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm install --ignore-scripts && npm run build'
```

With Node installed, `npm install && npm run build` produces the same files. Serve `dist/` using a static HTTP server, mounted at the required URL prefix. Opening `dist/index.html` directly also resolves the local assets.

To reproduce the actual Chromium checks using the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm run build && node scripts/check.cjs'
```

The check script starts and stops a temporary HTTP server inside that container; it does not deploy the site. It verifies the production build at the required prefix, desktop 1440×1000 and mobile 390×844, no horizontal overflow, DM Sans availability, video decoding and advancing autoplay, muted/loop/playsinline properties, input focus and email validity, keyboard tab order, button hover/active states, and absence of script and console errors. It also decodes all four portrait images, verifies their circular desktop/mobile dimensions and visibility, and asserts zero failed requests, HTTP errors, and external runtime requests.

Screenshots: `screenshots/desktop.png` and `screenshots/mobile.png`. Detailed results: `screenshots/browser-checks.json`; complete run output: `screenshots/verification.log`. Screenshots use the video's one-second frame for consistency after verifying live playback. Both screenshots were visually inspected.

## Assets and limitations

- The original CloudFront MP4 downloaded successfully and is served unchanged as `assets/background.mp4`. Chromium decoded its 2196×940 frames and confirmed autoplay on both viewport sizes.
- DM Sans weights 400, 500, 600, 700, and 800 are the original Google Fonts downloads, loaded using inline local `@font-face` rules. The original Google response, including source URLs, is preserved as `assets/google-fonts-source.css`. The preview makes no external font request.
- **All four original CleanShot JPEGs remain unavailable (HTTP 403).** Historical signed and unsigned retry results are preserved unchanged in `assets/download-report.json`. Every exact signed original URL is also retained in `assets/portrait-provenance.json`. The preview never requests these unavailable URLs.
- Management authorized four locally cached Unsplash stock photographs as **approximate decorative portraits**. None is an original CleanShot asset or a verified community member. Each avatar has a descriptive title; source code comments and the provenance manifest label the approximation. The prompt's “5,000+ happy members” text is preserved as supplied design copy, not a verified membership or endorsement claim.

| Avatar | Local cached image | Replacement source (Unsplash) |
| --- | --- | --- |
| `.av1` | `assets/avatar-1.jpeg` | [Stock portrait 1](https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces&fm=jpg&q=85) |
| `.av2` | `assets/avatar-2.jpeg` | [Stock portrait 2](https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces&fm=jpg&q=85) |
| `.av3` | `assets/avatar-3.jpeg` | [Stock portrait 3](https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces&fm=jpg&q=85) |
| `.av4` | `assets/avatar-4.jpeg` | [Stock portrait 4](https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces&fm=jpg&q=85) |

The manifest records each replacement URL, cache date, byte count, SHA-256 hash, original URL, and approximation classification. `python3 scripts/cache-portraits.py` reproduces the four downloads and provenance using curl; it never requests the original CleanShot URLs. The delivered preview uses only cached files, not these external replacement URLs.

- The optional reference `/home/opc/motionsites/assets/previews/community-cta.webp` does not exist, so the missing avatars could not be extracted from it. No other design references were read. Composition follows the explicit prompt values; a reference-image comparison was unavailable.
- `Join Now` is a visual button as explicitly specified by the prompt's `type="button"` markup. No subscription endpoint, submission handler, or success state was requested or added.

Status is **ready** for management acceptance of the usable preview, with the explicit portrait substitution above. Original portrait fidelity is unavailable; no claim of original-asset fidelity or actual community membership is made. The original video, typography, layout, supplied copy, and requested interactions are preserved. Nothing was pushed or deployed.
