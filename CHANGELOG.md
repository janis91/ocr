#Changelog

nextcloud-ocr (0.8.3-beta)
* **Feature**: Now a asynchronous processing of multiple files is in place brought by gearman server.
* **Enhancement**: Completely reworked all code in order to get more performance, testing capability, travis-ci integration and much more.
* **Bugfix**: Many bugs have been fix (maybe there are some remaining, so please open issues!).
* **Organizational**: Nextcloud 10 and 11 are the target of this app now.

nextcloud-ocr (0.7.0-beta)
* **Enhancement**: PSR compatible folder structure. better loose coupling. integrated gearman for workflow.

nextcloud-ocr (0.6.2-beta)
* **Bugfix**: Fixed a strange behaviour with the update of the filelist after processing. Fixed the loading image (has changed in nextcloud).

nextcloud-ocr (0.6.1 beta)
* **Organizational**: Recognizing the movement from Owncloud 9 to Nextcloud 9, I decided to change the apps runtime to Nextcloud. It seems that this will be the more "Open" future cloud.

owncloud-ocr (0.6.0 beta)
* **Organizational**: The app is beta now. Unit tests and integration test are written and have successfully processed (the main problem with testing is the File I/O and CLI thing which cannot be tested easy, so I left them out for now). The best thing would be a test on a few other instances. If these work well, the app is likely stable.

owncloud-ocr (0.5.0 alpha)
* **Organizational**: OCR App should be uploaded to apps.owncloud.com (Account is requested). Translation with Transifex is also requested.
* **Enhancement**: FileList now updates after OCR processing successfully finished. OCR fileactions get disabled and WIP sign is showing while processing.
* **Bugfix**: OCRmyPDF now works as expected (tmp file got saved wrong).
* **Security**: The JSON Response now holds only status and message of the OCR processing. No more details like internal paths.

owncloud-ocr (0.4.0 alpha)
* **Enhancement**: OCR Processing works. Error handling is also ready. translation of all messages done. (english/german)
* **Work in progress**: Test cases.

owncloud-ocr (0.3.0 alpha)
* **Enhancement**: added the selection for multiple language support of ocr processing.
* **Work in progress**: OCR Processing.

owncloud-ocr (0.0.1 alpha)
* **Initial Commit**: start of development
* **New dependency**: initialy the app is based on OC9 and PHP 5.6. tesseract-ocr and OCRmyPDF are also required.
