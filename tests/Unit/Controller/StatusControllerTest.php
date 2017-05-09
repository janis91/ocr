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
use OCA\Ocr\Controller\StatusController;
use OCP\AppFramework\Http;
use OCA\Ocr\Service\NotFoundException;


class StatusControllerTest extends TestCase {

    protected $cut;

    protected $requestMock;

    protected $statusServiceMock;

    public function setUp() {
        $this->requestMock = $this->getMockBuilder('OCP\IRequest')
            ->getMock();
        $this->statusServiceMock = $this->getMockBuilder('OCA\Ocr\Service\StatusService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->cut = new StatusController('ocr', $this->requestMock, $this->statusServiceMock);
    }

    public function testGetStatus() {
        $message = 'status';
        $this->statusServiceMock->expects($this->once())
            ->method('getStatus')
            ->will($this->returnValue($message));
        $result = $this->cut->getStatus();
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testGetStatusNotFound() {
        $message = 'Error Message.';
        $this->statusServiceMock->expects($this->once())
            ->method('getStatus')
            ->will($this->throwException(new NotFoundException($message)));
        $result = $this->cut->getStatus();
        $this->assertEquals($message, $result->getData());
        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }
}