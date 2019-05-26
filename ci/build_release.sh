#!/bin/bash

# Create release folder
mkdir release

# Copy everything to release folder
cp -R appinfo release/appinfo
cp -R css release/css
cp -R img release/img
cp -R l10n release/l10n
cp -R lib release/lib
cp AUTHORS.md release/AUTHORS.md
cp CHANGELOG.md release/CHANGELOG.md
cp COPYING release/COPYING
cp README.md release/README.md

# JS
mkdir release/js
cd js/
npm install
npm run build
cd ..
# Copy js artifacts
cp -R js/dist release/js/dist

# Package the release
mv release ocr
tar cfz ocr.tar.gz ocr

# Cleanup
rm -rf ocr/
