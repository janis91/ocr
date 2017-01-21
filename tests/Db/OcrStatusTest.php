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

namespace OCA\Ocr\Tests\Db;


use OCA\Ocr\Db\OcrStatus;
use OCA\Ocr\Tests\TestCase;

class OcrStatusTest extends TestCase {

	public function testConstruct() {
		$status = new OcrStatus();
		$status->setId(3);
		$status->setStatus('status');
		$status->setSource('source');
		$status->setTarget('target');
		$status->setTempFile('temp');
		$status->setUserId('john');
		$status->setType('type');
		$status->setErrorDisplayed(true);

		$this->assertEquals(3, $status->getId());
		$this->assertEquals('status', $status->getStatus());
		$this->assertEquals('source', $status->getSource());
		$this->assertEquals('target', $status->getTarget());
		$this->assertEquals('temp', $status->getTempFile());
		$this->assertEquals('john', $status->getUserId());
		$this->assertEquals('type', $status->getType());
		$this->assertEquals(true, $status->getErrorDisplayed());
	}

	public function testSerialize() {
		$status = new OcrStatus();
		$status->setId(3);
		$status->setStatus('status');
		$status->setSource('source');
		$status->setTarget('target');
		$status->setTempFile('temp');
		$status->setUserId('john');
		$status->setType('type');
		$status->setErrorDisplayed(true);

		$this->assertEquals([
			'id' => 3,
			'status' => 'status',
			'source' => 'source',
			'target' => 'target',
			'tempFile' => 'temp',
			'userId' => 'john',
			'type' => 'type',
			'errorDisplayed' => true
		], $status->jsonSerialize());
	}
}