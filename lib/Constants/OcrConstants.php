<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Constants;


abstract class OcrConstants {

	/**
	 * The app name
	 *
	 * @var string
	 */
	const APP_NAME = 'ocr';

	/**
	 * The tessdata folder name.
	 *
	 * @var string
	 */
	const TESSDATA_FOLDER = 'tessdata';

	/**
	 * The download url for packed tessdata.
	 *
	 * @var string
	 */
	const TESSDATA_DOWNLOAD_URL = 'https://github.com/janis91/tessdata/releases/download/v1.0.0/tessdata.tar.gz';

	/**
	 * The languages that can be set as default / preferred ones.
	 */
	const ALLOWED_LANGUAGES = [
		'afr',
		'ara',
		'aze',
		'bel',
		'ben',
		'bul',
		'cat',
		'ces',
		'chi_sim',
		'chi_tra',
		'chr',
		'dan',
		'deu',
		'ell',
		'eng',
		'enm',
		'epo',
		'epo_alt',
		'equ',
		'est',
		'eus',
		'fas',
		'fin',
		'fra',
		'frk',
		'frm',
		'glg',
		'grc',
		'heb',
		'hin',
		'hrv',
		'hun',
		'ind',
		'isl',
		'ita',
		'ita_old',
		'jpn',
		'kan',
		'kor',
		'lav',
		'lit',
		'mal',
		'mkd',
		'mlt',
		'msa',
		'nld',
		'nor',
		'pol',
		'por',
		'ron',
		'rus',
		'slk',
		'slv',
		'spa',
		'spa_old',
		'sqi',
		'srp',
		'swa',
		'swe',
		'tam',
		'tel',
		'tgl',
		'tha',
		'tur',
		'ukr',
		'vie',
	];
}