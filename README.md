# OCR (v0.8.3-beta)
[![Build Status](https://travis-ci.org/janis91/ocr.svg?branch=master)](https://travis-ci.org/janis91/ocr) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/janis91/ocr/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/janis91/ocr/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/janis91/ocr/?branch=master)

**This software is in beta phase and should not be integrated in any production environment. If you tested it and want to give feedback, please open an issue. Thank You!**
Nextcloud OCR processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Nextcloud 10.
The app uses tesseract-ocr, OCRmyPDF and Gearman in order to process images (png, jpeg, tiff) and PDF (currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF)) and save the output file to the same folder in nextcloud.
The source data won't get lost. Instead:
 - in case of a PDF a copy will be saved with an extra layer of the processed text, so that you are able to search in it.
 - in case of a image the result of the OCR processing will be saved in a .txt file next to the image (same folder). 

**One big feature is the asynchronous ocr processing brought by the gearman library, which supports workers to handle tasks asynchronous from the rest of nextcloud.**

## Prerequisites, Requirements and Dependencies
The OCR app has some prerequisites:
 - **[Nextcloud 10](https://nextcloud.com/)** or higher
 - **Linux** server as environment. (tested with debian and ubuntu)
 - **[OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF)** >v2.x (tested with v4.1.3)
 - **[tesseract-ocr](https://github.com/tesseract-ocr/tesseract)** >v3.02.02 with corresponding language files (eg. tesseract-ocr-eng)
 - **[gearman-server](http://gearman.org/)** and **[gearman-php](https://pecl.php.net/package/gearman)** typically these dependencies should be available in most Linux environments via apt-get or similar package managers. Consider that the php7 version of gearman isn't completely there yet.
 
Otherwise the app won't work.

*Hint: OCRmyPDF and tesseract have to be globally available in command-line, so that the server user (eg. www-data, nginx, apache) can execute the commands (eg. tesseract or ocrmypdf). For an app version which does not require gearman server, you could try the beta version 0.6.2 (but I don't recommend that, because it is not tested very well).*

## Installation
Install the app from the [Nextcloud AppStore](http://apps.nextcloud.com) (**Not yet implemented**) or download/clone the git repository and place the content in **nextcloud/apps/ocr/**.
Please remind, that the app will not work as expected or maybe cannot be even installed as long as the prior mentioned Dependencies are not available.

## Administration
After you have installed all dependencies and the app itself, you will have to get the GearmanWorker running in a seperate process (beside your server / nginx / apache). The worker is located in the *worker* directory of the ocr app directory (*server/apps/ocr/worker*). You have to start the file *GearmanOCRWorker.php* with the *php* command like following:

``php GearmanWorker.php``

The worker and the client (your nextcloud server) are configured for the server address 127.0.0.1 port 4730 (this is the standard configuration for gearman-job-server).

**Please make sure, that you start this command with the user of your webserver (the one that runs nextcloud).**

*Also have in mind that you could use something like a cronjob for reinitialization after restart and `nohup` for executing still after you leave the shell or logout.*

## Usage
The app integrates within the standard _files_ app of Nextcloud.
In the Nextcloud file list the OCR action is registered as a fileaction like the _delete_ or _download_ action.

**Depending on the filesize, especially when processing a pdf, the ocr process is a long running process (tested with 120KB -> 10s). It is absolutely recommended to do nothing with the files which are processed in nextcloud until processing finishes.**


## Disclaimer
The software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied.
