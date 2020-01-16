import { OCSingleTranslation, OCMultiTranslation } from '../../global-oc-types';

declare var t: OCSingleTranslation;
declare var n: OCMultiTranslation;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class Configuration {
    // TODO: allowed mimetypes are not correct: https://github.com/naptha/tesseract.js/blob/master/docs/image-format.md
    public static ALLOWED_MIMETYPES: Array<string> = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];
    public static TRANSLATION_OCR: string = t('ocr', 'OCR');
    public static TRANSLATION_TARGET_FILE_ALREADY_EXISTS: string = t('ocr', 'Target file already exists:');
    public static TRANSLATION_UNEXPECTED_ERROR_LOAD_FAVORITE_LANGUAGES: string = t('ocr', 'An unexpected error occured during the load of your favorite languages. No language will be set instead.');
    public static TRANSLATION_UNEXPECTED_ERROR_UPLOAD: string = t('ocr', 'An unexpected error occured during the upload of the processed file.');
    public static TRANSLATION_UNEXPECTED_ERROR_DELETION: string = t('ocr', 'An unexpected error occured during the deletion of the original file.');
    public static TRANSLATION_UNEXPECTED_ERROR_TESSERACT_PROCESSING: string = t('ocr', 'An unexpected error occured during Tesseract processing.');
    public static TRANSLATION_PDF_DOESNT_CONTAIN_PAGES: string = t('ocr', 'PDF does not contain any Pages to process.');
    public static TRANSLATION_UNEXPECTED_ERROR_PDF_PROCESSING: string = t('ocr', 'An unexpected error occured during pdf processing.');
    public static TRANSLATION_OCR_PROCESSING_FAILED: string = t('ocr', 'OCR processing failed:');
    public static TRANSLATION_NO_FILE_SELECTED: string = t('ocr', 'No file selected.');
    public static TRANSLATION_MIMETYPE_NOT_SUPPORTED: string = t('ocr', 'MIME type not supported.');
    public static TRANSLATION_PRESS_TO_SELECT: string = t('ocr', 'Press to select');
    public static TRANSLATION_NO_MATCHES_FOUND: string = t('ocr', 'No matches found');
    public static TRANSLATION_SELECT_LANGUAGE: string = t('ocr', 'Select language');
    public static TRANSLATION_PROCESS: string = t('ocr', 'Process');
    public static TRANSLATION_LARGE_NUMBER_TAKES_VERY_LONG_TIME: string = t('ocr', 'PDF files and a large number of files may take a very long time.');
    public static TRANSLATION_FILES_SUCCESSFULLY_PROCESSED: (finishedFileCount: string, allFilesCount: string) => string =
        (file, files) => t('ocr', '{file}/{files} Files successfully processed', { file, files })
    public static TRANSLATION_FILES_QUEUED: (filesQueued: number) => string =
        (number) => n('ocr', '%n file is being processed:', '%n files are being processed:', number)
    public static TRANSLATION_REPLACE_OR_DELETE_ORIGINAL_FILE: (filesQueued: number) => string =
        (number) => n('ocr', 'Replace (PDF) or delete (image) original file', 'Replace (PDF) or delete (images) original files', number)
    public static TRANSLATION_FILE_FILES: (filesQueued: number) => string =
        (number) => n('ocr', '%n file', '%n files', number)
}
