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

use OCA\Ocr\Tests\Unit\TestCase;
use OCA\Ocr\Db\OcrJob;


class OcrJobTest extends TestCase {

    public function testConstruct() {
        $job = new OcrJob();
        $job->setId(3);
        $job->setStatus('status');
        $job->setSource('source');
        $job->setTarget('target');
        $job->setTempFile('temp');
        $job->setUserId('john');
        $job->setType('type');
        $job->setErrorDisplayed(true);
        $job->setOriginalFilename('originalFilename');
        $job->setErrorLog('errorLog');
        $job->setReplace(true);
        $this->assertEquals(3, $job->getId());
        $this->assertEquals('status', $job->getStatus());
        $this->assertEquals('source', $job->getSource());
        $this->assertEquals('target', $job->getTarget());
        $this->assertEquals('temp', $job->getTempFile());
        $this->assertEquals('john', $job->getUserId());
        $this->assertEquals('type', $job->getType());
        $this->assertEquals(true, $job->getErrorDisplayed());
        $this->assertEquals('originalFilename', $job->getOriginalFilename());
        $this->assertEquals('errorLog', $job->getErrorLog());
        $this->assertEquals(true, $job->getReplace());
    }

    public function testSerialize() {
        $job = new OcrJob();
        $job->setId(3);
        $job->setStatus('status');
        $job->setSource('source');
        $job->setTarget('target');
        $job->setTempFile('temp');
        $job->setUserId('john');
        $job->setType('type');
        $job->setErrorDisplayed(true);
        $job->setOriginalFilename('originalFilename');
        $job->setErrorLog('errorLog');
        $job->setReplace(true);
        $this->assertEquals(
                [
                        'id' => 3,
                        'status' => 'status',
                        'source' => 'source',
                        'target' => 'target',
                        'tempFile' => 'temp',
                        'userId' => 'john',
                        'type' => 'type',
                        'errorDisplayed' => true,
                        'originalFilename' => 'originalFilename',
                        'errorLog' => 'errorLog',
                        'replace' => true
                ], $job->jsonSerialize());
    }
}