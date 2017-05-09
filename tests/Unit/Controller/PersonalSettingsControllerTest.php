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

use OCA\Ocr\Controller\PersonalSettingsController;
use OCA\Ocr\Tests\Unit\TestCase;
use OCP\Template;


class PersonalSettingsControllerTest extends TestCase {

    protected $cut;

    protected $request;

    public function setUp() {
        $this->request = $this->getMockBuilder('OCP\IRequest')
            ->getMock();
        $this->cut = new PersonalSettingsController('ocr', $this->request);
    }

    public function testDisplayPanel() {
        $result = $this->cut->displayPanel();
        $this->assertTrue($result instanceof Template);
    }
}