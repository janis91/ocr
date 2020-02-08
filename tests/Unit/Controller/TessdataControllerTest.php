<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */
namespace OCA\Ocr\Tests\Unit\Controller;


use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Controller\TessdataController;
use OCA\Ocr\Service\TessdataService;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\Files\NotFoundException;
use OCP\IRequest;

class TessdataControllerTest extends TestCase {
	/**
	 * @var string
	 */
	private $appName = OcrConstants::APP_NAME;
	/**
	 * @var IRequest|MockOxbject
	 */
	private $request;
	/**
	 * @var TessdataService|MockObject
	 */
	private $tessdataService;
	/**
	 * @var TessdataController
	 */
	private $cut;

	public function setUp() {
		$this->request = $this->getMockBuilder('OCP\IRequest')
			->getMock();
		$this->tessdataService = $this->getMockBuilder('OCA\Ocr\Service\TessdataService')
			->disableOriginalConstructor()
			->getMock();
		$this->cut = new TessdataController($this->appName, $this->request, $this->tessdataService);
	}

	public function testGetFile_GIVEN_a_valid_file_name_WHEN_getFile_is_executed_THEN_returns_FileDisplayResponse() {
		$file = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFile')
			->getMock();
		$this->tessdataService->expects($this->once())
			->method('getAppFile')
			->with('test.traineddata.gz')
			->will($this->returnValue($file));

		$result = $this->cut->getFile('test.traineddata.gz');

		$this->assertInstanceOf('OCP\AppFramework\Http\FileDisplayResponse', $result);
		$this->assertEquals(200, $result->getStatus());
	}

	public function testGetFile_GIVEN_an_invalid_file_name_WHEN_getFile_is_executed_THEN_returns_NotFound() {
		$this->tessdataService->expects($this->once())
			->method('getAppFile')
			->with('invalid.traineddata.gz')
			->will($this->throwException(new NotFoundException('File not found.')));

		$result = $this->cut->getFile('invalid.traineddata.gz');

		$this->assertInstanceOf('OCP\AppFramework\Http\NotFoundResponse', $result);
		$this->assertEquals(404, $result->getStatus());
	}
}
