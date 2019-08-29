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
namespace OCA\Ocr\Tests\Unit\Settings;

use OCA\Ocr\Tests\Unit\TestCase;
use OCA\Ocr\Settings\OcrSection;
use OCA\Ocr\Constants\OcrConstants;
use OCP\IL10N;
use OCP\IURLGenerator;
use PHPUnit\Framework\MockObject\MockObject;

class OcrSectionTest extends TestCase {
	/**
	 * @var OcrSection
	 */
	protected $cut;
	/**
	 * @var IL10N|MockObject
	 */
	protected $l10nMock;
	/**
	 * @var IURLGenerator|MockObject
	 */
	protected $urlGenMock;

	public function setUp() {
		$this->l10nMock = $this->getMockBuilder('OCP\IL10N')
			->getMock();
		$this->urlGenMock = $this->getMockBuilder('OCP\IURLGenerator')
			->getMock();
		$this->cut = new OcrSection($this->urlGenMock, $this->l10nMock);
	}

	public function testGetID_THEN_returns_app_id() {
		$result = $this->cut->getID();

		$this->assertEquals(OcrConstants::APP_NAME, $result);
	}

	public function testGetName_THEN_returns_translated_app_name() {
		$this->l10nMock->expects($this->once())
			->method('t')
			->with($this->equalTo('OCR'))
			->will($this->returnValue('OCR'));

		$result = $this->cut->getName();

		$this->assertEquals('OCR', $result);
	}

	public function testGetPriority_THEN_returns_section_priority() {
		$result = $this->cut->getPriority();

		$this->assertEquals(70, $result);
	}

	public function testGetIcon_THEN_returns_app_icon() {
		$this->urlGenMock->expects($this->once())
			->method('imagePath')
			->with(OcrConstants::APP_NAME, 'icon/ocr.svg')
			->will($this->returnValue('/apps/ocr/img/icon/ocr.svg'));

		$result = $this->cut->getIcon();

		$this->assertEquals('/apps/ocr/img/icon/ocr.svg', $result);
	}
}