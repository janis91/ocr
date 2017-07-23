<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Controller;

use Test\TestCase;
use OCA\Ocr\Controller\JobController;
use OCP\AppFramework\Http;
use OCA\Ocr\Service\NotFoundException;


class JobControllerTest extends TestCase {

    protected $cut;

    protected $requestMock;

    protected $jobServiceMock;

    protected $userId = 'john';

    public function setUp() {
        $this->requestMock = $this->getMockBuilder('OCP\IRequest')
            ->getMock();
        $this->jobServiceMock = $this->getMockBuilder('OCA\Ocr\Service\JobService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->cut = new JobController('ocr', $this->requestMock, $this->jobServiceMock, $this->userId);
    }

    public function testProcess() {
        $message = 'PROCESSING';
        $this->jobServiceMock->expects($this->once())
            ->method('process')
            ->with('language', 'files', true)
            ->will($this->returnValue($message));
        $result = $this->cut->process('language', 'files', true);
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testProcessNotFound() {
        $message = 'Error Message.';
        $this->jobServiceMock->expects($this->once())
            ->method('process')
            ->will($this->throwException(new NotFoundException($message)));
        $result = $this->cut->process('', '', false);
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }

    public function testGetAllJobs() {
        $message = 'all jobs';
        $this->jobServiceMock->expects($this->once())
            ->method('getAllJobsForUser')
            ->with($this->equalTo($this->userId))
            ->will($this->returnValue($message));
        $result = $this->cut->getAllJobs();
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testGetAllJobsNotFound() {
        $message = 'Error Message.';
        $this->jobServiceMock->expects($this->once())
            ->method('getAllJobsForUser')
            ->will($this->throwException(new NotFoundException($message)));
        $result = $this->cut->getAllJobs();
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }

    public function testDeleteJob() {
        $message = 'deleted';
        $id = 4;
        $this->jobServiceMock->expects($this->once())
            ->method('deleteJob')
            ->with($this->equalTo($id), $this->equalTo($this->userId))
            ->will($this->returnValue($message));
        $result = $this->cut->deleteJob($id);
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testDeleteJobNotFound() {
        $message = 'Error Message.';
        $id = 4;
        $this->jobServiceMock->expects($this->once())
            ->method('deleteJob')
            ->with($this->equalTo($id), $this->equalTo($this->userId))
            ->will($this->throwException(new NotFoundException($message)));
        $result = $this->cut->deleteJob($id);
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }
}