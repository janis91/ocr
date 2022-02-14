OC.L10N.register(
    "ocr",
    {
    "OCR" : "OCR",
    "Optical character recognition" : "Reconeixement òptic de caràcters",
    "Text recognition for your images" : "Reconeixement de text per a les vostres imatges",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and saves the output PDF file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 16 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud AppStore](https://apps.nextcloud.com/apps/ocr) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Note\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract. The maintainer stopped working on PDF processing in this app and will start working on separate app for pdf handling." : "# Descripció\n\nEl processament amb OCR (reconeixement òptic de caràcters) del Nextcloud per a imatges amb tesseract-js incorpora la funcionalitat d'OCR al Nextcloud.\nL'aplicació utilitza tesseract-js en el navegador per a processar imatges (png, jpeg, tiff i bmp) i desa el fitxer PDF de sortida a la carpeta d'origen del Nextcloud. Això, per exemple, us permet fer-hi cerques.\n\n## Requisits previs i dependències\nL'aplicació d'OCR té alguns requisits previs:\n\n- [Nextcloud 16 o superior](https://nextcloud.com/)\n\n- Només és compatible amb els navegadors web moderns més recents (Chrome, Edge, Firefox, Opera i Safari*)\n\n- Les dades d'entrenament del Tesseract requereixen uns 200 MB d'espai en el servidor (s'instal·laran automàticament).\n\n\n_* A Safari actualment hi ha un problema amb [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), que requereix que un administrador estableixi «script-src» a «unsafe-eval» perquè l'aplicació funcioni correctament. Com que això és bastant insegur, l'aplicació en si no ho estableix i recomana que seguiu sota el vostre propi risc (assegureu-vos que sabeu què és CSP i quins efectes té, per exemple, «unsafe-eval»)._\n\n## Instal·lació\nInstal·leu l'aplicació des de la [Botiga d'aplicacions del Nextcloud](https://apps.nextcloud.com/apps/ocr) o baixeu el paquet de GitHub (**NO** el codi font) i col·loqueu el contingut a **nextcloud/apps/ocr/**.\n\n## Avís\nEl programari es distribueix «TAL QUAL», SENSE GARANTIES NI\nCONDICIONS DE QUALSEVOL TIPUS, ja sigui expresses o implícites.\n\n## Nota\nLa versió 3 i les versions anteriors estan obsoletes i l’autor no les manté. Per tant, per al processament asíncron en segon pla, bifurqueu el dipòsit i utilitzeu la branca «not-maintained» per a treballar en millores. L'autor no ha pogut afegir la compatibilitat a causa del gran esforç de desenvolupament necessari.\nA més, aquest projecte es basa en un port de Tesseract a WebAssembly. El mantenidor ha deixat de treballar en el processament de PDF en aquesta aplicació i treballarà en una aplicació independent per a l'administració de PDF.",
    "Target file already exists:" : "El fitxer de destinació ja existeix:",
    "An unexpected error occured during the load of your favorite languages. No language will be set instead." : "S'ha produït un error inesperat en carregar les llengües preferides. No es definirà cap llengua.",
    "An unexpected error occured during the upload of the processed file." : "S'ha produït un error inesperat en pujar el fitxer processat.",
    "An unexpected error occured during the deletion of the original file." : "S'ha produït un error inesperat en suprimir el fitxer original.",
    "An unexpected error occured during Tesseract processing." : "S'ha produït un error inesperat durant el processament del Tesseract.",
    "OCR processing failed:" : "S'ha produït un error durant el processament de l'OCR:",
    "MIME type not supported." : "El tipus MIME no és compatible.",
    "Process" : "Processa",
    "A large number of files may take a very long time." : "Si seleccioneu un gran nombre de fitxers, pot tardar molta estona.",
    "{file}/{files} Files successfully processed" : "S'han processat correctament {file}/{files} fitxers",
    "_%n file is being processed:_::_%n files are being processed:_" : ["S'està processant %n fitxer:","S'estan processant %n fitxers:"],
    "_Delete original file (image)_::_Delete original files (images)_" : ["Suprimeix el fitxer original (imatge)","Suprimeix els fitxers originals (imatges)"],
    "_%n file_::_%n files_" : ["%n fitxer","%n fitxers"],
    "Afrikaans" : "Afrikaans",
    "Arabic" : "Àrab",
    "Azerbaijani" : "Àzeri",
    "Belarusian" : "Bielorús",
    "Bengali" : "Bengalí",
    "Bulgarian" : "Búlgar",
    "Catalan" : "Català",
    "Czech" : "Txec",
    "Chinese" : "Xinès",
    "Traditional Chinese" : "Xinès tradicional",
    "Cherokee" : "Cherokee",
    "Danish" : "Danès",
    "German" : "Alemany",
    "Greek" : "Grec",
    "English" : "Anglès",
    "English (Old)" : "Anglès (antic)",
    "Esperanto" : "Esperanto",
    "Esperanto alternative" : "Esperanto (alternatiu)",
    "Math" : "Matemàtiques",
    "Estonian" : "Estonià",
    "Basque" : "Basc",
    "Persian (Farsi)" : "Persa",
    "Finnish" : "Finès",
    "French" : "Francès",
    "Frankish" : "Fràncic",
    "French (Old)" : "Francès (antic)",
    "Galician" : "Gallec",
    "Ancient Greek" : "Grec antic",
    "Hebrew" : "Hebreu",
    "Hindi" : "Hindi",
    "Croatian" : "Croat",
    "Hungarian" : "Hongarès",
    "Indonesian" : "Indonesi",
    "Icelandic" : "Islandès",
    "Italian" : "Italià",
    "Italian (Old)" : "Italià (antic)",
    "Japanese" : "Japonès",
    "Kannada" : "Kanarès",
    "Korean" : "Coreà",
    "Latvian" : "Letó",
    "Lithuanian" : "Lituà",
    "Malayalam" : "Malaiàlam",
    "Macedonian" : "Macedoni",
    "Maltese" : "Maltès",
    "Malay" : "Malai",
    "Dutch" : "Neerlandès",
    "Norwegian" : "Noruec",
    "Polish" : "Polonès",
    "Portuguese" : "Portuguès",
    "Romanian" : "Romanès",
    "Russian" : "Rus",
    "Slovakian" : "Eslovac",
    "Slovenian" : "Eslovè",
    "Spanish" : "Castellà",
    "Old Spanish" : "Castellà antic",
    "Albanian" : "Albanès",
    "Serbian (Latin)" : "Serbi (alfabet llatí)",
    "Swahili" : "Suahili",
    "Swedish" : "Suec",
    "Tamil" : "Tàmil",
    "Telugu" : "Telugu",
    "Tagalog" : "Tagal",
    "Thai" : "Tailandès",
    "Turkish" : "Turc",
    "Ukrainian" : "Ucraïnès",
    "Vietnamese" : "Vietnamita",
    "Press enter to select" : "Premeu Retorn per a seleccionar-ho",
    "Press enter to remove" : "Premeu Retorn per a eliminar-ho",
    "Selected" : "Seleccionat",
    "No matches found" : "No s'ha trobat cap coincidència",
    "Select language" : "Seleccioneu la llengua",
    "Save" : "Desa",
    "An unexpected error occured during save of your favorite languages. Please try again." : "S'ha produït un error inesperat en desar les llengües preferides. Torneu-ho a provar.",
    "An unexpected error occured during load of your favorite languages. Please try again." : "S'ha produït un error inesperat en carregar les llengües preferides. Torneu-ho a provar.",
    "An error occured during save of your favorite languages. Please check your input." : "S'ha produït un error en desar les llengües preferides. Comproveu el valor introduït.",
    "Selected languages will be preselected by default in the OCR dialog." : "Les llengües seleccionades se seleccionaran automàticament per defecte en el quadre de diàleg de l'OCR.",
    "Favorite languages" : "Llengües preferides"
},
"nplurals=2; plural=(n != 1);");
