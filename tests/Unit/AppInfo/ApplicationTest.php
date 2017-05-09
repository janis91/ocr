<?php

/**
 *
 * @copyright Copyright (c) 2016, nextcloud GmbH
 * @author Joas Schilling <coding@schilljs.com>
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @license AGPL-3.0
 *          This code is free software: you can redistribute it and/or modify
 *          it under the terms of the GNU Affero General Public License, version 3,
 *          as published by the Free Software Foundation.
 *          This program is distributed in the hope that it will be useful,
 *          but WITHOUT ANY WARRANTY; without even the implied warranty of
 *          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *          GNU Affero General Public License for more details.
 *          You should have received a copy of the GNU Affero General Public License, version 3,
 *          along with this program. If not, see <http://www.gnu.org/licenses/>
 */
namespace OCA\Ocr\Tests\Unit\AppInfo;

use OCA\Ocr\AppInfo\Application;
use OCA\Ocr\Tests\Unit\TestCase;


/**
 * Class ApplicationTest
 * @group DB
 * 
 * @package OCA\Ocr\Tests\Unit\AppInfo
 */
class ApplicationTest extends TestCase {

    /** @var \OCA\Ocr\AppInfo\Application */
    protected $app;

    /** @var \OCP\AppFramework\IAppContainer */
    protected $container;

    protected function setUp() {
        parent::setUp();
        $this->app = new Application();
        $this->container = $this->app->getContainer();
    }

    public function testContainerAppName() {
        $this->app = new Application();
        $this->assertEquals('ocr', $this->container->getAppName());
    }

    public function queryData() {
        return array(
                array(
                        'PHPUtil',
                        'OCA\Ocr\Util\PHPUtil'
                ),
                array(
                        'FileUtil',
                        'OCA\Ocr\Util\FileUtil'
                ),
                array(
                        'RedisUtil',
                        'OCA\Ocr\Util\RedisUtil'
                ),
                array(
                        'OcrJobMapper',
                        'OCA\Ocr\Db\OcrJobMapper'
                ),
                array(
                        'FileMapper',
                        'OCA\Ocr\Db\FileMapper'
                ),
                array(
                        'ShareMapper',
                        'OCA\Ocr\Db\ShareMapper'
                ),
                array(
                        'AppConfigService',
                        'OCA\Ocr\Service\AppConfigService'
                ),
                array(
                        'FileService',
                        'OCA\Ocr\Service\FileService'
                ),
                array(
                        'RedisService',
                        'OCA\Ocr\Service\RedisService'
                ),
                array(
                        'JobService',
                        'OCA\Ocr\Service\JobService'
                ),
                array(
                        'StatusService',
                        'OCA\Ocr\Service\StatusService'
                ),
                array(
                        'StatusController',
                        'OCP\AppFramework\Controller'
                ),
                array(
                        'JobController',
                        'OCP\AppFramework\Controller'
                ),
                array(
                        'PersonalSettingsController',
                        'OCP\AppFramework\Controller'
                )
        );
    }

    /**
     * @dataProvider queryData
     * 
     * @param string $service            
     * @param string $expected            
     */
    public function testContainerQuery($service, $expected) {
        $this->assertTrue($this->container->query($service) instanceof $expected);
    }
}