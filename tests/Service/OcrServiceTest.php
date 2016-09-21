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

namespace OCA\Ocr\Tests\Service;

use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Service\NotFoundException;
use OCA\Ocr\Service\OcrService;
use OCA\Ocr\Tests\TestCase;

class OcrServiceTest extends TestCase {

	private $logger;

	private $tempM;

	private $config;

	private $queueService;

	private $statusMapper;

	private $view;

	private $userId = 'john';

	private $l10n;

	private $service;

	public function setUp() {
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->disableOriginalConstructor()
			->getMock();
		$this->tempM = $this->getMockBuilder('OCP\ITempManager')
			->disableOriginalConstructor()
			->getMock();
		$this->config = $this->getMockBuilder('OCP\IConfig')
			->disableOriginalConstructor()
			->getMock();
		$this->queueService = $this->getMockBuilder('OCA\Ocr\Service\QueueService')
			->disableOriginalConstructor()
			->getMock();
		$this->statusMapper = $this->getMockBuilder('OCA\Ocr\Db\OcrStatusMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->view = $this->getMockBuilder('OC\Files\View')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();
		$this->service = new OcrService($this->tempM, $this->config, $this->queueService, $this->statusMapper, $this->view, $this->userId, $this->l10n, $this->logger);
	}

	// FIXME: listLanguages() is not possible to test, because it exec()s things.

	// FIXME: status() is not possbile to test, because it uses global functions like file_exists().

	/**
	 * returns nothing
	 */
	public function testComplete(){
		$status = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'file_id' => 4,
			'new_name' => 'new',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess'
		]);

		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->returnValue($status));

		$updatedStatus = $status;

		$updatedStatus->setStatus('PROCESSED');

		$this->statusMapper->expects($this->once())
			->method('update')
			->with($this->equalTo($updatedStatus))
			->will($this->returnValue($updatedStatus));

		$this->service->complete(3, false);
	}

	/**
	 * returns nothing
	 */
	public function testCompleteSetFailed(){
		$status = OcrStatus::fromRow([
			'id' => 3,
			'status' => 'PENDING',
			'file_id' => 4,
			'new_name' => 'new',
			'temp_file' => 'temp',
			'user_id' => $this->userId,
			'type' => 'tess'
		]);

		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->returnValue($status));

		$updatedStatus = $status;

		$updatedStatus->setStatus('FAILED');

		$this->statusMapper->expects($this->once())
			->method('update')
			->with($this->equalTo($updatedStatus))
			->will($this->returnValue($updatedStatus));

		$this->service->complete(3, true);
	}

	/**
	 * @expectedException \OCA\Ocr\Service\NotFoundException
	 */
	public function testCompleteFailure(){
		$this->statusMapper->expects($this->once())
			->method('find')
			->with($this->equalTo(3))
			->will($this->throwException(new NotFoundException('')));
		$this->service->complete(3, false);
	}

	// TODO: process()


}