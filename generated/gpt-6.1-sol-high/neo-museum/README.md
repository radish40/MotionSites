# Neo Museum

Design ID: `neo-museum`. Natura History Museum, implemented from this project's `PROMPT.md` using React 19, Vite 6, TypeScript, Tailwind CSS 4, Motion, and Lucide React. All page components and the SVG sand dissolve helper live in `src/App.tsx`.

The page includes the animated NHM polygon wordmark, 2800ms specimen reveal, responsive navigation, Explore controls, specimen dialog, 3500ms chapter cycling with manual selection, the overlapping pterodactyl composition, and live typography and controls. Inter and JetBrains Mono load via the prescribed Google Fonts import.

## Run and build

With Node 22: `npm ci`, then `npm run dev` or `npm run build`.

On this host:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'npm ci && npm run build'
```

Production output is `dist/`, with base `/motionsites-results/neo-museum/`. Serve it at that path. `node scripts/serve.cjs` runs a local production check server on port 4173 without deploying.

## Asset repair and differences

The seven supplied Cloudinary media endpoints returned HTTP 401, with `cloud_name dsdxaxkiz is disabled`. Their exact URLs remain in `src/App.tsx` as `originalMedia`. The website now uses locally bundled transparent photographic specimen assets recovered under the design-specific repair authorization.

- Hero T. rex, pterodactyl, chapter-1 T. rex and chapter-5 mammoth: isolated from this design's own 73-frame reference. Multiple frames were compared to choose unoccluded specimens and avoid dissolve blur. Anatomical masks and segmentation remove the original page UI; all website text and controls remain live DOM.
- Chapter 3: approximated using the recovered pterodactyl, since its original specimen was not visible in the reference.
- Chapter 2 and 4: public-domain USGS trilobite and ammonite photographs, respectively. Locally masked and cropped to match the collection's specimen presentation. Photographer credits, source links, processing details, and reproducible scripts are in [recovery/ATTRIBUTION.md](recovery/ATTRIBUTION.md).
- The original MP4 was not recovered or decoded. Its fallback is a recovered photographic still with an actual 14-second alternating translation, rotation and scale. Pause/play stops and resumes that animation. It retains the original 2800ms reveal, but does not reproduce articulated walking. The background diagram is an approximate live SVG with a faint duplicate specimen layer.

Recovered photography comes from a 640×468 reference; enlarged edges and detail are softer than the unavailable source media. The hero tail remains clipped as in the reference. These are documented fidelity limits, with no broken or blank media panels.

To reproduce assets, run `sh scripts/download-recovery.sh`, create a project-local Python environment, install `recovery/requirements.txt`, and run `scripts/recover.py`. The shipped assets need no Python dependencies. Neither dependencies nor virtual environments are included in the deliverable.

## Browser verification

Using the Docker image's Chromium and Playwright:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c 'node scripts/serve.cjs & server_pid=$!; node scripts/check.cjs; check_status=$?; kill "$server_pid"; exit "$check_status"'
```

The production page is checked at **1440×1000** and **390×844**. Checks include hidden-before-reveal and visible-after-reveal states, loaded photographic hero, actual transform changes, desktop pause/play, all five manual switches with loaded matching assets and nonzero-to-zero SVG displacement values, all five automatic chapters, loaded pterodactyl, specimen dialog, responsive navigation, font loading, overflow, broken images and JavaScript errors.

`screenshots/desktop.png` and `screenshots/mobile.png` are full-page captures. Additional hero, collection, and in-progress dissolve captures provide focused evidence. `screenshots/browser-report.json` records actual check results and asset responses. Screenshots were visually compared with the project's own reference: the large skeleton composition, thin NHM logo, pale diagram, photographic flying reptile overlap and dark collection layout are retained, with asset differences documented above.

Status **ready** means ready for management acceptance, not deployed. No push, deployment, subagents, other sessions, external messages, or writes outside this project were performed.
