OC.L10N.register(
    "ocr",
    {
    "OCR" : "ОРС",
    "Optical character recognition" : "Оптическое распознавание символов",
    "Text recognition for your images" : "Распознавание текста из изображений",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and saves the output PDF file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 16 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud App Store](https://apps.nextcloud.com/apps/ocr) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Note\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract. The maintainer stopped working on PDF processing in this app and will start working on separate app for pdf handling." : "# Описание\n\nПриложение оптического распознавания символов (ОРС) выполняет обработку изображений с использованием библиотеки tesseract-js внутри Nextcloud.\nПриложение использует выполнение библиотеки tesseract-js в браузере для обработки изображений в форматах png, jpeg, tiff, и bmp и сохранения в исходной папке Nextcloud. результирующего файла в формате PDF, позволяющем выполнять поиск по содержимому.\n\n## Требования и зависимости:\nДля работы этого приложения требуются:\n\n- [Nextcloud версии 16 и новее](https://nextcloud.com/)\n\n- Использование только последних выпусков современных браузеров (Chrome, Edge, Firefox, Opera, Safari)\n\n - Для установки данных обучения программы Tesseract требуется около 200 МБ дискового пространства на сервере. Эти данные будут установлены автоматически.\n\n_* При использовании брузера Safari существует проблема с [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), для решения требующая задания Администратором параметру «script-src» значения «unsafe-eval». Так как использование этого параметра небезопасно, администратору предлагается самостоятельно принять решение о внесении такого изменения (убедитесь, что вы знаете что делаете)._\n\n## Установка\nУстановите приложение из [Каталога приложений Nextcloud](http://apps.nextcloud.com) или загрузите архив с сайте github (**не** загружайте исходный код) и распакуйте его в **nextcloud/apps/ocr/**.\n\n## Отказ от ответственности\nПрограммное обеспечение распространяется на условиях «как есть», без гарантий или обязательств любого вида, явных или подразумеваемых.\n\n## Примечание\nВерсия 3 и более ранние версии приложения более не сопровождаются автором. Если вам требуется версия с асинхронной обработкой в фоновом режиме, создайте форк кодовой базы и используйте ветку \"not-maintained\" для внесения улучшений. \nКроме того, это проект основан на перенесённой на webassembly версии библиотеки tesseract. Сопровождающий остановил в этом приложении работу над обработкой файлов PDF и начал разработку отдельного приложения для работы с файлами в формате PDF.",
    "Target file already exists:" : "Целевой файл уже существует:",
    "An unexpected error occurred during the load of your favorite languages. No language will be set instead." : "Не удалось загрузить список избранных языков, язык для распознавания не установлен.",
    "An unexpected error occurred during the upload of the processed file." : "Не удалось передать обработанный файл.",
    "An unexpected error occurred during the deletion of the original file." : "Не удалось удалить исходный файл.",
    "An unexpected error occurred during Tesseract processing." : "Произошла неожиданная ошибка во время работы программы Tesseract.",
    "OCR processing failed:" : "Сбой при обработке ОРС:",
    "MIME type not supported." : "Тип MIME не поддерживается.",
    "Process" : "Обработка",
    "A large number of files may take a very long time." : "Обработка большого числа файлов может занять значительное время.",
    "{file}/{files} Files successfully processed" : "Обработано файлов: {file}/{files}",
    "_%n file is being processed:_::_%n files are being processed:_" : ["Обработан %n файл:","Обработаны %n файла:","Обработаны %n файлов:","Обработан %n файла:"],
    "_Delete original file (image)_::_Delete original files (images)_" : ["Удалить исходный файл изображения","Удалить исходные файлы изображений","Удалить исходные файлы изображений","Удалить исходные файлы изображений"],
    "_%n file_::_%n files_" : ["%n файл","%n файла","%n файлов","%n файлов"],
    "Afrikaans" : "Африкаанс",
    "Arabic" : "Арабский",
    "Azerbaijani" : "Азербайджанский",
    "Belarusian" : "Белорусский",
    "Bengali" : "Бенгальский",
    "Bulgarian" : "Болгарский",
    "Catalan" : "Каталанский",
    "Czech" : "Чешский",
    "Chinese" : "Китайский",
    "Traditional Chinese" : "Традиционный Китайский",
    "Cherokee" : "Чероки",
    "Danish" : "Датский",
    "German" : "Немецкий",
    "Greek" : "Греческий",
    "English" : "Английский",
    "English (Old)" : "Английский (старый)",
    "Esperanto" : "Эсперанто",
    "Esperanto alternative" : "Эсперанто (альтернативный)",
    "Math" : "Математические символы",
    "Estonian" : "Эстонский",
    "Basque" : "Баскский",
    "Persian (Farsi)" : "Персидский (Фарси)",
    "Finnish" : "Финский",
    "French" : "Французский",
    "Frankish" : "Франкский",
    "French (Old)" : "Французский (старый)",
    "Galician" : "Галисийский",
    "Ancient Greek" : "Древнегреческий",
    "Hebrew" : "Иврит",
    "Hindi" : "Хинди",
    "Croatian" : "Хорватский",
    "Hungarian" : "Венгерский",
    "Indonesian" : "Индонезийский",
    "Icelandic" : "Исландский",
    "Italian" : "Итальянский",
    "Italian (Old)" : "Итальянский (старый)",
    "Japanese" : "Японский",
    "Kannada" : "Каннада",
    "Korean" : "Корейский",
    "Latvian" : "Латвийский",
    "Lithuanian" : "Литовский",
    "Malayalam" : "Малаялам",
    "Macedonian" : "Македонский",
    "Maltese" : "Мальтийский",
    "Malay" : "Малайский",
    "Dutch" : "Нидерландский",
    "Norwegian" : "Норвежский",
    "Polish" : "Польский",
    "Portuguese" : "Португальский",
    "Romanian" : "Румынский",
    "Russian" : "Русский",
    "Slovakian" : "Словацкий",
    "Slovenian" : "Словенский",
    "Spanish" : "Испанский",
    "Spanish (Old)" : "Испанский (Старый)",
    "Albanian" : "Албанский",
    "Serbian (Latin)" : "Сербский (латиница)",
    "Swahili" : "Суахили",
    "Swedish" : "Шведский",
    "Tamil" : "Тамильский",
    "Telugu" : "Телугу",
    "Tagalog" : "Тагальский",
    "Thai" : "Тайский",
    "Turkish" : "Турецкий",
    "Ukrainian" : "Украинский",
    "Vietnamese" : "Вьетнамский",
    "Press enter to select" : "Нажмите Enter для выбора",
    "Press enter to remove" : "Нажмите Enter для удаления",
    "Selected" : "Выбрано",
    "No matches found" : "Соответствий не найдено",
    "Select language" : "Выбрать язык",
    "Save" : "Сохранить",
    "An unexpected error occured during save of your favorite languages. Please try again." : "Не удалось сохранить список избранных языков, повторите попытку.",
    "An unexpected error occured during load of your favorite languages. Please try again." : "Не удалось загрузить список избранных языков, повторите попытку.",
    "An error occured during save of your favorite languages. Please check your input." : "Не удалось сохранить список избранных языков, проверьте вводимые данные.",
    "Selected languages will be preselected by default in the OCR dialog." : "Избранные языки будут выбраны по умолчанию в диалоге распознавания.",
    "Favorite languages" : "Избранные языки"
},
"nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);");
