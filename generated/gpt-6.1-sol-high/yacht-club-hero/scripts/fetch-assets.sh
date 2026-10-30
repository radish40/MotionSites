#!/bin/sh
# Run from the project root. Original prompt assets, cached without modification.
set -eu
mkdir -p public/assets
curl -fL --max-time 90 'https://app-uploads.krea.ai/wan-videos/08006647-1c55-4823-b35d-e40d57c66bf8.mp4' -o public/assets/ocean-eclipse.mp4
curl -fL --max-time 90 'https://app-uploads.krea.ai/wan-videos/91fd9932-6194-4d58-ada0-955692853019.mp4' -o public/assets/black-sovereign.mp4
curl -fL --max-time 90 'https://app-uploads.krea.ai/wan-videos/95fb3282-d7cf-448e-9202-ef0662541c83.mp4' -o public/assets/azure-horizon.mp4
curl -fL --max-time 90 'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf' -o public/assets/instrument-serif-regular.ttf
curl -fL --max-time 90 'https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf' -o public/assets/instrument-serif-italic.ttf
