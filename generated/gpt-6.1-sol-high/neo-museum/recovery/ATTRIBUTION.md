# Specimen recovery and attribution

The disabled Cloudinary originals are preserved in `src/App.tsx` as `originalMedia`. This recovery was expressly authorized in the design-specific repair request. The website ships isolated photographic elements, never a flattened page image. All type, SVG wordmark, captions, labels, buttons, dialogs and chapter controls are live React DOM.

## Recovered from Neo Museum's own reference

Source: [authorized 73-frame animated reference](https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(75).webp). `recovery/reference-source.webp` is the downloaded original; `reference.webp` is the provided one-frame local preview. The supplied reference is 640×468, so recovered specimens have an unavoidable resolution limit.

- `hero-skeleton.png`: full photographic skull, ribs and legs isolated from frame 0. Frames 0, 6 and 15 were compared; the skull becomes clipped in later frames, so frame 0 supplies the most complete specimen. A manually defined anatomical region plus chroma segmentation excludes monochrome UI and the underlying diagram; morphological cleanup reconstructs bone shadows within the colored silhouette. No header, title or controls are included in the published layer. The tail remains clipped as in the source composition.
- `pterodactyl.png`: recovered from frame 45, compared with frames 42 and 48 to select a complete, unoccluded view. Chroma segmentation separates it across both the light and dark page backgrounds. The source itself depicts a skeletal flying reptile with wing membranes.
- `chapter-1.png`: small T. rex specimen isolated from the chapter panel at frame 72.
- `chapter-5.png`: mammoth specimen isolated from frame 57, compared with frames 51 and 54 to avoid dissolve blur.
- `chapter-3.png`: an explicitly approximated chapter assignment using the recovered pterodactyl. The original chapter-3 specimen is not shown in the available reference.

The original MP4 was **not** recovered or decoded. The hero animates the recovered still using a visible, alternating 14-second CSS translation, rotation and scale after the original 2800ms reveal. Pause/play controls affect this real fallback motion. This is camera-like motion, not the original articulated dinosaur video. The subtle diagram behind it is newly drawn SVG geometry plus a low-opacity duplicate of the isolated specimen.

## Public-domain photographic equivalents

The reference does not show the original chapter-2 or chapter-4 specimens. These are closely related natural-history replacements, downloaded locally and masked to transparent backgrounds by `scripts/recover.py`:

- `chapter-2.png`: **Trilobite Fossil**, Bruce Avera Hunter / USGS. [Source and Public Domain statement](https://www.usgs.gov/media/images/trilobite-fossil-0). [Original photograph](https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/Animals_ArachnidsRelatives_00008.jpg). A fossil slab, with near-black background removed and crop/resize applied.
- `chapter-4.png`: **Fossil Ammonite**, Annie Scott / USGS. [Source and Public Domain statement](https://www.usgs.gov/media/images/fossil-ammonite). [Original photograph](https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/ammonite_A.Scott_090319.jpg). The shell is isolated with a hand-traced polygon, then cropped; the page/background is removed.

## Reproduce

From the project root, run `sh scripts/download-recovery.sh`, create a project-local Python virtual environment, install `recovery/requirements.txt`, then run `python scripts/recover.py` using that environment. Pillow, NumPy and OpenCV are recovery-only dependencies; they are not shipped. The extraction parameters and masks are in the script. `recovery/contact.jpg` and selected frame enlargements document visual comparison, and are excluded from `dist/` by location.
