#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
# The specified Cloudflare thumbnail returned HTTP 404 on 2026-10-30.
# This extracts a clean frame from the exact specified Mux video, not a page screenshot.
curl -fL --max-time 60 'https://image.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc/thumbnail.jpg?time=0&width=1920' -o public/assets/video-poster.jpg
