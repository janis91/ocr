#Changelog
nextcloud-ocr (3.2.0)
* **Feature**: Now the result of a processed image will always be a pdf file, not a txt file anymore.
* **Bugfix**: The ENOENT error in the worker should be fixed now.
nextcloud-ocr (3.1.0-beta.1)
* **Feature**: Now files can be replaced by selecting a checkbox.
nextcloud-ocr (3.0.0-beta.8)
* **Upcoming Release**: The next major release of OCR is here soon. Some tests have too pass before I will publish it. But This is kind of a Release Candidate.
* **Security**: Added the possibility to specify a password for Redis and added the respective configuration.
nextcloud-ocr (3.0.0-beta.7)
* **Upcoming Release**: The next major release of OCR is here soon. Some tests have too pass before I will publish it. But This is kind of a Release Candidate.
* **Major Changes**: The app got completely refactored. It now is based on redis for the communication with a worker which got also completely reworked and is now basically a nodejs application. This nodejs worker gets setup inside of a docker container to have always the latest tesseract and ocrmypdf available and be much more scalable than before. Maybe already Cloud ready. The other refactoring part targeted the php code, that got a lot better now and can now be adjusted way faster and gets way more unit tested than before. This applies also for the worker. Moreover an administration page is now available to configure the redis endpoint and the installed languages inside of the ocr worker container. Another part is the logging capability. In case of an error the user now can see the corresponding message from within his personal ocr overview section.
nextcloud-ocr (3.0.0-beta.1)
* **Release**: Now works with NC12. From now on a new Major Release will be released with each major NC version. Older versions will then not be supported anymore (they are still working maybe, but I don't have the time to support those).
* **Javascript**: Now everything is programmed with typescript and as a result it is much more testable and reliable.
* **Minor fixes and preparation**: This release is only a beta, as the main part is still WIP. A worker for Docker and with communication over redis will be available with the complete version 3.0.0.

nextcloud-ocr (2.3.0)
* **Feature**: The app now provides a multi language selection and an advanced logging for the ocr worker.
* **Bugfix**: The translation has not been applied to all strings before, this is fixed now.

nextcloud-ocr (2.2.0)
* **Feature**: A new app icon has been created and new screenshots are ready.
* **Bugfix**: As of #36 the app didn't handle shared files correctly. This is fixed now.

nextcloud-ocr (2.1.0)
* **Bugfix**: Couple of bugfixes including the never ending status update bug (#35). Also deu-frak and other unusal languages are now supported (#37).

nextcloud-ocr (2.0.0)
* **Support**: A new Nextcloud version is online: 11.0 and this app will support it with version 2.0.0.

nextcloud-ocr (1.0.2)
* **Enhancement**: The app supports php version 7.1 now.

nextcloud-ocr (1.0.0)
* **Enhancement**: The app has been tested by some people and it seems stable. Also the translation files are now available.

nextcloud-ocr (0.8.8-beta)
* **Bugfix**: Fixed a bug that resulted in still showing the ocr action button, also if there was no file selected. (after file deletion)

nextcloud-ocr (0.8.7-beta)
* **Feature**: BREAKING CHANGE: The gearman thing was removed in favor of a simpler queueing method and in order to not having too much dependencies.
* **Not Suppported anymore**: distributed gearman server thing is not supported anymore. From now on the workers will have to be local (I think this is not a showstopper in most cases - gearman and the lack of support in php7 was)

nextcloud-ocr (0.8.6-beta)
* **Feature**: Requested transifex translation and prepared the files for it.
* **Enhancement**: Added tests for methods as long as it was possible. (some service methods cannot be tested, because therefore a completely working environment and real files are required)
* **Organizational**: Added to appstore.

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
