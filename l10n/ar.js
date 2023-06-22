OC.L10N.register(
    "ocr",
    {
    "OCR" : "OCR",
    "Optical character recognition" : "التعرُّف الضوئي على الحروف",
    "Text recognition for your images" : "التعرُّف على النصوص في صورك",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images with tesseract-js brings OCR capability to your Nextcloud.\nThe app uses tesseract-js in the browser in order to process images (png, jpeg, tiff, bmp) and saves the output PDF file to the source folder in nextcloud. That for example enables you to search in it.\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n\n - [Nextcloud 16 and up](https://nextcloud.com/)\n\n - Only supported on latest modern web browsers (Chrome, Edge, Firefox, Opera, Safari*)\n\n - Tesseract traineddata needs about 200 MB space on your server (will be installed automatically).\n\n\n_* On Safari there is currently a problem with the [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), that requires an Administrator to set the 'script-src' to 'unsafe-eval' such that the app works properly. Because this is quite insecure the app itself does not set it and recommends to decide that on your own risk (please make sure, that you know what CSP is and what e.g. unsafe-eval causes)._\n\n## Installation\nInstall the app from the [Nextcloud App Store](https://apps.nextcloud.com/apps/ocr) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied.\n\n## Note\nThe version 3 and earlier versions are not supported/maintained anymore by the author. So for asynchronous background processing please fork the repository and use the \"not-maintained\" branch to work on improvements. The author wasn't able to support it because of too much effort.\nMoreover this project is based on a webassembly port of tesseract. The maintainer stopped working on PDF processing in this app and will start working on separate app for pdf handling." : "# الوصف\n\nتطبيق نكست كلاود للتعرّف الضوئي على الحروف (OCR) بناءُ على مكتبة tesseract.js.\nيستخدم هذا التطبيق مكتبة tesseract.js للتعرّف على الحروف في الملفات من نوع (png, jpeg, tiff, bmp) و يحفظ النتيجة في ملف PDF يمكنه البحث فيه عن النصوص.\n\n## المتطلبات المسبقة و الاحتياجات:\nالمتطلبات المسبقة للتطبيق:\n\n - [نكست كلاود؛ الإصدار 16 فما فوق] (https://nextcloud.com/)\n\n - يدعم الِإصدارات الحديثة من متصفحات الوب (Chrome, Edge, Firefox, Opera, Safari*)\n\n - وحدة التمرين على التعرّف Tesseract traineddata تحتاج 200 ميغابايت ( ويتم تنصيبها تلقائيّاً).\n\n\n_ في حالة مستعرض سافاري، ما زال هنالك إشكالية في [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). يستلزم لحلّها أن يقوم المشرف بتعيين 'script-src' بالقيمة 'unsafe-eval'. بسب أن هذا قد يمثل خطراً على أمن النظام، فإن التطبيق لن يقوم بتعيينها بنفسه بل يترك ذل لتقدير المشرف (الذي يجب أن يكون عارفاً ماذا تعني CSP، و فيم تتسبب الـ unsafe-eval).\n\n\n## التنصيب\nقم بتنصيب التطبيق من [Nextcloud App Store](https://apps.nextcloud.com/apps/ocr) أو قم بتنزيل الحزمة البرمجية من github (و ليس الكود المصدري)، ثم ضع المحتوى في **nextcloud/apps/ocr/**.\n\n## إخلاء مسؤولية\nيتم توزيع هذه البرمجية \"كما هي\" بدون أي ضمانات سواءً كانت صريحةً أم ضمنيّةً.\n\n## ملاحظة\nالإصدار رقم 3 و ماقبله لم تعد تحت متابعة مطوري التطبيق. لذا، فإنه لغرض المعالجة اللاتزامنية في الخلفية، يُمكن لم يرغب، تفريع الفرع \"not-maintained\" و متابعة تطويره بنفسه؛ حيث لم يعد المُطوّر قادراً على متابعة تطويره .\n\nهذا التطبيق يعتمد على webassembly port of tesseract. مُطوّر التطبيق توقف عن متابعة تطوير معالجة PDF فيه، و بدأ العمل على تطبيق آخر مستقل لمناولة ملفات PDF.",
    "Target file already exists:" : "الملف الهدف موجود أصلاً:",
    "An unexpected error occurred during the load of your favorite languages. No language will be set instead." : "خطأ غير متوقع وقع أثناء تحميل لغاتك المفضلة. سوف لن يتم تعيين أي لغةٍ محددةٍ.",
    "An unexpected error occurred during the upload of the processed file." : "خطأ غير متوقع وقع أثناء رفع الملف المُعالَج.",
    "An unexpected error occurred during the deletion of the original file." : "خطأ غير متوقع وقع أثناء حذف الملف المُعالَج.",
    "An unexpected error occurred during Tesseract processing." : "خطأ غير متوقع وقع أثناء معالجة Tesseract.",
    "OCR processing failed:" : "عملية التعرُّف الضوئي OCR فشلت:",
    "MIME type not supported." : "نوع ملف MIME غير مدعوم.",
    "Process" : "معالجة",
    "A large number of files may take a very long time." : "عدد كبير من الملفات ربما يستغرق وقتاً طويلاً جداً.",
    "{file}/{files} Files successfully processed" : "{file}/{files} ملفات تمتّ معالجتها بنجاحٍ",
    "Afrikaans" : "Afrikaans",
    "Arabic" : "العربية",
    "Azerbaijani" : "Azerbaijani",
    "Belarusian" : "Belarusian",
    "Bengali" : "Bengali",
    "Bulgarian" : "البلغارية",
    "Catalan" : "الكتالونية",
    "Czech" : "Czech",
    "Chinese" : "الصينية",
    "Traditional Chinese" : "Traditional Chinese",
    "Cherokee" : "Cherokee",
    "Danish" : "Danish",
    "German" : "ألمانيا",
    "Greek" : "Greek",
    "English" : "الإنجليزية",
    "English (Old)" : "English (Old)",
    "Esperanto" : "Esperanto",
    "Esperanto alternative" : "Esperanto alternative",
    "Math" : "رياضيات",
    "Estonian" : "Estonian",
    "Basque" : "الباسكية",
    "Persian (Farsi)" : "Persian (Farsi)",
    "Finnish" : "Finnish",
    "French" : "الفرنسية",
    "Frankish" : "Frankish",
    "French (Old)" : "French (Old)",
    "Galician" : "Galician",
    "Ancient Greek" : "Ancient Greek",
    "Hebrew" : "Hebrew",
    "Hindi" : "الهندية",
    "Croatian" : "Croatian",
    "Hungarian" : "Hungarian",
    "Indonesian" : "الأندونيسية",
    "Icelandic" : "Icelandic",
    "Italian" : "Italian",
    "Italian (Old)" : "Italian (Old)",
    "Japanese" : "اليابانية",
    "Kannada" : "Kannada",
    "Korean" : "Korean",
    "Latvian" : "Latvian",
    "Lithuanian" : "الليثوانية",
    "Malayalam" : "Malayalam",
    "Macedonian" : "Macedonian",
    "Maltese" : "Maltese",
    "Malay" : "Malay",
    "Dutch" : "الهولندية",
    "Norwegian" : "Norwegian",
    "Polish" : "Polish",
    "Portuguese" : "Portuguese",
    "Romanian" : "Romanian",
    "Russian" : "الروسية",
    "Slovakian" : "Slovakian",
    "Slovenian" : "Slovenian",
    "Spanish" : "الإسبانية",
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
    "Press enter to select" : "إضغط مفتاح  الإدخال ENTER للاختيار",
    "Press enter to remove" : "إضغط مفتاح الإدخال ENTER للحذف",
    "Selected" : "Selected",
    "No matches found" : "لم يٌمكن إيجاد أي تطابقات",
    "Select language" : "اختر لغة",
    "Save" : "حفظ",
    "An unexpected error occured during save of your favorite languages. Please try again." : "خطأ غير متوقع وقع أثناء حفظ لغاتك المفضلة. رجاءًً، حاول مرةً أخرى.",
    "An unexpected error occured during load of your favorite languages. Please try again." : "خطأ غير متوقع وقع أثناء تحميل لغاتك المفضلة. رجاءًً، حاول مرةً أخرى.",
    "An error occured during save of your favorite languages. Please check your input." : "خطأ غير متوقع وقع أثناء حفظ لغاتك المفضلة. رجاءًً، حاول إفحص مُدخلاتك.",
    "Selected languages will be preselected by default in the OCR dialog." : "اللغات المختارة سوف تظهر تلقائيّاً في نافذة حوار OCR.",
    "Favorite languages" : "اللغات المفضلة"
},
"nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5;");
