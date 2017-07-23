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
namespace OCA\Ocr\Tests\Unit\Hooks;

use Test\TestCase;
use OCA\Ocr\Hooks\UserHooks;


class UserHooksTest extends TestCase {

    protected $cut;

    protected $userManagerMock;

    protected $ocrJobMapperMock;

    protected $loggerMock;

    public function setUp() {
        $this->ocrJobMapperMock = $this->getMockBuilder('OCA\Ocr\Db\OcrJobMapper')
            ->disableOriginalConstructor()
            ->getMock();
        $this->userManagerMock = $this->getMockBuilder('OCP\IUserManager')
            ->setMethods([
                'listen'
        ])
            ->disableOriginalConstructor()
            ->getMockForAbstractClass();
        $this->loggerMock = $this->getMockBuilder('OCP\ILogger')
            ->getMock();
        $this->cut = new UserHooks($this->userManagerMock, $this->ocrJobMapperMock, $this->loggerMock);
    }

    public function testRegister() {
        $this->userManagerMock->expects($this->once())
            ->method('listen')
            ->with('\OC\User', 'postDelete', $this->isType('callable'));
        $this->cut->register();
    }
}