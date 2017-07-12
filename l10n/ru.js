OC.L10N.register(
    "ocr",
    {
    "Saved." : "Сохранено.",
    "Saving languages failed:" : "Ошибка при сохранении языков:",
    "The languages are not specified in the correct format." : "Языки указаны в неверном формате.",
    "Saving Redis settings failed:" : "Ошибка при сохранении настроек Redis:",
    "The Redis settings are not specified in the right format." : "Настройки Redis указаны в неверном формате.",
    "OCR" : "ОРС",
    "OCR processing failed:" : "Сбой при обработке ОРС:",
    "No file(s) selected." : "Ни одного файла не выбрано.",
    "MIME type(s) not supported." : "Тип(ы) MIME не поддерживаются.",
    "_OCR processing for %n file failed. For details please go to your personal settings._::_OCR processing for %n files failed. For details please go to your personal settings._" : ["Обработка ОРС закончилась неудачей для %n файла. Для получения подробностей, свяжитесь с вашим администратором.","Обработка ОРС закончилась неудачей для %n файлов. Для получения подробностей, свяжитесь с вашим администратором.","Обработка ОРС закончилась неудачей для %n файлов. Для получения подробностей, свяжитесь с вашим администратором.","Обработка ОРС закончилась неудачей для %n файлов. Для получения подробностей, свяжитесь с вашим администратором."],
    "OCR status could not be retrieved:" : "Не удаётся получить состояние ОРС :",
    "No languages available for OCR processing. Please make sure to setup tesseract and OCRmyPDF correctly." : "Для обработки ОРС не найдены языки для распознавания. Проверьте правильность установки tesseract и OCRmyPDF.",
    "Available languages could not be retrieved:" : "Не удаётся получить список доступных языков распознавания:",
    "Process" : "Обработка",
    "_OCR started: %n new file in queue._::_OCR started: %n new files in queue._" : ["ОРС запущено: в очереди %n новый файл.","ОРС запущено: в очереди %n новых файлов.","ОРС запущено: в очереди %n новых файлов.","ОРС запущено: в очереди %n новых файлов."],
    "_OCR: %n currently pending file in queue._::_OCR: %n currently pending files in queue._" : ["ОРС: в очереди ожидает %n файл.","ОРС: в очереди ожидает %n файла.","ОРС: в очереди ожидает %n файлов.","ОРС: в очереди ожидает %n файлов."],
    "No matches found." : "Соответствий не найдено.",
    "Select language" : "Выбрать язык",
    "Delete" : "Удалить",
    "No pending or failed OCR items found." : "Нет находящихся в очереди или с завершившейся  ошибкой обработкой элементов для ОРС.",
    "Refresh" : "Обновить",
    "Delete from queue" : "Удалить из очереди",
    "File" : "Файл",
    "Status" : "Статус",
    "Log" : "Журнал",
    "OCR jobs could not be retrieved:" : "Не удаётся получить список заданий ОРС:",
    "The job for the following file object has been successfully deleted:" : "Задание для указного файлового объекта было успешно удалено:",
    "Error during deletion:" : "Ошибка удаления:",
    "Saved" : "Сохранено",
    "The given settings key is empty." : "Указан пустой ключ настроек.",
    "The redis host is not specified in the correct format." : "Узел Redis указан в неверном формате.",
    "The redis port number is not specified in the correct format." : "Порт Redis указан в неверном формате",
    "The redis db is not specified in the correct format." : "База данных Redis указана в неверном формате.",
    "Wrong parameter." : "Неверный параметр.",
    "Wrong MIME type." : "Неверный тип MIME. ",
    "Empty parameters passed." : "Переданы пустые параметры.",
    "Cannot delete because of wrong owner." : "Невозможно удалить, неверный владелец.",
    "Cannot delete because of wrong ID." : "Невозможно удалить, неверный ID.",
    "Reading the finished jobs from redis went wrong." : "Что-то пошло не так при чтении завершённых задний Redis.",
    "Temp file does not exist." : "Временный файл не существует.",
    "Could not add files to the redis OCR processing queue." : "Не удаётся добавить файлы в очередь обработки ОРС.",
    "Temp file cannot be created." : "Невозможно создать временный файл.",
    "Cannot delete temporary file during creation of temp file for Tesseract." : "Невозможно удалить созданный для Tesseract временный файл.",
    "Cannot create temporary file for Tesseract." : "Невозможно создать временный файл для Tesseract.",
    "Cannot set permissions for temporary Tesseract file." : "Невозможно задать права доступа к созданному для Tesseract временному файлу",
    "Message queueing capabilities are missing on the server." : "На сервере отсутствуют инструменты для опроса очереди сообщений.",
    "Cannot connect to Redis." : "Невозможно подключиться к Redis",
    "Cannot connect to the right Redis database." : "Невозможно подключиться к верной базе данных Redis",
    "Optical character recognition (OCR)" : "Оптическое распознавание символов (ОРС)",
    "Installed languages" : "Установленные языки",
    "Here goes a semicolon separated list of languages that are supported by the Docker worker instance (more details in the wiki on GitHub)." : "Здесь приведён разделённый точкой с запятой список языков, поддерживаемых установленным экземпляром Docker (более подробная информация в wiki на github).",
    "Apply" : "Применить",
    "Redis host" : "Узел Redis",
    "The host of the Redis instance for communication with the OCR worker." : "Узел службы Redis для соединения с обработчиком ОРС.",
    "Redis port" : "Порт Redis",
    "The corresponding port (normally 6379)." : "Соответствующий порт (обычно 6379).",
    "Redis database" : "База данных Redis",
    "The Redis database (normally 0)." : "База данных Redis (обычно 0)."
},
"nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : n%10==0 || (n%10>=5 && n%10<=9) || (n%100>=11 && n%100<=14)? 2 : 3);");
