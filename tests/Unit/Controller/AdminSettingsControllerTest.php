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
use OCA\Ocr\Controller\AdminSettingsController;
use OCA\Ocr\Constants\OcrConstants;
use OCP\AppFramework\Http;


class AdminSettingsControllerTest extends TestCase {

    protected $cut;

    protected $l10nMock;

    protected $requestMock;

    protected $appConfigServiceMock;

    protected $userId = 'john';

    public function setUp() {
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->requestMock = $this->getMockBuilder('OCP\IRequest')
            ->getMock();
        $this->appConfigServiceMock = $this->getMockBuilder('OCA\Ocr\Service\AppConfigService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->cut = new AdminSettingsController('ocr', $this->requestMock, $this->l10nMock, $this->appConfigServiceMock, 
                $this->userId);
    }

    public function testGetLanguages() {
        $message = 'deu;eng';
        $this->appConfigServiceMock->expects($this->once())
            ->method('getAppValue')
            ->with($this->equalTo(OcrConstants::LANGUAGES_CONFIG_KEY))
            ->will($this->returnValue($message));
        $result = $this->cut->getLanguages();
        $this->assertEquals([
                'languages' => $message
        ], $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testEvaluateRedisSettings() {
        $message = true;
        $this->appConfigServiceMock->expects($this->once())
            ->method('evaluateRedisSettings')
            ->will($this->returnValue($message));
        $result = $this->cut->evaluateRedisSettings();
        $this->assertEquals([
                'set' => $message
        ], $result->getData());
        $this->assertEquals(Http::STATUS_OK, $result->getStatus());
    }

    public function testSetLanguages() {
        $languages = 'deu;spa';
        $this->appConfigServiceMock->expects($this->once())
            ->method('setAppValue')
            ->with(OcrConstants::LANGUAGES_CONFIG_KEY, $languages);
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Saved')
            ->will($this->returnValue('Saved'));
        $result = $this->cut->setLanguages($languages);
        $this->assertEquals('Saved', $result->getData());
    }

    public function testSetRedis() {
        $redisHost = '127.0.0.1';
        $redisPort = '6379';
        $redisDb = '0';
        $this->appConfigServiceMock->expects($this->exactly(3))
            ->method('setAppValue')
            ->withConsecutive([
                OcrConstants::REDIS_CONFIG_KEY_HOST,
                $redisHost
        ], [
                OcrConstants::REDIS_CONFIG_KEY_PORT,
                $redisPort
        ], [
                OcrConstants::REDIS_CONFIG_KEY_DB,
                $redisDb
        ]);
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with('Saved')
            ->will($this->returnValue('Saved'));
        $result = $this->cut->setRedis($redisHost, $redisPort, $redisDb);
        $this->assertEquals('Saved', $result->getData());
    }
}