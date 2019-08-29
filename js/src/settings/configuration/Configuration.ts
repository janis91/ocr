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
    public static TRANSLATION_OCR: string = t('ocr', 'OCR');
    public static TRANSLATION_SAVE: string = t('ocr', 'Save');
    public static TRANSLATION_PRESS_TO_SELECT: string = t('ocr', 'Press to select');
    public static TRANSLATION_NO_MATCHES_FOUND: string = t('ocr', 'No matches found');
    public static TRANSLATION_SELECT_LANGUAGE: string = t('ocr', 'Select language');
    public static TRANSLATION_UNEXPECTED_ERROR_SAVE: string = t('ocr', 'An unexpected error occured during save of your favorite languages. Please try again.');
    public static TRANSLATION_UNEXPECTED_ERROR_LOAD: string = t('ocr', 'An unexpected error occured during load of your favorite languages. Please try again.');
    public static TRANSLATION_ERROR_WRONG_INPUT: string = t('ocr', 'An error occured during save of your favorite languages. Please check your input.');
    public static TRANSLATION_PRESELECTION_HINT: string = t('ocr', 'Selected languages will be preselected by default in the OCR dialog.');
}
