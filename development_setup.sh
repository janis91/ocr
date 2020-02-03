mkdir vendor
mkdir vendor/tesseract.js

cp node_modules/tesseract.js/dist/worker.min.js vendor/tesseract.js/worker.min.js
cp node_modules/tesseract.js/dist/worker.min.js.map vendor/tesseract.js/worker.min.js.map
cp node_modules/tesseract.js-core/tesseract-core.wasm.js vendor/tesseract.js/tesseract-core.wasm.js
cp node_modules/tesseract.js-core/tesseract-core.js vendor/tesseract.js/tesseract-core.js
cp node_modules/tesseract.js-core/tesseract-core.wasm vendor/tesseract.js/tesseract-core.wasm
cp node_modules/tesseract.js-core/tesseract-core.asm.js vendor/tesseract.js/tesseract-core.asm.js