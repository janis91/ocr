<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Service;

use Test\TestCase;
use OCA\Ocr\Service\StatusService;


class StatusServiceTest extends TestCase {

    protected $cut;

    protected $loggerMock;

    protected $l10nMock;

    protected $jobMapperMock;

    protected $userId = 'john';

    protected $jobServiceMock;

    public function setUp() {
        $this->jobMapperMock = $this->getMockBuilder('OCA\Ocr\Db\OcrJobMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->loggerMock = $this->getMockBuilder('OCP\ILogger')
            ->getMock();
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->jobServiceMock = $this->getMockBuilder('OCA\Ocr\Service\JobService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->cut = new StatusService($this->l10nMock, $this->loggerMock, $this->userId, $this->jobMapperMock, 
                $this->jobServiceMock);
    }

    public function testGetStatus() {
        $this->jobServiceMock->expects($this->once())
            ->method('checkForFinishedJobs');
        $this->jobMapperMock->expects($this->once())
            ->method('findAllProcessed')
            ->with($this->userId)
            ->will($this->returnValue([
                1,
                2,
                3
        ]));
        $this->jobServiceMock->expects($this->once())
            ->method('handleProcessed');
        $this->jobMapperMock->expects($this->once())
            ->method('findAllPending')
            ->with($this->userId)
            ->will($this->returnValue([
                3,
                4,
                5,
                6
        ]));
        $this->jobMapperMock->expects($this->once())
            ->method('findAllFailed')
            ->with($this->userId)
            ->will($this->returnValue([
                7,
                8
        ]));
        $this->jobServiceMock->expects($this->once())
            ->method('handleFailed');
        $result = $this->cut->getStatus();
        $this->assertEquals([
                'processed' => 3,
                'failed' => 2,
                'pending' => 4
        ], $result);
    }
}