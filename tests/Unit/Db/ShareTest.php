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

namespace OCA\Ocr\Tests\Unit\Db;

use OCA\Ocr\Db\Share;
use OCA\Ocr\Tests\Unit\TestCase;

class ShareTest extends TestCase {

	public function testConstruct() {
		$share = new Share();
		$share->setId(3);

		$this->assertEquals(3, $share->getId());
	}
}