# ClubX Investors

Design ID: `club-x-investors`. A full-screen ClubX landing page built with semantic HTML, CSS, JavaScript, and Vite. It implements the supplied video background, navigation, social proof, headline, CTA, stats, fade-rise animations, and responsive layout. No framework was specified in PROMPT.md; its utility-style measurements are implemented in CSS.

## Build and run

With Node 22:

```bash
npm ci
npm run build
npm run dev
```

Production output is `dist/`, with `dist/index.html`. The configured base is `/motionsites-results/club-x-investors/`. Serve the output at that path. No deployment has been performed.

The build used in this environment:

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

## Validation

```bash
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/browser-check.cjs'
```

The script serves the actual production files at the configured subpath and uses the image's existing Playwright and Chromium. It checks 1440×1000 desktop and 390×844 mobile; image and font loading; video autoplay; horizontal overflow; navigation dialogs; both Begin Journey buttons; dialog close and Escape; mobile navigation hiding; and reduced motion. No script errors or failed HTTP requests were observed. Dependency installation reported zero vulnerabilities.

Screenshots: `screenshots/desktop.png`, `screenshots/mobile.png`. Machine-readable browser evidence: `screenshots/checks.json`. Screenshots freeze the supplied video at two seconds for repeatability; normal playback loops. Both screenshots were visually inspected.

## Assets and limitations

- `public/assets/clubx-background.mp4` is the exact video URL specified in PROMPT.md, downloaded successfully and served locally. No reference screenshot is used as the page.
- The optional reference `/home/opc/motionsites/assets/previews/club-x-investors.webp` did not exist. Composition was implemented from PROMPT.md.
- Inter 400, 500, and 700 and Instrument Serif regular/italic were obtained from Google Fonts and cached locally as TTF files. Google's family name is **Instrument Serif**, corresponding to the prompt's “Instrumental Serif.” Inter is used for the page; the serif is imported as requested. `google-fonts.css` preserves the source URLs; `fonts.css` uses local files. Bold is explicitly loaded for the headline.
- The built-in image generation tool was unavailable. The imagegen skill does not permit silently switching to its API/CLI fallback without explicit authorization. Five diverse stock portrait crops are used instead of newly AI-generated professional avatars. Initial `i.pravatar.cc` requests returned HTTP 403; replacements downloaded successfully from Unsplash. This is a known approximation of the prompt's generation requirement.
- Portrait sources, in order: `https://images.unsplash.com/photo-1580489944761-15a19d654956`, `https://images.unsplash.com/photo-1500648767791-00dcc994a43e`, `https://images.unsplash.com/photo-1534528741775-53994a69daeb`, `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d`, `https://images.unsplash.com/photo-1531123897727-8f129e1688ce`. Cropping uses `auto=format&fit=crop&w=96&h=96&q=85`. The restoration helper is `scripts/prepare-assets.py`.
- The circular orange-red mark with a white stylized C is a project-local SVG, `public/assets/clubx-logo.svg`.
- Since no destination routes, contact address, or application backend were supplied, navigation opens small informational dialogs and Begin Journey opens a club introduction dialog. No applications are submitted and no personal data is collected.
- Mobile uses two columns for the stats to keep labels readable. Reduced-motion users get paused video and no entrance animation. Browser validation covers local Chromium, not every browser or device.

All source, dependencies, build output, and evidence remain within this project. No agents, additional sessions, pushes, deployments, or external messages were used.
