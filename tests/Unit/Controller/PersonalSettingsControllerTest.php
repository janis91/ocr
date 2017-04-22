<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

namespace OCA\Ocr\Tests\Unit\Controller;

use OCA\Ocr\Controller\PersonalSettingsController;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\AppFramework\Http;
use OCP\Template;

class PersonalSettingsControllerTest extends TestCase {

	protected $controller;
	protected $service;
	protected $userId = 'john';
	protected $request;

	public function setUp() {
		$this->request = $this->getMockBuilder('OCP\IRequest')->getMock();
		$this->service = $this->getMockBuilder('OCA\Ocr\Service\OcrService')
			->disableOriginalConstructor()
			->getMock();
		$this->controller = new PersonalSettingsController(
			'ocr', $this->request, $this->service, $this->userId
		);
	}

	public function testDisplayPanel() {
		$result = $this->controller->displayPanel();
		$this->assertTrue($result instanceof Template);
	}

	public function testGetAll() {
		$status = 'just check if this value is returned correctly';
		$this->service->expects($this->once())
			->method('getAllForPersonal')
			->with($this->equalTo($this->userId))
			->will($this->returnValue($status));

		$result = $this->controller->getAll();

		$this->assertEquals($status, $result->getData());
		$this->assertEquals(Http::STATUS_OK, $result->getStatus());
	}

	public function testGetAllNotFound() {
		$message = 'No status found.';

		$this->service->expects($this->once())
			->method('getAllForPersonal')
			->with($this->equalTo($this->userId))
			->will($this->throwException(new NotFoundException($message)));

		$result = $this->controller->getAll();

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
	}

	public function testDeleteStatus() {
		$status = 'just check if this value is returned correctly';
		$this->service->expects($this->once())
			->method('deleteStatus')
			->with($this->equalTo(1),
				$this->equalTo($this->userId))
			->will($this->returnValue($status));

		$result = $this->controller->deleteStatus(1);

		$this->assertEquals($status, $result->getData());
		$this->assertEquals(Http::STATUS_OK, $result->getStatus());
	}

	public function testDeleteStatusNotFound() {
		$message = 'No status found.';

		$this->service->expects($this->once())
			->method('deleteStatus')
			->with($this->equalTo(1),
				$this->equalTo($this->userId))
			->will($this->throwException(new NotFoundException($message)));

		$result = $this->controller->deleteStatus(1);

		$this->assertEquals($message, $result->getData());
		$this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
	}
}