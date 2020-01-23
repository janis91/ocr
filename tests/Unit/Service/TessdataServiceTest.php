<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */

namespace OCA\Ocr\Tests\Unit\Service;

use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Service\TessdataService;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\ILogger;

class TessdataServiceTest extends TestCase {
	/**
	 * @var IAppData|MockObject
	 */
	private $appData;
	/**
	 * @var ILogger|MockObject
	 */
	private $logger;

	/**
	 * @var TessdataService
	 */
	private $cut;

	public function setUp() {
		$this->appData = $this->getMockBuilder('OCP\Files\IAppData')
			->getMock();
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->getMock();
		$this->cut = new TessdataService($this->appData, $this->logger);
	}

	public function testGetAppFile_GIVEN_a_valid_file_name_WHEN_getAppFile_is_executed_THEN_returns_ISimpleFile() {
		$file = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
			->getMock();
		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('fileExists')
			->with('test.traineddata.gz')
			->will($this->returnValue(true));
		$folder->expects($this->once())
			->method('getFile')
			->with('test.traineddata.gz')
			->will($this->returnValue($file));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));

		$result = $this->cut->getAppFile('test.traineddata.gz');

		$this->assertEquals($file, $result);
	}

	public function testGetAppFile_GIVEN_an_invalid_file_name_WHEN_getAppFile_is_executed_THEN_throws_NotFoundException() {
		$this->expectException(NotFoundException::class);

		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('fileExists')
			->with('invalid.traineddata.gz')
			->will($this->returnValue(false));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));
		$this->logger->expects($this->once())
			->method('warning')
			->with("File with name 'invalid.traineddata.gz' does not exist in tessdata appdata directory.", ['app' => 'ocr']);

		$this->cut->getAppFile('invalid.traineddata.gz');
	}
}