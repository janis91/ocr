# OCR (v2.3.0)
[![Build Status](https://travis-ci.org/janis91/ocr.svg?branch=master)](https://travis-ci.org/janis91/ocr) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/janis91/ocr/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/janis91/ocr/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Nextcloud OCR (optical character recognition) processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Nextcloud 10.
The app uses tesseract-ocr, OCRmyPDF and a php internal message queueing service in order to process images (png, jpeg, tiff) and PDF (currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF)) asynchronously and save the output file to the same folder in nextcloud, so you are able to search in it.
The source data won&#39;t get lost. Instead:
 - in case of a PDF a copy will be saved with an extra layer of the processed text, so that you are able to search in it.
 - in case of a image the result of the OCR processing will be saved in a .txt file next to the image (same folder). 

**One big feature is the asynchronous ocr processing brought by the internal php message queueing system (Semaphore functions), which supports workers to handle tasks asynchronous from the rest of nextcloud.**

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - **[Nextcloud 10](https://nextcloud.com/)** or higher
 - **Linux** server as environment. (tested with Debian 8, Raspbian and Ubuntu 14.04 (Trusty))
 - **[OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF)** &gt;v2.x (tested with v4.1.3 (v4 is recommended))
 - **[tesseract-ocr](https://github.com/tesseract-ocr/tesseract)** &gt;v3.02.02 with corresponding language files (e.g. tesseract-ocr-eng)

**Please consider: The app is and will not working with any activated encryption.**

For further information see the [homepage](http://janis91.github.io/ocr/) or the appropriate documentation in the wiki.

*Hint: OCRmyPDF and tesseract have to be globally available in command-line, so that the server user (eg. www-data, nginx, apache) can execute the commands (eg. tesseract or ocrmypdf).*

## Installation
Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download/clone the git repository and place the content in **nextcloud/apps/ocr/**.

**Please consider: The app will not work as long as the OCRWorker isn't running. (more information in the [wiki](https://github.com/janis91/ocr/wiki))**

Please remind, that the app will not work as expected or maybe cannot be even installed as long as the prior mentioned Dependencies are not available.

## Administration and Usage
Please read the related topics in the [wiki](https://github.com/janis91/ocr/wiki) or on [OCR site](https://janis91.github.io/ocr/).

## Disclaimer
The software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.
