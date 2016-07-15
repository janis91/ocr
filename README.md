# Ocr
**This software is absolutely alpha and should not be integrated in any production environment.**
Owncloud OCR processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Owncloud 9.
It is able to use tesseract-ocr and OCRmyPDF in order to process images (png, jpeg, tiff) and PDF (currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF)) and save the output file to the same folder in owncloud.
The source data won't get lost. Instead:
 - in case of a PDF a copy will be saved with an extra layer of the processed text, so that you are able to search in it.
 - in case of a image the result of the OCR processing will be saved in a .txt file next to the image (same folder). 
  

## Prerequisites, Requirements and Dependencies
The OCR app for Owncloud 9 has some prerequisites. The dependencies should run on a linux server.
In order to use the app in Owncloud, [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF) and [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) with it's corresponding language files hast to be installed.
Otherwise the app won't work.
OCRmyPDF and tesseract have to be globally available in command-line, so that the server user (eg. www-data, nginx, apache) can execute the commands (eg. tesseract or ocrmypdf).

## Installation
Install the app from the [Owncloud AppStore](http://apps.owncloud.com) or download/clone the git repository and place the content in **owncloud/apps/ocr/**.

## Usage
The app integrates within the standard files app of Owncloud. If you 

# Developer information
## Building the app

The app can be built by using the provided Makefile by running:

    make

This requires the following things to be present:
* make
* which
* tar: for building the archive
* curl: used if phpunit and composer are not installed to fetch them from the web
* npm: for building and testing everything JS, only required if a package.json is placed inside the **js/** folder

The make command will install or update Composer dependencies if a composer.json is present and also **npm run build** if a package.json is present in the **js/** folder. The npm **build** script should use local paths for build systems and package managers, so people that simply want to build the app won't need to install npm libraries globally, e.g.:

**package.json**:
```json
"scripts": {
    "test": "node node_modules/gulp-cli/bin/gulp.js karma",
    "prebuild": "npm install && node_modules/bower/bin/bower install && node_modules/bower/bin/bower update",
    "build": "node node_modules/gulp-cli/bin/gulp.js"
}
```


## Publish to App Store

First get an account for the [App Store](http://apps.owncloud.com/) then run:

    make appstore

The archive is located in build/artifacts/appstore and can then be uploaded to the App Store.

## Running tests
You can use the provided Makefile to run all tests by using:

    make test

This will run the PHP unit and integration tests and if a package.json is present in the **js/** folder will execute **npm run test**

Of course you can also install [PHPUnit](http://phpunit.de/getting-started.html) and use the configurations directly:

    phpunit -c phpunit.xml

or:

    phpunit -c phpunit.integration.xml

for integration tests