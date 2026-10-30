# NeoVision

A responsive, three-section futuristic landing page built from this project's PROMPT.md with React 18, Vite, TypeScript, Tailwind CSS 3, and lucide-react. Uses the default system sans-serif font stack. Build output is in `dist/`, with all URLs configured for `/motionsites-results/neo-vision/`.

## Run and build

With Node 22 and npm:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Open the configured subpath, including the trailing slash. On the provided host, use the existing Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

`package-lock.json` pins the dependency tree. `node_modules/` is excluded and is not a deliverable. No deployment or push was performed.

## Behavior

Home returns to the hero; About and Get Started scroll to About. Services, the exploration icon, and About's Learn More lead to Insights. The mobile navigation expands and closes after choosing a link. Search returns matching insight titles and selects the corresponding tab. Insight tabs support mouse, touch, and Up/Down/Home/End keyboard navigation. Watch a Video opens a native modal with video controls; Escape, the close button, or the backdrop dismiss it. Insight Learn More opens the supplied excerpt in a modal. No full articles or contact destination were supplied: excerpts remain verbatim, and Contact/Contact Us lead to the About introduction.

## Assets and limitations

- Both original CloudFront MP4 files were successfully retrieved and are self-hosted as `public/assets/hero.mp4` and `about.mp4`. Both retain autoplay, loop, muted, and playsInline behavior. No full-page screenshot or reference video is used as page content.
- All four specified Pexels portraits (415829, 1222271, 1239291, 2379004, width 100) were retrieved and are self-hosted as `avatar-1.jpg` through `avatar-4.jpg`.
- The required `image.png`, `Mask_group.jpg`, `Mask_group-1.jpg`, and `Mask_group-2.jpg` were absent from the project. Requests for these filenames under the supplied CloudFront user directory returned HTTP 403. No original URLs for these four files were provided.
- The optional `/home/opc/motionsites/assets/previews/neo-vision.webp` reference does not exist, so visual fidelity against that reference cannot be checked.
- `public/image.png` is a reconstructed NeoVision wordmark rendered with the system sans-serif font. Its original appearance could not be recovered.
- The three insight JPGs are isolated stills from the supplied original media: About video at 2 seconds, Hero video at 4 seconds, and About video at 6 seconds, respectively. They are center-cropped to 1200×900, with no page UI baked into them. Their subject matter and crops approximate the unavailable originals.
- `scripts/prepare-assets.cjs` records and reproduces this replacement process. Run it in the same Docker image with `--entrypoint node` after the original MP4s are present.
- Animated videos mean screenshots may capture different frames between runs. No custom font or runtime external asset dependency is required.

## Browser verification

Run the built site checks using the image's installed Chromium and playwright-core:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint node louislam/uptime-kuma:2 scripts/check-browser.cjs
```

This serves `dist/` temporarily at the required subpath and exercises desktop 1440×1000 and mobile 390×844. It checks horizontal overflow, image loading, both background videos playing, anchor navigation, all insight tabs, video/article dialogs, search, mobile navigation, browser script errors, and failed HTTP responses. Results are saved in `screenshots/browser-checks.json`. Full-page captures are `screenshots/desktop.png` and `screenshots/mobile.png`; additional viewport captures are `desktop-hero.png` and `mobile-hero.png`.

The first browser pass uncovered search results under the hero stacking layer; raising the header stacking order corrected the issue. See the recorded final browser results for verification. Testing covers Chromium at the requested viewports; other browser engines and exact matching to the missing reference are unverified.
