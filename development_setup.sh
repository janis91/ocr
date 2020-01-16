mkdir vendor
mkdir vendor/tesseract.js
mkdir vendor/choices.js
mkdir vendor/pdf.js
mkdir vendor/pdf-lib

cp js/node_modules/tesseract.js/dist/tesseract.min.js vendor/tesseract.js/tesseract.min.js
cp js/node_modules/tesseract.js/dist/worker.min.js vendor/tesseract.js/worker.min.js
cp js/node_modules/tesseract.js-core/tesseract-core.wasm.js vendor/tesseract.js/tesseract-core.wasm.js
cp js/node_modules/tesseract.js-core/tesseract-core.js vendor/tesseract.js/tesseract-core.js
cp js/node_modules/tesseract.js-core/tesseract-core.wasm vendor/tesseract.js/tesseract-core.wasm
cp js/node_modules/tesseract.js-core/tesseract-core.asm.js vendor/tesseract.js/tesseract-core.asm.js
cp js/node_modules/choices.js/public/assets/scripts/choices.js vendor/choices.js/choices.min.js
cp js/node_modules/pdfjs-dist/build/pdf.js vendor/pdf.js/pdf.min.js
cp js/node_modules/pdfjs-dist/build/pdf.worker.js vendor/pdf.js/pdf.worker.min.js
cp js/node_modules/pdf-lib/dist/pdf-lib.js vendor/pdf-lib/pdf-lib.min.js

# Copy css artifacts
cp js/node_modules/choices.js/public/assets/styles/choices.css vendor/choices.js/choices.min.css