OC.L10N.register(
    "ocr",
    {
    "OCR" : "OCR",
    "Target file already exists:" : "Plik docelowy już istnieje:",
    "An unexpected error occured during the load of your favorite languages. No language will be set instead." : "Wystąpił nieoczekiwany błąd podczas ładowania ulubionych języków. Dlatego nie zostanie ustawiony żaden język.",
    "An unexpected error occured during the upload of the processed file." : "Wystąpił nieoczekiwany błąd podczas przesyłania przetworzonego pliku.",
    "An unexpected error occured during the deletion of the original file." : "Wystąpił nieoczekiwany błąd podczas usuwania oryginalnego pliku.",
    "An unexpected error occured during Tesseract processing." : "Wystąpił nieoczekiwany błąd podczas przetwarzania Tesseract.",
    "PDF does not contain any Pages to process." : "PDF nie zawiera żadnych stron do przetworzenia.",
    "An unexpected error occured during pdf processing." : "Wystąpił nieoczekiwany błąd podczas przetwarzania pliku PDF.",
    "OCR processing failed:" : "Proces przetwarzania OCR nie powiódł się:",
    "No file selected." : "Nie wybrano pliku.",
    "MIME type not supported." : "Typ MIME nie jest obsługiwany.",
    "Press to select" : "Naciśnij, aby wybrać",
    "No matches found" : "Nie znaleziono pasujących",
    "Select language" : "Wybierz język",
    "Process" : "Proces",
    "PDF files and a large number of files may take a very long time." : "Pliki PDF i duża liczba plików może zająć bardzo dużo czasu.",
    "{file}/{files} Files successfully processed" : "Pliki pomyślnie przetworzone {file}/{files}",
    "_%n file is being processed:_::_%n files are being processed:_" : ["Trwa przetwarzanie %n pliku:","Trwa przetwarzanie %n plików:","Trwa przetwarzanie %n plików:","Trwa przetwarzanie %n plików:"],
    "_Replace (PDF) or delete (image) original file_::_Replace (PDF) or delete (images) original files_" : ["Zastąp (PDF) lub usuń oryginalny plik (obraz)","Zastąp (PDF) lub usuń oryginalne pliki (obrazy)","Zastąp (PDF) lub usuń oryginalne pliki (obrazy)","Zastąp (PDF) lub usuń oryginalne pliki (obrazy)"],
    "_%n file_::_%n files_" : ["%n plik","%n pliki","%n plików","%n plików"],
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
    "Polish" : "Polski",
    "Portuguese" : "Portuguese",
    "Romanian" : "Romanian",
    "Russian" : "Russian",
    "Slovakian" : "Slovakian",
    "Slovenian" : "Slovenian",
    "Spanish" : "Spanish",
    "Old Spanish" : "Old Spanish",
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
    "Save" : "Zapisz",
    "An unexpected error occured during save of your favorite languages. Please try again." : "Wystąpił nieoczekiwany błąd podczas zapisywania ulubionych języków. Proszę spróbować ponownie.",
    "An unexpected error occured during load of your favorite languages. Please try again." : "Wystąpił nieoczekiwany błąd podczas ładowania ulubionych języków. Proszę spróbować ponownie.",
    "An error occured during save of your favorite languages. Please check your input." : "Wystąpił błąd podczas zapisywania ulubionych języków. Sprawdź swoje dane wejściowe.",
    "Selected languages will be preselected by default in the OCR dialog." : "Wybrane języki zostaną wstępnie wybrane, jako domyślne w oknie dialogowym OCR.",
    "Optical character recognition" : "Optyczne rozpoznawanie znaków",
    "Text recognition for your images and pdf files" : "Rozpoznawanie tekstu dla obrazów i plików pdf",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images and PDF with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and small PDFs and saves the output file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 15 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Consideration\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract and some in browser tools for pdf handling, which especially in case of processing PDF files leads to quite some overhead compared to tools like [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF). Please consider, that output files can get quite big and the process may take quite long, too." : "# Opis\n\nKolejne przetwarzanie OCR (optyczne rozpoznawanie znaków) dla obrazów i PDF z tesseract-js zapewnia możliwości OCR dla Nextcloud.\nAplikacja używa tesseract-js w przeglądarce do przetwarzania obrazów (png, jpeg, tiff) i plików PDF oraz zapisuje plik wyjściowy w katalogu źródłowym w Nextcloud. Umożliwia to na przykład wyszukiwanie w nim.\n\n## Wymagania wstępne, wymagania i zależności\nAplikacja OCR ma pewne wymagania wstępne:\n\n - [Nextcloud 15 i wyższy] (https://nextcloud.com/)\n\n - Obsługiwane tylko w najnowszych nowoczesnych przeglądarkach internetowych (Chrome, Edge, Firefox, Opera, Safari*)\n\n\n_ * Na Safari występuje obecnie problem z [Content-Security-Policy] (https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), który wymaga od administratora ustawienia 'script-src' dla 'unsafe-eval', dzięki czemu aplikacja działa poprawnie. Ponieważ jest to dość niepewne, sama aplikacja nie ustawia jej i zaleca podjęcie decyzji na własne ryzyko (upewnij się, że wiesz, czym jest CSP i np. niebezpieczne zdarzenia)._\n\n## Instalacja\nZainstaluj aplikację z [Nextcloud AppStore] (http://apps.nextcloud.com) lub pobierz pakiet wersji z github (**NIE** źródła) i umieść zawartość w **nextcloud/apps/ocr/**.\n\n## Zrzeczenie się\nOprogramowanie jest rozpowszechniane „TAKIE JAKIE JEST”, BEZ GWARANCJI LUB\nWARUNKÓW DOWOLNEGO RODZAJU, wyraźne lub dorozumiane.\n\n## Rozważanie\nWersja 3 i wcześniejsze wersje nie są już wspierane przez autora. Tak więc w przypadku asynchronicznego przetwarzania tła należy rozwidlić repozytorium i użyć gałęzi „nieobsługiwane”, aby pracować nad ulepszeniami. Autor nie był w stanie go rozwijać z powodu zbyt dużego wysiłku.\nCo więcej, ten projekt opiera się na portach do tworzenia stron internetowych tesseract i niektórych narzędziach przeglądarki do obsługi plików pdf, co szczególnie w przypadku przetwarzania plików PDF prowadzi do dość dużego obciążenia w porównaniu z narzędziami takimi jak [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF). Proszę wziąć pod uwagę, że pliki wyjściowe mogą być duże, a sam proces tworzenia może trwać bardzo długo.",
    "Favorite languages" : "Ulubione języki"
},
"nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && (n%100<12 || n%100>14) ? 1 : n!=1 && (n%10>=0 && n%10<=1) || (n%10>=5 && n%10<=9) || (n%100>=12 && n%100<=14) ? 2 : 3);");
