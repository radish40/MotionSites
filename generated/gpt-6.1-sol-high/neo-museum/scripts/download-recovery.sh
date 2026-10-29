#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p recovery
curl --fail --location 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(75).webp' -o recovery/reference-source.webp
curl --fail --location 'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/ammonite_A.Scott_090319.jpg' -o recovery/ammonite.jpg
curl --fail --location 'https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/Animals_ArachnidsRelatives_00008.jpg' -o recovery/trilobite.jpg
