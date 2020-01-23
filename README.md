# OCR
[![Build Status](https://travis-ci.org/janis91/ocr.svg?branch=master)](https://travis-ci.org/janis91/ocr) [![Total alerts](https://img.shields.io/lgtm/alerts/g/janis91/ocr.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/janis91/ocr/alerts/) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/96e643bf329d473e9968b20ba4f11a50)](https://www.codacy.com/app/janis91/ocr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=janis91/ocr&amp;utm_campaign=Badge_Grade) [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

<img align="left" src="screenshots/app.png" height="100">

Nextcloud OCR (optical character recognition) processing for images and PDF with tesseract-js brings OCR capability to your Nextcloud.
The app uses [tesseract-js](https://tesseract.projectnaptha.com/) by [@jeromewu](https://github.com/jeromewu) in the browser in order to process images (png, jpeg, tiff, bmp) and small PDFs and saves the output file to the source folder in nextcloud. That for example enables you to search in it.

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - [Nextcloud 16 and up](https://nextcloud.com/)
 - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)
 - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).


_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._

## Installation
Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.

## Disclaimer
The software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.

## Note
The version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the "not-maintained" branch to work on improvements. The author wasn't able to support it because of too much effort.
Moreover this project is based on a webassembly port of tesseract and some in browser tools for pdf handling, which especially in case of processing PDF files leads to quite some overhead compared to tools like [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF). Please consider, that output files can get quite big and the process may take quite long, too.
