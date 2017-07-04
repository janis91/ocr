<?php

/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
namespace OCA\Ocr\Tests\Unit\Settings;

use OCA\Ocr\Tests\Unit\TestCase;
use OCA\Ocr\Settings\Section;


class SectionTest extends TestCase {
    
    protected $cut;
    
    protected $l10nMock;
    
    public function setUp() {
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
        ->getMock();
        $this->cut = new Section($this->l10nMock);
    }
    
    public function testGetID() {
        $result = $this->cut->getID();
        $this->assertEquals('ocr', $result);
    }
    
    public function testGetName() {
        $this->l10nMock->expects($this->once())->method('t')->with($this->equalTo('OCR'))->will($this->returnValue('OCR'));
        $result = $this->cut->getName();
        $this->assertEquals('OCR', $result);
    }
    
    public function testGetPriority() {
        $result = $this->cut->getPriority();
        $this->assertEquals(75, $result);
    }
    
    public function testGetIcon() {
        $result = $this->cut->getIcon();
        $this->assertEquals('/apps/ocr/img/icon/ocr.svg', $result);
    }
}