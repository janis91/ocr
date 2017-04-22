<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\Tests\Unit\Controller;

use OCA\Ocr\Controller\OcrController;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\AppFramework\Http;

class OcrControllerTest extends TestCase {

	protected $controller;
	protected $service;
	protected $userId = 'john';
	protected $request;

	public function setUp() {
		$this->request = $this->getMockBuilder('OCP\IRequest')->getMock();
		$this->service = $this->getMockBuilder('OCA\Ocr\Service\OcrService')
			->disableOriginalConstructor()
			->getMock();
		$this->controller = new OcrController(
			'ocr', $this->request, $this->service, $this->userId
		);
	}

	public function testLanguages(){
		$languages = 'just check if this value is returned correctly';
		$this->service->expects($this->once())
			->method('listLanguages')
			->will($this->returnValue($languages));

		$result = $this->controller->languages();

		$this->assertEquals($languages, $result->getData());
		$this->assertEquals(Http::STATUS_OK, $result->getStatus());
	}

	public function testLanguagesNotFound() {
		$message = 'No languages found.';

		$this->service->expects($this->once())
			->method('listLanguages')
			->will($this->throwException(new NotFoundException($message)));

		$result = $this->controller->languages();

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
	}

	public function testProcess() {
		$message = 'PROCESSING';
		$this->service->expects($this->once())
			->method('process')
			->with($this->equalTo('language'),
				$this->equalTo('files'))
			->will($this->returnValue($message));

		$result = $this->controller->process('language', 'files');

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_OK, $result->getStatus());
	}

	public function testProcessNotFound() {
		$message = 'Empty passed parameters.'; // As one example string which might return

		$this->service->expects($this->once())
			->method('process')
			->will($this->throwException(new NotFoundException($message)));

		$result = $this->controller->process('','');

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
	}

	public function testStatus(){
		$message = 'status array returned correctly';
		$this->service->expects($this->once())
			->method('status')
			->will($this->returnValue($message));

		$result = $this->controller->status();

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_OK, $result->getStatus());
	}

	public function testStatusNotFound() {
		$message = 'Temp file does not exist.'; // As one example string which might return

		$this->service->expects($this->once())
			->method('status')
			->will($this->throwException(new NotFoundException($message)));

		$result = $this->controller->status();

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
	}
}