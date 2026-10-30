#!/bin/sh
set -eu
# Pass an installed FFmpeg binary; originals are retained byte-for-byte.
ffmpeg_bin=${1:-ffmpeg}
for asset in hero about; do
  "$ffmpeg_bin" -y -hide_banner -loglevel error -i "assets-source/${asset}-hevc.mp4" \
    -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p -movflags +faststart -an \
    "public/assets/${asset}.mp4"
done
