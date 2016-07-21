# OCR (0.6.2-beta)
**This software is in beta phase and should not be integrated in any production environment. If you want to test it and give feedback, please open an issue. Thank You!**
Nextcloud OCR processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Nextcloud 9.
The app uses tesseract-ocr and OCRmyPDF in order to process images (png, jpeg, tiff) and PDF (currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF)) and save the output file to the same folder in nextcloud.
The source data won't get lost. Instead:
 - in case of a PDF a copy will be saved with an extra layer of the processed text, so that you are able to search in it.
 - in case of a image the result of the OCR processing will be saved in a .txt file next to the image (same folder). 
  

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - **[Nextcloud 9](https://nextcloud.com/)** or higher
 - **Linux** server as environment. (tested with debian and ubuntu)
 - **[OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF)** >v2.x (tested with v4.1.3)
 - **[tesseract-ocr](https://github.com/tesseract-ocr/tesseract)** >v3.02.02 with corresponding language files (eg. tesseract-ocr-eng)
Otherwise the app won't work.
*Hint: OCRmyPDF and tesseract have to be globally available in command-line, so that the server user (eg. www-data, nginx, apache) can execute the commands (eg. tesseract or ocrmypdf).*

## Installation
*Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) * (**Not yet implemented**) or download/clone the git repository and place the content in **nextcloud/apps/ocr/**.

## Usage
The app integrates within the standard _files_ app of Nextcloud.
In the Nextcloud file list the OCR action is registered as a fileaction like the _delete_ or _download_ action.
**Depending on the filesize, especially when processing a pdf, the ocr process is a long running process (tested with 120KB -> 10s). It is absolutely recommended to do nothing in nextcloud until processing finishes.**

# Developer information
## Building the app

The app can be built by using the provided Makefile by running:

    make

This requires the following things to be present:
* make
* which
* tar: for building the archive
* curl: used if phpunit and composer are not installed to fetch them from the web

## Publish to App Store (not available for nextcloud yet)

_First get an account for the [App Store](http://apps.nextcloud.com/) then run:

    make appstore

The archive is located in build/artifacts/appstore and can then be uploaded to the App Store._

## Running tests
You can use the provided Makefile to run all tests by using:

    make test

This will run the PHP unit and integration tests and if a package.json is present in the **js/** folder will execute **npm run test**

Of course you can also install [PHPUnit](http://phpunit.de/getting-started.html) and use the configurations directly:

    phpunit -c phpunit.xml

or:

    phpunit -c phpunit.integration.xml

for integration tests
