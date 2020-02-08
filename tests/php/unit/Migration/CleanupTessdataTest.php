<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2020
 */

namespace OCA\Ocr\Tests\Php\Unit\Migration;


use OCA\Ocr\Constants\OcrConstants;
use OCA\Ocr\Migration\CleanupTessdata;
use OCA\Ocr\Tests\Php\Unit\TestCase;
use OCP\Files\IAppData;
use OCP\Files\NotPermittedException;
use OCP\Migration\IOutput;

class CleanupTessdataTest extends TestCase {
	/** @var IOutput|MockObject */
	private $output;
	/** @var IAppData|MockObject */
	private $appData;
	/** @var CleanupTessdata */
	private $repairStep;

	protected function setUp() {
		parent::setUp();
		$this->appData = $this->getMockBuilder('OCP\Files\IAppData')
			->getMock();
		$this->output = $this->getMockBuilder('OCP\Migration\IOutput')
			->getMock();
		$this->repairStep = new CleanupTessdata($this->appData);
	}

	public function testRun_success() {
		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('delete');
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));

		$this->repairStep->run($this->output);
	}

	public function testRun_success_when_Exception() {
		$folder = $this->getMockBuilder('OCP\Files\SimpleFS\ISimpleFolder')
			->getMock();
		$folder->expects($this->once())
			->method('delete')
			->will($this->throwException(new NotPermittedException()));
		$this->appData->expects($this->once())
			->method('getFolder')
			->with(OcrConstants::TESSDATA_FOLDER)
			->will($this->returnValue($folder));

		$this->repairStep->run($this->output);
	}
}
