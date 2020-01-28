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
}