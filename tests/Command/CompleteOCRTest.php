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

namespace OCA\Ocr\Tests\Command;

use OCA\Ocr\Command\CompleteOCR;
use OCA\Ocr\Tests\TestCase;

class CompleteOCRTest extends TestCase {

	private $service;

	private $command;

	private $args = ['status-id', 'failed'];

	protected function setUp() {
		parent::setUp();
		$this->service = $this->getMockBuilder('\OCA\Ocr\Service\OcrService')
			->disableOriginalConstructor()
			->getMock();

		$this->command = new CompleteOCR($this->service);
	}

	public function testName() {
		$this->assertSame('ocr:complete', $this->command->getName());
	}

	public function testDescription() {
		$this->assertSame('Console API for completion of the ocr processing of a file', $this->command->getDescription());
	}

	public function testArguments() {
		$actual = $this->command->getDefinition()->getArguments();
		foreach ($actual as $actArg) {
			$this->assertTrue($actArg->isRequired());
			$this->assertTrue(in_array($actArg->getName(), $this->args));
		}
	}
}