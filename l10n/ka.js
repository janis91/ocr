OC.L10N.register(
    "ocr",
    {
    "OCR" : "OCR",
    "Optical character recognition" : "Optical character recognition",
    "Text recognition for your images" : "Text recognition for your images",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and saves the output PDF file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 16 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud App Store](https://apps.nextcloud.com/apps/ocr) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Note\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract. The maintainer stopped working on PDF processing in this app and will start working on separate app for pdf handling." : "# Description\n\nNextcloud OCR (optical character recognition) processing for images with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and saves the output PDF file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 16 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud App Store](https://apps.nextcloud.com/apps/ocr) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Note\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract. The maintainer stopped working on PDF processing in this app and will start working on separate app for pdf handling.",
    "Target file already exists:" : "Target file already exists:",
    "An unexpected error occurred during the load of your favorite languages. No language will be set instead." : "An unexpected error occurred during the load of your favorite languages. No language will be set instead.",
    "An unexpected error occurred during the upload of the processed file." : "An unexpected error occurred during the upload of the processed file.",
    "An unexpected error occurred during the deletion of the original file." : "An unexpected error occurred during the deletion of the original file.",
    "An unexpected error occurred during Tesseract processing." : "An unexpected error occurred during Tesseract processing.",
    "OCR processing failed:" : "OCR processing failed:",
    "MIME type not supported." : "MIME type not supported.",
    "Process" : "Process",
    "A large number of files may take a very long time." : "A large number of files may take a very long time.",
    "{file}/{files} Files successfully processed" : "{file}/{files} Files successfully processed",
    "_%n file is being processed:_::_%n files are being processed:_" : ["%n file is being processed:","%n files are being processed:"],
    "_Delete original file (image)_::_Delete original files (images)_" : ["Delete original file (image)","Delete original files (images)"],
    "_%n file_::_%n files_" : ["%n file","%n files"],
    "Afrikaans" : "Afrikaans",
    "Arabic" : "Arabic",
    "Azerbaijani" : "Azerbaijani",
    "Belarusian" : "Belarusian",
    "Bengali" : "Bengali",
    "Bulgarian" : "Bulgarian",
    "Catalan" : "Catalan",
    "Czech" : "Czech",
    "Chinese" : "Chinese",
    "Traditional Chinese" : "Traditional Chinese",
    "Cherokee" : "Cherokee",
    "Danish" : "Danish",
    "German" : "German",
    "Greek" : "Greek",
    "English" : "English",
    "English (Old)" : "English (Old)",
    "Esperanto" : "Esperanto",
    "Esperanto alternative" : "Esperanto alternative",
    "Math" : "Math",
    "Estonian" : "Estonian",
    "Basque" : "Basque",
    "Persian (Farsi)" : "Persian (Farsi)",
    "Finnish" : "Finnish",
    "French" : "French",
    "Frankish" : "Frankish",
    "French (Old)" : "French (Old)",
    "Galician" : "Galician",
    "Ancient Greek" : "Ancient Greek",
    "Hebrew" : "Hebrew",
    "Hindi" : "Hindi",
    "Croatian" : "Croatian",
    "Hungarian" : "Hungarian",
    "Indonesian" : "Indonesian",
    "Icelandic" : "Icelandic",
    "Italian" : "Italian",
    "Italian (Old)" : "Italian (Old)",
    "Japanese" : "Japanese",
    "Kannada" : "Kannada",
    "Korean" : "Korean",
    "Latvian" : "Latvian",
    "Lithuanian" : "Lithuanian",
    "Malayalam" : "Malayalam",
    "Macedonian" : "Macedonian",
    "Maltese" : "Maltese",
    "Malay" : "Malay",
    "Dutch" : "Dutch",
    "Norwegian" : "Norwegian",
    "Polish" : "Polish",
    "Portuguese" : "Portuguese",
    "Romanian" : "Romanian",
    "Russian" : "Russian",
    "Slovakian" : "Slovakian",
    "Slovenian" : "Slovenian",
    "Spanish" : "Spanish",
    "Spanish (Old)" : "Spanish (Old)",
    "Albanian" : "Albanian",
    "Serbian (Latin)" : "Serbian (Latin)",
    "Swahili" : "Swahili",
    "Swedish" : "Swedish",
    "Tamil" : "Tamil",
    "Telugu" : "Telugu",
    "Tagalog" : "Tagalog",
    "Thai" : "Thai",
    "Turkish" : "Turkish",
    "Ukrainian" : "Ukrainian",
    "Vietnamese" : "Vietnamese",
    "Press enter to select" : "Press enter to select",
    "Press enter to remove" : "Press enter to remove",
    "Selected" : "Selected",
    "No matches found" : "No matches found",
    "Select language" : "Select language",
    "Save" : "Save",
    "An unexpected error occured during save of your favorite languages. Please try again." : "An unexpected error occured during save of your favorite languages. Please try again.",
    "An unexpected error occured during load of your favorite languages. Please try again." : "An unexpected error occured during load of your favorite languages. Please try again.",
    "An error occured during save of your favorite languages. Please check your input." : "An error occured during save of your favorite languages. Please check your input.",
    "Selected languages will be preselected by default in the OCR dialog." : "Selected languages will be preselected by default in the OCR dialog.",
    "Favorite languages" : "Favorite languages"
},
"nplurals=2; plural=(n!=1);");
