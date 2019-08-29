<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
namespace OCA\Ocr\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\Settings\ISettings;
use OCA\Ocr\Constants\OcrConstants;

class LanguageSettings implements ISettings {
	/**
	 * @return TemplateResponse
	 */
	public function getForm() {
		return new TemplateResponse(OcrConstants::APP_NAME, 'language-settings');
	}

	/**
	 * @return string
	 */
	public function getSection() {
		return OcrConstants::APP_NAME;
	}

	/**
	 * @return int
	 */
	public function getPriority() {
		return 0;
	}
}