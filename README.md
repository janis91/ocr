[![OCR](https://raw.githubusercontent.com/janis91/ocr/master/screenshots/app.png)](https://github.com/janis91/ocr)
# OCR (v3.1.0)
[![Build Status](https://travis-ci.org/janis91/ocr.svg?branch=master)](https://travis-ci.org/janis91/ocr) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/janis91/ocr/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/janis91/ocr/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Nextcloud OCR (optical character recognition) processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Nextcloud.
The app uses a docker container with tesseract-ocr, OCRmyPDF and communicates over redis in order to process images (png, jpeg, tiff) and PDF asynchronously and save the output file to the source folder in nextcloud. That for example enables you to search in it. (Hint: currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF))

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - **[Nextcloud 12](https://nextcloud.com/)**. For older versions take an older major version of this app.
 - **Linux** server as environment. (tested with Debian 8 and Ubuntu 14.04 (Trusty)) **currently not compatible to ARM processors like raspberry**
 - **Docker** is used for processing files. tesseract-ocr and OCRmyPDF reside in a docker container.
 - **php-redis** is used for the communication and has to be a part of your php.

## Limitations
Currently the app is not working with any activated encryption, nor is it working with files shared via external storage or federated sharing. This has to be considered. If one wants to process such a file, it must be copied to the local environment.

For further information see the [homepage](https://github.com/janis91/ocr/wiki/Usage) or the appropriate documentation in the wiki.

## Installation
Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download/clone the git repository and place the content in **nextcloud/apps/ocr/**.

**Please consider: The app will not work as long as the Docker container isn't running. (more information in the [wiki](https://github.com/janis91/ocr/wiki))**

## Administration and Usage
Please read the related topics in the [wiki](https://github.com/janis91/ocr/wiki).

## Disclaimer
The software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.
