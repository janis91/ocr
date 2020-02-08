<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */

namespace OCA\Ocr\Tests\Php\Unit\Settings;

use OCA\Ocr\Settings\LanguageSettings;
use OCA\Ocr\Tests\Php\Unit\TestCase;
use OCA\Ocr\Constants\OcrConstants;

class LanguageSettingsTest extends TestCase {
	/**
	 * @var LanguageSettings
	 */
	private $cut;

	public function setUp() {
		$this->cut = new LanguageSettings();
	}

	public function testGetForm_THEN_returns_language_settings_template() {
		$result = $this->cut->getForm();

		$this->assertInstanceOf('OCP\AppFramework\Http\TemplateResponse', $result);
		$this->assertEquals($result->getTemplateName(), 'language-settings');
	}

	public function testGetSection_THEN_returns_app_id() {
		$result = $this->cut->getSection();

		$this->assertEquals(OcrConstants::APP_NAME, $result);
	}

	public function testGetPriority_THEN_returns_settings_priority() {
		$result = $this->cut->getPriority();

		$this->assertEquals(0, $result);
	}
}
