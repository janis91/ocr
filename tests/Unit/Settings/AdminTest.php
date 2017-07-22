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
namespace OCA\Ocr\Tests\Unit\Settings;

use OCA\Ocr\Tests\Unit\TestCase;
use OCA\Ocr\Settings\Admin;
use OCA\Ocr\Constants\OcrConstants;


class AdminTest extends TestCase {

    protected $cut;

    protected $configMock;

    protected $appName = 'ocr';

    public function setUp() {
        $this->configMock = $this->getMockBuilder('OCP\IConfig')
            ->getMock();
        $this->cut = new Admin($this->configMock);
    }

    public function testGetForm() {
        $this->configMock->expects($this->exactly(5))
            ->method('getAppValue')
            ->withConsecutive(
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::LANGUAGES_CONFIG_KEY)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PORT)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_DB)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PASSWORD)
                ])
            ->will($this->onConsecutiveCalls('deu;eng', '127.0.0.1', '6379', '0', 'OCR'));
        $result = $this->cut->getForm();
        $this->assertEquals('settings-admin', $result->getTemplateName());
        $this->assertEquals('deu;eng', $result->getParams()[OcrConstants::LANGUAGES_CONFIG_KEY]);
        $this->assertEquals('127.0.0.1', $result->getParams()[OcrConstants::REDIS_CONFIG_KEY_HOST]);
        $this->assertEquals('6379', $result->getParams()[OcrConstants::REDIS_CONFIG_KEY_PORT]);
        $this->assertEquals('0', $result->getParams()[OcrConstants::REDIS_CONFIG_KEY_DB]);
        $this->assertEquals('OCR', $result->getParams()[OcrConstants::REDIS_CONFIG_KEY_PASSWORD]);
    }

    public function testGetFormWithEmptyConfig() {
        $this->configMock->expects($this->exactly(5))
            ->method('getAppValue')
            ->withConsecutive(
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::LANGUAGES_CONFIG_KEY)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PORT)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_DB)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PASSWORD)
                ])
            ->will($this->onConsecutiveCalls('', '', '', '', null));
        $result = $this->cut->getForm();
        $this->assertEquals('settings-admin', $result->getTemplateName());
        $this->assertEmpty($result->getParams()[OcrConstants::LANGUAGES_CONFIG_KEY]);
        $this->assertEmpty($result->getParams()[OcrConstants::REDIS_CONFIG_KEY_HOST]);
        $this->assertEmpty($result->getParams()[OcrConstants::REDIS_CONFIG_KEY_PORT]);
        $this->assertEmpty($result->getParams()[OcrConstants::REDIS_CONFIG_KEY_DB]);
        $this->assertNull($result->getParams()[OcrConstants::REDIS_CONFIG_KEY_PASSWORD]);
    }

    public function testGetSection() {
        $result = $this->cut->getSection();
        $this->assertEquals($this->appName, $result);
    }

    public function testGetPriority() {
        $result = $this->cut->getPriority();
        $this->assertEquals(0, $result);
    }
}