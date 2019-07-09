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
    public static ALLOWED_MIMETYPES: Array<string> = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];
    public static AVAILABLE_LANGUAGES: { [value: string]: string } = {
        'afr': t('ocr', 'Afrikaans'),
        'ara': t('ocr', 'Arabic'),
        'aze': t('ocr', 'Azerbaijani'),
        'bel': t('ocr', 'Belarusian'),
        'ben': t('ocr', 'Bengali'),
        'bul': t('ocr', 'Bulgarian'),
        'cat': t('ocr', 'Catalan'),
        'ces': t('ocr', 'Czech'),
        'chi_sim': t('ocr', 'Chinese'),
        'chi_tra': t('ocr', 'Traditional Chinese'),
        'chr': t('ocr', 'Cherokee'),
        'dan': t('ocr', 'Danish'),
        'deu': t('ocr', 'German'),
        'ell': t('ocr', 'Greek'),
        'eng': t('ocr', 'English'),
        'enm': t('ocr', 'English (Old)'),
        'epo': t('ocr', 'Esperanto'),
        'epo_alt': t('ocr', 'Esperanto alternative'),
        'equ': t('ocr', 'Math'),
        'est': t('ocr', 'Estonian'),
        'eus': t('ocr', 'Basque'),
        'fas': t('ocr', 'Persian (Farsi)'),
        'fin': t('ocr', 'Finnish'),
        'fra': t('ocr', 'French'),
        'frk': t('ocr', 'Frankish'),
        'frm': t('ocr', 'French (Old)'),
        'glg': t('ocr', 'Galician'),
        'grc': t('ocr', 'Ancient Greek'),
        'heb': t('ocr', 'Hebrew'),
        'hin': t('ocr', 'Hindi'),
        'hrv': t('ocr', 'Croatian'),
        'hun': t('ocr', 'Hungarian'),
        'ind': t('ocr', 'Indonesian'),
        'isl': t('ocr', 'Icelandic'),
        'ita': t('ocr', 'Italian'),
        'ita_old': t('ocr', 'Italian (Old)'),
        'jpn': t('ocr', 'Japanese'),
        'kan': t('ocr', 'Kannada'),
        'kor': t('ocr', 'Korean'),
        'lav': t('ocr', 'Latvian'),
        'lit': t('ocr', 'Lithuanian'),
        'mal': t('ocr', 'Malayalam'),
        'mkd': t('ocr', 'Macedonian'),
        'mlt': t('ocr', 'Maltese'),
        'msa': t('ocr', 'Malay'),
        'nld': t('ocr', 'Dutch'),
        'nor': t('ocr', 'Norwegian'),
        'pol': t('ocr', 'Polish'),
        'por': t('ocr', 'Portuguese'),
        'ron': t('ocr', 'Romanian'),
        'rus': t('ocr', 'Russian'),
        'slk': t('ocr', 'Slovakian'),
        'slv': t('ocr', 'Slovenian'),
        'spa': t('ocr', 'Spanish'),
        'spa_old': t('ocr', 'Old Spanish'),
        'sqi': t('ocr', 'Albanian'),
        'srp': t('ocr', 'Serbian (Latin)'),
        'swa': t('ocr', 'Swahili'),
        'swe': t('ocr', 'Swedish'),
        'tam': t('ocr', 'Tamil'),
        'tel': t('ocr', 'Telugu'),
        'tgl': t('ocr', 'Tagalog'),
        'tha': t('ocr', 'Thai'),
        'tur': t('ocr', 'Turkish'),
        'ukr': t('ocr', 'Ukrainian'),
        'vie': t('ocr', 'Vietnamese'),
    };
    public static TRANSLATION_OCR: string = t('ocr', 'OCR');
    public static TRANSLATION_TARGET_FILE_ALREADY_EXISTS: string = t('ocr', 'Target file already exists:');
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
        (number) => n('ocr', 'Replace (PDF) or delete (image) orignal file', 'Replace (PDF) or delete (images) orignal files', number)
    public static TRANSLATION_FILE_FILES: (filesQueued: number) => string =
        (number) => n('ocr', '%n file', '%n files', number)
}
