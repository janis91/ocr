#!/bin/bash

# Create release folder
mkdir release

# Copy everything to release folder
cp -R appinfo release/appinfo
cp -R css release/css
cp -R img release/img
cp -R l10n release/l10n
cp -R lib release/lib
cp -R redis release/redis
cp -R templates release/templates
cp AUTHORS.md release/AUTHORS.md
cp CHANGELOG.md release/CHANGELOG.md
cp COPYING release/COPYING
cp personal.php release/personal.php
cp README.md release/README.md

# JS
mkdir release/js
cd js/
npm install
npm run build
cd ..
# Copy js artifacts
cp -R js/dist release/js/dist

# WORKER
mkdir release/worker
# Copy files for worker
cp -R worker/src release/worker/src
cp worker/.dockerignore release/worker/.dockerignore
cp worker/Dockerfile release/worker/Dockerfile
cp worker/package.json release/worker/package.json
cp worker/tsconfig.json release/worker/tsconfig.json
cp worker/tsconfig.app.json release/worker/tsconfig.app.json


# Package the release
mv release ocr
tar cfz ocr.tar.gz ocr

# Cleanup
rm -rf ocr/
