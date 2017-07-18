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
use OCA\Ocr\Service\AppConfigService;
use OCA\Ocr\Constants\OcrConstants;


class AppConfigServiceTest extends TestCase {

    protected $cut;

    protected $configMock;

    protected $l10nMock;

    protected $appName = 'ocr';

    public function setUp() {
        $this->configMock = $this->getMockBuilder('OCP\IConfig')
            ->getMock();
        $this->l10nMock = $this->getMockBuilder('OCP\IL10N')
            ->getMock();
        $this->cut = new AppConfigService($this->configMock, $this->l10nMock);
    }

    public function testGetAppValue() {
        $key = 'languages';
        $this->configMock->expects($this->once())
            ->method('getAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo($key))
            ->will($this->returnValue('deu;eng'));
        $result = $this->cut->getAppValue($key);
        $this->assertEquals('deu;eng', $result);
    }

    public function testGetAppValueWithEmptyConfig() {
        $key = 'languages';
        $this->configMock->expects($this->once())
            ->method('getAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo($key))
            ->will($this->returnValue(''));
        $result = $this->cut->getAppValue($key);
        $this->assertEmpty($result);
    }

    public function testEvaluateRedisSettings() {
        $this->configMock->expects($this->exactly(3))
            ->method('getAppValue')
            ->withConsecutive(
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
                ])
            ->will($this->onConsecutiveCalls('127.0.0.1', '6379', '0'));
        $result = $this->cut->evaluateRedisSettings();
        $this->assertTrue($result);
    }

    public function testEvaluateRedisSettingsForEmptyHost() {
        $this->configMock->expects($this->once())
            ->method('getAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST))
            ->will($this->returnValue(''));
        $result = $this->cut->evaluateRedisSettings();
        $this->assertFalse($result);
    }

    public function testEvaluateRedisSettingsForEmptyPort() {
        $this->configMock->expects($this->exactly(2))
            ->method('getAppValue')
            ->withConsecutive(
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST)
                ], 
                [
                        $this->equalTo($this->appName),
                        $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PORT)
                ])
            ->will($this->onConsecutiveCalls('127.0.0.1', ''));
        $result = $this->cut->evaluateRedisSettings();
        $this->assertFalse($result);
    }

    public function testEvaluateRedisSettingsForEmptyDb() {
        $this->configMock->expects($this->exactly(3))
            ->method('getAppValue')
            ->withConsecutive(
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
                ])
            ->will($this->onConsecutiveCalls('127.0.0.1', '6379', ''));
        $result = $this->cut->evaluateRedisSettings();
        $this->assertFalse($result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The given settings key is empty.
     */
    public function testSetAppValueForKeyEmpty() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The given settings key is empty.'))
            ->will($this->returnValue('The given settings key is empty.'));
        $this->cut->setAppValue('', 'any');
    }

    public function testSetAppValueLanguagesSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::LANGUAGES_CONFIG_KEY), 
                $this->equalTo('deu;eng;deu-frak;spa'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::LANGUAGES_CONFIG_KEY, 'deu;eng;deu-frak;spa');
        $this->assertTrue($result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The languages are not specified in the correct format.
     */
    public function testSetAppValueLanguagesForValueEmpty() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The languages are not specified in the correct format.'))
            ->will($this->returnValue('The languages are not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::LANGUAGES_CONFIG_KEY, '');
    }

    /**
     * Makes sure that the regular expression works.
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The languages are not specified in the correct format.
     */
    public function testSetAppValueLanguagesForValueWrong() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The languages are not specified in the correct format.'))
            ->will($this->returnValue('The languages are not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::LANGUAGES_CONFIG_KEY, 'deu,eng');
    }

    /**
     * Makes sure that the regular expression works.
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The languages are not specified in the correct format.
     */
    public function testSetAppValueLanguagesForValueWrong2() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The languages are not specified in the correct format.'))
            ->will($this->returnValue('The languages are not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::LANGUAGES_CONFIG_KEY, 'deu;deu_frak');
    }

    public function testSetAppValueRedisHostForIPSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST), 
                $this->equalTo('127.0.0.1'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, '127.0.0.1');
        $this->assertTrue($result);
    }

    public function testSetAppValueRedisHostForHostNameSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST), 
                $this->equalTo('google.de'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, 'google.de');
        $this->assertTrue($result);
    }

    public function testSetAppValueRedisHostForLocalhostSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_HOST), 
                $this->equalTo('localhost'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, 'localhost');
        $this->assertTrue($result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis host is not specified in the correct format.
     */
    public function testSetAppValueRedisHostForValueEmpty() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis host is not specified in the correct format.'))
            ->will($this->returnValue('The Redis host is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, '');
    }

    /**
     * Makes sure that the regular expression works.
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis host is not specified in the correct format.
     */
    public function testSetAppValueRedisHostForValueWrong() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis host is not specified in the correct format.'))
            ->will($this->returnValue('The Redis host is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, 'http://localhost');
    }

    /**
     * Makes sure that the regular expression works.
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis host is not specified in the correct format.
     */
    public function testSetAppValueRedisHostForValueWrong2() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis host is not specified in the correct format.'))
            ->will($this->returnValue('The Redis host is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_HOST, '127.0.0.1:6379');
    }

    public function testSetAppValueRedisPortSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_PORT), 
                $this->equalTo('6379'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, '6379');
        $this->assertTrue($result);
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis port number is not specified in the correct format.
     */
    public function testSetAppValueRedisPortForValueEmpty() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis port number is not specified in the correct format.'))
            ->will($this->returnValue('The Redis port number is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, '');
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis port number is not specified in the correct format.
     */
    public function testSetAppValueRedisPortForValueWrong() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis port number is not specified in the correct format.'))
            ->will($this->returnValue('The Redis port number is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, 'some string');
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis port number is not specified in the correct format.
     */
    public function testSetAppValueRedisPortForValueNegative() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis port number is not specified in the correct format.'))
            ->will($this->returnValue('The Redis port number is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, '-3');
    }

    /**
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis port number is not specified in the correct format.
     */
    public function testSetAppValueRedisPortForValueToHigh() {
        $this->l10nMock->expects($this->once())
            ->method('t')
            ->with($this->equalTo('The Redis port number is not specified in the correct format.'))
            ->will($this->returnValue('The Redis port number is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_PORT, '65536');
    }

    public function testSetAppValueRedisDbSuccessfully() {
        $this->configMock->expects($this->once())
            ->method('setAppValue')
            ->with($this->equalTo($this->appName), $this->equalTo(OcrConstants::REDIS_CONFIG_KEY_DB), 
                $this->equalTo('0'))
            ->will($this->returnValue(true));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_DB, '0');
        $this->assertTrue($result);
    }
    
    /**
     * 
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis DB is not specified in the correct format.
     */
    public function testSetAppValueRedisDbForValueEmpty() {
        $this->l10nMock->expects($this->once())
        ->method('t')
        ->with($this->equalTo('The Redis DB is not specified in the correct format.'))
        ->will($this->returnValue('The Redis DB is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_DB, '');
    }
    
    /**
     * Makes sure that the regular expression works.
     * @expectedException OCA\Ocr\Service\NotFoundException
     * @expectedExceptionMessage The Redis DB is not specified in the correct format.
     */
    public function testSetAppValueRedisDbForValueNegative() {
        $this->l10nMock->expects($this->once())
        ->method('t')
        ->with($this->equalTo('The Redis DB is not specified in the correct format.'))
        ->will($this->returnValue('The Redis DB is not specified in the correct format.'));
        $result = $this->cut->setAppValue(OcrConstants::REDIS_CONFIG_KEY_DB, '-3');
    }
}
