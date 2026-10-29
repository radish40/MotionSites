# Blog Showcase

A responsive “Behind the lens” photography blog, built with React, TypeScript, Vite, Tailwind CSS (base reset only), custom CSS, and the Supabase JavaScript client. Project ID: `blog-showcase`.

The design includes the exact four post titles and supplied videos, Outfit and Inter in the requested weights, featured and standard cards, category colors, responsive layouts, corner brackets, and animated video hover overlays. “View all posts” navigates to the three-post grid. Keyboard focus exposes the same video preview treatment. Videos autoplay muted, loop, and play inline; previews resume when they enter view.

## Build and run

From a fresh source clone, with Node 22 and npm (replace `<repository-url>` with the source repository URL):

```sh
git clone <repository-url> blog-showcase
cd blog-showcase
npm ci
npm run build
npm run preview
```

If the project is published inside a larger repository, enter its `blog-showcase` project directory before running the npm commands. The restore script locates the project relative to itself, so it does not depend on the clone's absolute path.

`npm run build` runs `prebuild` automatically to restore the two oversized videos before TypeScript/Vite starts. `npm run dev` similarly runs `predev` before starting Vite. `npm ci` alone does not restore assets. To restore without installing any packages, use `node scripts/restore-assets.cjs`. All reconstruction inputs are in the source checkout; restoration requires no network, Git LFS, original server files, or external tools.

Visit `http://localhost:4173/motionsites-results/blog-showcase/`. Vite's base is `/motionsites-results/blog-showcase/`; all fonts, videos, JavaScript and CSS respect that path. The complete static deliverable is in `dist/`, including `dist/index.html`.

The provided host uses Docker:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Supabase data

`supabase/schema.sql` creates `public.blog_posts`, inserts all four exact posts with their source URLs and `display_order`, enables RLS, and grants public SELECT access to `anon` and `authenticated`. It creates no public write policy. Run this file in your Supabase SQL editor, then copy `.env.example` to `.env.local` and set the project URL and public anon key. Rebuild after changing environment variables. Never put a service role key in the frontend.

When configured, the application queries `blog_posts` through the Supabase client and orders by `display_order` ascending. Updated database video URLs are honored. The four supplied URLs resolve to local copies for reliable delivery. Without credentials, the site renders the exact seeded collection locally. A configured database failure displays a short notice while retaining the saved collection; an empty successful query renders an empty collection.

**Limitation:** No Supabase project or credentials were provided. The live table, migration execution, and actual remote RLS behavior could not be verified. The schema, seed, policy, query, and connection configuration are included; this deliverable currently uses the local seed data.

## Assets

All four specified CloudFront MP4 files downloaded successfully. The two smaller videos, `public/videos/lighting.mp4` and `public/videos/editing.mp4`, remain normal source files. The two oversized originals are packaged as six binary chunks under `asset-chunks/`:

| Reconstructed file | Original bytes | Chunk sizes (bytes, in order) |
| --- | ---: | --- |
| `public/videos/featured.mp4` | 108874018 | 50331648, 50331648, 8210722 |
| `public/videos/business.mp4` | 128831264 | 50331648, 50331648, 28167968 |

Every chunk is at most 48 MiB, strictly below 50 MiB. `asset-chunks/manifest.json` records the exact original CloudFront source URL, original path, byte count and SHA256, plus the ordered project-relative chunk paths, byte counts and SHA256 values. Only these two oversized clips are chunked. They have not been transcoded, compressed, or replaced.

`scripts/restore-assets.cjs` first verifies every chunk, even when originals already exist. Missing, truncated, or corrupt chunks stop build/dev with a nonzero exit. Missing or invalid originals are reconstructed into unique sibling temporary files, checked against the original SHA256 and byte count, synced to disk, then atomically renamed into place. Valid originals are hash-checked and left untouched. Temporary files are cleaned up on handled failures.

The reassembled `public/videos/featured.mp4`, `public/videos/business.mp4` and all `dist/` output are ignored in `.gitignore`. They remain on disk for delivery and can be recreated from source. Keep `asset-chunks/`, both smaller videos, fonts, scripts, and the dependency lockfile in the source package. No Git commands or publication operations were run during this repair.

Inter 400/500/600 and Outfit 500/600/700 were downloaded from Google Fonts and are self-hosted in `public/fonts/`, with their OFL licenses and original source CSS. There are no runtime third-party font or video dependencies for the seeded content.

The four original video files total 277594006 bytes (approximately 265 MiB). A range-capable HTTP server is recommended for delivery. `scripts/fetch-assets.py` records the asset origins and download procedure.

## Verification

A real TypeScript/Vite production build was run using the provided Docker image after the packaging repair. After building, reproduce the restoration tests with:

```sh
node scripts/verify-assets.cjs
```

This test temporarily renames both originals, restores and compares exact SHA256/size, removes the backups, verifies repeat runs leave valid files untouched, rejects corrupt and missing chunks, repairs an invalid original, and verifies all four videos and six fonts still match `screenshots/asset-manifest.json`. It writes `screenshots/packaging-checks.json`. The originals are restored in a `finally` block if a test fails. Do not run the test concurrently with a build or asset downloader.

The npm build/dev hooks both invoke the same dependency-free restore script. The repair was also verified with the real production build and browser playback checks. Chromium checks use its existing `/app/node_modules/playwright-core` and `/usr/bin/chromium`:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'node scripts/browser-check.cjs'
```

The script serves the production build temporarily on port 4173. It verifies 1440×1000 desktop, 390×844 mobile, 1024px tablet, and the 768px breakpoint, checks layout overflow, fonts and video playback, verifies all four hover animations, tests the post-grid anchor and keyboard focus, and collects page errors and HTTP failures. Full-page screenshots are saved as `screenshots/desktop.png` and `screenshots/mobile.png`; detailed measurements are in `screenshots/checks.json`.

No deployment, push, or external publication was performed by this session. `ready` in `result.json` means the static build is available for review, not that the site is online.
