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
mkdir release/vendor
mkdir release/vendor/tesseract.js
mkdir release/vendor/choices.js
cd js/
npm install
npm run build
cd ..
# Copy js artifacts
cp js/ocr.js release/js/ocr.js
cp -R js/node_modules/tesseract.js/dist release/vendor/tesseract.js
cp js/node_modules/tesseract.js-core/tesseract-core.wasm.js release/vendor/tesseract.js/tesseract-core.wasm.js
cp js/node_modules/tesseract.js-core/tesseract-core.js release/vendor/tesseract.js/tesseract-core.js
cp js/node_modules/tesseract.js-core/tesseract-core.wasm release/vendor/tesseract.js/tesseract-core.wasm
cp js/node_modules/tesseract.js-core/tesseract-core.asm.js release/vendor/tesseract.js/tesseract-core.asm.js
cp js/node_modules/choices.js/public/assets/scripts/choices.min.js release/vendor/choices.js/choices.min.js

# Copy css artifacts
cp js/node_modules/choices.js/public/assets/styles/choices.min.css release/vendor/choices.js/choices.min.css

# Create tessdata folder
mkdir release/tessdata
mkdir release/tessdata/4.0.0

# Copy tessdata folder
cp -R tessdata/4.0.0 release/tessdata/4.0.0

# Package the release
mv release ocr
tar cfz ocr.tar.gz ocr

# Cleanup
rm -rf ocr/
