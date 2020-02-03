export class Translations {
    public static TRANSLATION_TARGET_FILE_ALREADY_EXISTS: string = t('ocr', 'Target file already exists:');
    public static TRANSLATION_UNEXPECTED_ERROR_LOAD_FAVORITE_LANGUAGES: string = t('ocr', 'An unexpected error occured during the load of your favorite languages. No language will be set instead.');
    public static TRANSLATION_UNEXPECTED_ERROR_UPLOAD: string = t('ocr', 'An unexpected error occured during the upload of the processed file.');
    public static TRANSLATION_UNEXPECTED_ERROR_DELETION: string = t('ocr', 'An unexpected error occured during the deletion of the original file.');
    public static TRANSLATION_UNEXPECTED_ERROR_TESSERACT_PROCESSING: string = t('ocr', 'An unexpected error occured during Tesseract processing.');
    public static TRANSLATION_OCR_PROCESSING_FAILED: string = t('ocr', 'OCR processing failed:');
    public static TRANSLATION_NO_FILE_SELECTED: string = t('ocr', 'No file selected.');
    public static TRANSLATION_MIMETYPE_NOT_SUPPORTED: string = t('ocr', 'MIME type not supported.');
    public static TRANSLATION_PROCESS: string = t('ocr', 'Process');
    public static TRANSLATION_LARGE_NUMBER_TAKES_VERY_LONG_TIME: string = t('ocr', 'A large number of files may take a very long time.');
    public static TRANSLATION_FILES_SUCCESSFULLY_PROCESSED: (finishedFileCount: string, allFilesCount: string) => string =
        (file, files) => t('ocr', '{file}/{files} Files successfully processed', { file, files })
    public static TRANSLATION_FILES_QUEUED: (filesQueued: number) => string =
        (number) => n('ocr', '%n file is being processed:', '%n files are being processed:', number)
    public static TRANSLATION_REPLACE_OR_DELETE_ORIGINAL_FILE: (filesQueued: number) => string =
        (number) => n('ocr', 'Delete (image) original file', 'Delete (images) original files', number)
    public static TRANSLATION_FILE_FILES: (filesQueued: number) => string =
        (number) => n('ocr', '%n file', '%n files', number)
}
