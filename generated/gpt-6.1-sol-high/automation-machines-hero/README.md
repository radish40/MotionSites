# Automation Machines

Design ID: `automation-machines-hero`.

A single viewport black hero, built from PROMPT.md with React 19, Vite 6, Tailwind CSS 4 and its Vite plugin, Motion, Lucide React, and React Spline. Includes the exact heading, description, specification rows, pills, responsive spacing, and staged entrance animations. Icon buttons use the requested hover treatment and accessible labels; the prompt specifies no click actions. The background remains available for the original scene's pointer interactions.

## Run and build

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The Vite base is `/motionsites-results/automation-machines-hero/`. Open that path on the development or preview server. `dist/` is the complete static publishing artifact. `package-lock.json` locks the installed versions within the exact caret ranges supplied by the prompt.

On this host (without Node/npm), run:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm ci && npm run build'
```

## Assets

The original scene was successfully downloaded from `https://prod.spline.design/PIgTjpRFA03yfLyK/scene.splinecode` and is served unchanged as `public/assets/scene.splinecode`. React lazy loading and Suspense wrap Spline, with a black full-size fallback. The background has the specified 15% horizontal offset. No reference screenshots or extracted substitutes are used. The optional reference WebP is absent on this host.

CSS imports the exact Google Fonts URL from the prompt and defines all four requested font families. Fonts require access to Google Fonts. `public/assets/google-fonts-original.css` records the stylesheet returned by that URL during asset verification.

## Verification

Browser verification uses the built files over HTTP at the configured subpath, Playwright Core and Chromium in the provided Docker image:

```sh
docker run --rm -u 1000:1000 -e HOME=/tmp \
  -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 \
  -c 'npm run check:browser'
```

The script checks desktop 1440×1000 and mobile 390×844, Spline load and canvas, loaded font families, horizontal overflow, exact row and icon counts, icon hover/click reception, keyboard navigation, and uncaught script errors. Screenshots and machine-readable browser results are saved to `screenshots/`. The test harness holds requestAnimationFrame callbacks three seconds after the real Spline scene loads to make screenshots reproducible and keep software WebGL from starving interaction checks. This affects only the automated browser, not production code; screenshots show the actual rendered 3D scene.

Final checks passed at both requested viewports: no horizontal overflow, no uncaught script errors, no failed requests, all three required active fonts loaded, and the original 3D canvas rendered. Both screenshots were visually inspected. Full-page dimensions remain 1440×1000 and 390×844 respectively. The final static build is ready for review.

## Limitations

Spline is a substantial third-party WebGL runtime. Vite reports large lazy-loaded chunks. Headless Chromium uses software WebGL on this host, so scene loading and frame rates can be slower than hardware-accelerated browsers. Technical specification values are the required display copy, not measurements of a backend service. No deployment or push was performed.
