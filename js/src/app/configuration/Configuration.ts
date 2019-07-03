import { OCSingleTranslation } from '../../global-oc-types';

declare var t: OCSingleTranslation;

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
    public static allowedMimeTypes: Array<string> = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];
    public static availableLanguages: {[value: string]: string} = {
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
}
