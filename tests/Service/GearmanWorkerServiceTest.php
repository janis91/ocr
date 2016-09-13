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

use OCA\Ocr\Service\GearmanWorkerService;
use OCA\Ocr\Tests\TestCase;


class GearmanWorkerServiceTest extends TestCase {

	private $service;
	private $logger;
	private $l10n;

	public function setUp() {
		$this->logger = $this->getMockBuilder('OCP\ILogger')
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder('OCP\IL10N')
			->disableOriginalConstructor()
			->getMock();
		$this->service = new GearmanWorkerService($this->l10n, $this->logger);
	}

	// No Worker exists at the point we test it.
	public function testWorkerExists() {
		$this->assertFalse($this->service->workerExists());
	}

}
