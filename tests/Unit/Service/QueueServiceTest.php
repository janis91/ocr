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

namespace OCA\Ocr\Tests\Unit\Service;

use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Service\QueueService;
use OCA\Ocr\Tests\Unit\TestCase;


class QueueServiceTest extends TestCase {

	private $service;
	private $statusMapper;
	private $logger;
	private $l10n;
	private $config;
	private $userId = 'john';

	public function setUp() {
		$this->statusMapper = $this->getMockBuilder('OCA\Ocr\Db\OcrStatusMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->config = $this->getMockBuilder('OCP\IConfig')
			->disableOriginalConstructor()
			->getMock();
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();
		$this->service = new QueueService($this->statusMapper, $this->config, $this->l10n, $this->logger);
	}

	public function tearDown() {
		// message queue 1
		msg_remove_queue(msg_get_queue(21671));
		// status queue
		msg_remove_queue(msg_get_queue(27672));
	}

	public function testClientSend(){
		$status = new OcrStatus('PENDING', 'new.png', 'new_OCR.txt', '/tmp/file', 'tess', $this->userId);

		$this->statusMapper->expects($this->once())
			->method('insert')
			->with($this->equalTo($status))
			->will($this->returnValue($status));

		$this->service->clientSend($status, ['eng'], '/server');

	}

	public function testCountMessages() {
		// as there is no message sent to the message queue yet it should be zero
		$this->assertEquals($this->service->countMessages(), 0);
	}

	public function testCountActiveProcesses() {
		// as there is no message sent to the message queue yet it should be zero
		$this->assertEquals($this->service->countActiveProcesses(), 0);
	}

}
