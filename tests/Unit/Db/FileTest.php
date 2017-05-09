<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Db;

use OCA\Ocr\Db\File;
use OCA\Ocr\Tests\Unit\TestCase;


class FileTest extends TestCase {

    public function testConstruct() {
        $file = new File();
        $file->setId(3);
        $this->assertEquals(3, $file->getId());
    }
}