# Photographic layer recovery

Source attribution: the user-supplied **Mythic Naturecore / Reverie** original animated design reference. The source creator is not named in the supplied materials. No ownership of the reference photography is claimed. Recovery was explicitly authorized by this project's repair request.

Source URL: https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(72).webp

`reference.webp` is the unmodified 640×480, 74-frame source (about 2.3 MiB), retained for reproducibility, and is never shipped as a runtime background or animation. The separately supplied local preview was only a single 640×480 frame. `screenshots/reference-contact.jpg` documents sampled reference frames.

## Reproduce

Use Python 3.9+ with Pillow 11.3.0, numpy 2.0.2, and opencv-python-headless 5.0.0.93. Install into a temporary project-local environment, then run:

```sh
python scripts/recover-reference.py
```

The output goes into `public/assets/*-recovered.*`; numeric registration evidence is in `recovery-report.json`. No virtualenv, Python wheel or vendor dependency is retained in the deliverable.

## Recovered pixels and approximations

- **Portal:** frame 0's inset scene is cropped to `(82,88,557,393)` to exclude the reference presentation border. SIFT features and RANSAC affine alignment register frames 24–36 back to that scene. Features inside the independently moving forest opening and over UI are excluded. Later unoccluded photographic pixels repair parts covered by the original UI.
- Remaining title, card, cursor, and navigation occlusions are removed by local inpainting and seamless transplantation of nearby foliage from this same reference. Small canvas margin strips are reconstructed and alpha-feathered. These areas are approximate photographic texture, not recovered original asset detail. The right card footprint has the largest reconstruction; its stone/foliage arrangement cannot exactly reproduce the unavailable source.
- A traced, rounded alpha opening removes the portal's interior forest. This creates a genuinely transparent, independently transformed portal over the separate world layer. The alpha silhouette and soft edge are approximations of the compressed reference.
- **World:** the scene's forest is cropped from frame 44 at `(130,108,554,392)`, before the final CTA appears, excluding preview navigation, borders and left portal remnants. The small cursor is locally inpainted. Upsampling produces no additional original detail.
- **Curtains:** separate photographic foliage pieces from the cleaned left/right portal margins receive soft alpha masks and retain independent curtain transforms. Original curtain silhouettes could not be recovered exactly.
- **Cards:** frame 0 provides the ordered green landscape portal, ivory architectural arch, and nested green doorways. Clean upper art is isolated above all original labels/play buttons and resized to square crops. These very small crops are visibly soft and their aspect/crop is approximate. All labels, patron numbers, play icons, and interactions are newly rendered DOM.

The low-resolution compressed reference limits sharpness at 1440px. No entire reference screenshot, burned-in navigation/headline/button composition, unrelated forest stock photo, illustrated landscape, or prerecorded reference animation is used as the rendered scene.

The original seven Cloudinary assets and two legitimate URL variants were retried; all returned 401. The exact original constants remain in the React source. `asset-report.json` retains the original response record. If the source account is restored, setting the corresponding recorded status to `200` switches to its exact original URL on the next build, with the recovered local image as an error fallback.
