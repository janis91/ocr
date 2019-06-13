[![OCR](https://raw.githubusercontent.com/janis91/ocr/master/screenshots/app.png)](https://github.com/janis91/ocr)
# OCR
[![Build Status](https://travis-ci.org/janis91/ocr.svg?branch=master)](https://travis-ci.org/janis91/ocr) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/96e643bf329d473e9968b20ba4f11a50)](https://www.codacy.com/app/janis91/ocr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=janis91/ocr&amp;utm_campaign=Badge_Grade) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Nextcloud OCR (optical character recognition) processing for images and PDF with tesseract-js brings OCR capability to your Nextcloud.
The app uses tesseract-js in the browser in order to process images (png, jpeg, tiff) and PDFs and saves the output file to the source folder in nextcloud. That for example enables you to search in it. (Hint: currently not all PDF-types are supported)

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - **[Nextcloud 15 or 16](https://nextcloud.com/)**.

## Consideration
The version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the "not-maintained" branch to work on improvements. The author wasn't able to support it because of too much effort.

## Installation
Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.

## Disclaimer
The software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.
