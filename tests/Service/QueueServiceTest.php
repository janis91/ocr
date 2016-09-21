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
use OCA\Ocr\Service\QueueService;
use OCA\Ocr\Tests\TestCase;


class QueueServiceTest extends TestCase {

	private $service;
	private $statusMapper;
	private $logger;
	private $l10n;
	private $userId = 'john';

	public function setUp() {
		$this->statusMapper = $this->getMockBuilder('OCA\Ocr\Db\OcrStatusMapper')
			->disableOriginalConstructor()
			->getMock();
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();
		$this->service = new QueueService($this->statusMapper, $this->l10n, $this->logger);
	}

	public function tearDown() {
		msg_remove_queue(msg_get_queue(21671));
	}

	//TODO: test the clientSend method. dont forget to remove the queue after this.. to not influence the live env.

	public function testClientSend(){
		$status = new OcrStatus('PENDING', 235, 'newName', '/tmp/file', 'tess', $this->userId);

		$this->statusMapper->expects($this->once())
			->method('insert')
			->with($this->equalTo($status))
			->will($this->returnValue($status));

		$this->service->clientSend($status, '/data', '/', 'eng', '/server');

	}


}
