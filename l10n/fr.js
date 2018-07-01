OC.L10N.register(
    "ocr",
    {
    "Saved." : "Sauvegardé",
    "Saving languages failed:" : "Échec de la sauvegarde des langues :",
    "The languages are not specified in the correct format." : "Les langues ne sont pas spécifiées dans le format correct.",
    "Saving Redis settings failed:" : "Échec de la sauvegarde des paramètres de Redis :",
    "The Redis settings are not specified in the right format." : "Les paramètres de Redis ne sont pas spécifiés dans le bon format.",
    "OCR" : "OCR",
    "OCR processing failed:" : "Le traitement OCR a échoué :",
    "No file selected." : "Aucun fichier sélectionné.",
    "MIME type not supported." : "Type de fichier non supporté.",
    "_OCR processing for %n file failed. For details please go to your personal settings._::_OCR processing for %n files failed. For details please go to your personal settings._" : ["Le traitement OCR a échoué pour %n fichier. Pour plus de détails, veuillez consulter vos paramètres personnels.","Le traitement OCR a échoué pour %n fichiers. Pour plus de détails, veuillez consulter vos paramètres personnels."],
    "OCR status could not be retrieved:" : "Le statut OCR n'a pas pu être récupéré :",
    "No languages available for OCR processing. Please make sure to configure the languages in the administration section." : "Aucunes langues disponibles pour le processus OCR. Veuillez vérifier que vous avez configuré les langues dans la partie d'administration.",
    "Available languages could not be retrieved:" : "Les langues disponibles n'ont pas pu être récupérées :",
    "Process" : "Exécuter",
    "Replace" : "Remplacer",
    "_OCR started: %n new file in queue._::_OCR started: %n new files in queue._" : ["L'OCR a commencé : %n fichier en attente de traitement.","L'OCR a commencé : %n fichiers en attente de traitement."],
    "_OCR: %n currently pending file in queue._::_OCR: %n currently pending files in queue._" : ["OCR : %n fichier en attente de traitement.","OCR : %n fichiers en attente d'être traités."],
    "No matches found." : "Aucun résultats trouvés.",
    "Select language" : "Sélectionner la langue",
    "OCR jobs could not be retrieved:" : "Les travaux d'OCR n'ont pas pu être récupérés :",
    "The job for the following file object has been successfully deleted:" : "La tâche pour l'objet du fichier suivant a été supprimée avec succès :",
    "Error during deletion:" : "Erreur lors de la suppression :",
    "Delete" : "Supprimer",
    "No pending or failed OCR items found." : "Aucun élément OCR en attente ou en échec n'a été trouvé.",
    "Refresh" : "Actualiser",
    "Delete from queue" : "Supprimer de la liste d'attente",
    "File" : "Fichier",
    "Status" : "État",
    "Log" : "Journal",
    "Replace by result" : "Remplacer par le résultat",
    "Saved" : "Sauvegardé",
    "Please setup Redis in the administration settings first." : "Veuillez d'abord configurer Redis dans les paramètres d'administration.",
    "The given settings key is empty." : "La clé des paramètres est vide.",
    "The Redis host is not specified in the correct format." : "L'hôte de Redis n'est pas spécifié dans le bon format.",
    "The Redis port number is not specified in the correct format." : "Le numéro de port de Redis n'est pas spécifié dans le bon format.",
    "The Redis DB is not specified in the correct format." : "La base de données de Redis n'est pas spécifiée dans le bon format.",
    "Wrong parameter." : "Paramètre incorrect.",
    "Wrong MIME type." : "Type MIME incorrect.",
    "Cannot replace shared files." : "Impossible de remplacer les fichiers partagés.",
    "Empty parameters passed." : "Les paramètres données sont vides.",
    "Cannot delete because of wrong owner." : "Suppression invalide pour cause de mauvais propriétaire.",
    "Cannot delete because of wrong ID." : "Suppression invalide pour cause de mauvais ID.",
    "Reading the finished jobs from Redis went wrong." : "La lecture des tâches accomplies de Redis a échoué.",
    "Temp file does not exist." : "Le fichier temporaire n'existe pas.",
    "OCR could not put processed file to the right target folder. If you selected the replace option, you can restore the file by using the trash bin." : "OCR n'a pas pu mettre le fichier traité dans le bon dossier cible. Si vous avez sélectionné l'option de remplacement, vous pouvez restaurer le fichier avec l'aide de la corbeille.",
    "Could not add files to the Redis OCR processing queue." : "Impossible d'ajouter les fichiers à la liste de traitement OCR de Redis.",
    "Temp file cannot be created." : "Le fichier temporaire ne peut pas être créé.",
    "Cannot delete temporary file during creation of temp file for Tesseract." : "Impossible de supprimer des fichiers temporaires lors de la création de fichiers temporaires pour Tesseract.",
    "Cannot create temporary file for Tesseract." : "Impossible de créer des fichiers temporaires pour Tesseract.",
    "Cannot set permissions for temporary Tesseract file." : "Impossible de définir les autorisations pour le fichier temporaire de Tesseract.",
    "Message queueing capabilities are missing on the server (package php-redis)." : "Le serveur n'a pas la capacité d'afficher la file d'attente de messages (paquet php-redis).",
    "Cannot connect to Redis." : "Impossible de se connecter à Redis",
    "Redis authentication error." : "Erreur d'authentification sur Redis.",
    "Cannot connect to the right Redis database." : "Impossible de se connecter à la bonne base de données Redis",
    "Optical character recognition" : "Reconnaissance optique des caractères",
    "Text recognition for your images and pdf files" : "Reconnaissance de texte pour vos images et fichiers pdf",
    "# Description\n\nNextcloud OCR (optical character recognition) processing for images and PDF with tesseract-ocr and OCRmyPDF brings OCR capability to your Nextcloud.\nThe app uses a docker container with tesseract-ocr, OCRmyPDF and communicates over redis in order to process images (png, jpeg, tiff) and PDF asynchronously and save the output file to the source folder in nextcloud. That for example enables you to search in it. (Hint: currently not all PDF-types are supported, for more information see [here](https://github.com/jbarlow83/OCRmyPDF))\n\n## Prerequisites, Requirements and Dependencies\nThe OCR app has some prerequisites:\n - **[Nextcloud 12 or 13](https://nextcloud.com/)**. For older versions take an older major version of this app.\n - **Linux** server as environment. (tested with Debian 8, Raspbian and Ubuntu 14.04 (Trusty))\n - **Docker** is used for processing files. tesseract-ocr and OCRmyPDF reside in a docker container.\n - **php-redis** is used for the communication and has to be a part of your php.\n\n## Limitations\nCurrently the app is not working with any activated encryption, nor is it working with files shared via external storage or federated sharing. This has to be considered. If one wants to process such a file, it must be copied to the local environment.\n\nFor further information see the [homepage](https://github.com/janis91/ocr/wiki/Usage) or the appropriate documentation in the wiki.\n\n## Installation\nInstall the app from the [Nextcloud AppStore](http://apps.nextcloud.com) or download the release package from github (**NOT** the sources) and place the content in **nextcloud/apps/ocr/**.\n\n**Please consider: The app will not work as long as the Docker container isn't running. (more information in the [wiki](https://github.com/janis91/ocr/wiki))**\n\n## Administration and Usage\nPlease read the related topics in the [wiki](https://github.com/janis91/ocr/wiki).\n\n## Disclaimer\nThe software is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\nCONDITIONS OF ANY KIND, either express or implied." : "# La description\n\nNextcloud  OCR (reconnaissance optique de caractères) pour les images et PDF avec tesseract-ocr et OCRmyPDF apporte la capacité OCR à votre Nextcloud.\nL'application utilise un conteneur docker avec tesseract-ocr, OCRmyPDF et communique par redis afin de traiter les images (png, jpeg, tiff) et PDF de manière asynchrone et enregistrer le fichier de sortie dans le dossier source de nextcloud. Cela vous permet par exemple d'y faire une recherche. ( actuellement, tous les types PDF ne sont pas pris en charge, pour plus d'informations, voir [ici] (https://github.com/jbarlow83/OCRmyPDF))\n\n## Conditions préalables, exigences et dépendances\nL'application OCR a quelques prérequis:\n- ** [Nextcloud 12 ou 13] (https://nextcloud.com/) **. Pour les versions plus anciennes, prenez une version majeure plus ancienne de cette application.\n- ** Serveur Linux ** en tant qu'environnement. (testé avec Debian 8, Raspbian et Ubuntu 14.04 (Trusty))\n- ** Docker ** est utilisé pour le traitement des fichiers. tesseract-ocr et OCRmyPDF résident dans un conteneur docker.\n- ** php-redis ** est utilisé pour la communication et doit faire partie de votre php.\n\n## Limitations\nActuellement, l'application ne fonctionne pas avec un cryptage activé et ne fonctionne pas avec des fichiers partagés via un stockage externe ou un partage fédéré. Cela doit être considéré. Si l'on veut traiter un tel fichier, il doit être copié dans l'environnement local.\n\nPour plus d'informations, consultez la [page d'accueil] (https://github.com/janis91/ocr/wiki/Usage) ou la documentation appropriée dans le wiki.\n\n## Installation\nInstallez l'application depuis [AppStore de Nextcloud] (http://apps.nextcloud.com) ou téléchargez le package de version de github (** PAS** les sources) et placez le contenu dans **nextcloud/apps/ocr/**.\n\n** A noter: L'application ne fonctionnera pas tant que le conteneur Docker ne fonctionnera pas. (plus d'informations dans le [wiki] (https://github.com/janis91/ocr/wiki)) **\n\n## Administration et utilisation\nS'il vous plaît lire les sujets connexes dans le [wiki] (https://github.com/janis91/ocr/wiki).\n\n## Avertissement\nLe logiciel est distribué \"TEL QUEL\", SANS GARANTIES OU\nCONDITIONS DE QUELQUE NATURE, expresse ou implicite.",
    "Installed languages" : "Langues installées",
    "Here goes a semicolon separated list of languages that are supported by the Docker worker instance (more details in the wiki on GitHub)." : "Ceci est une liste des langues séparée par des points-virgules. Ces langues sont prises en charge par les supports d'instance Docker (plus d'information dans le wiki de GitHub).",
    "Apply" : "Appliquer",
    "Redis host" : "Hôte de Redis",
    "The host of the Redis instance for communication with the OCR worker." : "L'hôte de l'instance Redis pour la communication avec le processus OCR.",
    "Redis port" : "Port de Redis",
    "The corresponding port (normally 6379)." : "Le port correspondant (normalement 6379)",
    "Redis database" : "Base de données de Redis",
    "The Redis database (normally 0)." : "La base de données de Redis (normalement 0)",
    "Redis password" : "Mot de passe de Redis",
    "The password to authenticate (normally OCR)." : "Le mot de passe pour s'authentifier (normalement OCR)"
},
"nplurals=2; plural=(n > 1);");
