<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * 
 * @author Joas Schilling <coding@schilljs.com>
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Copyright (c) 2016, Joas Schilling <coding@schilljs.com>
 * @copyright Janis Koehr 2019
 */
if (!defined('PHPUNIT_RUN')) {
    define('PHPUNIT_RUN', 1);
}
require_once __DIR__ . '/../../../../lib/base.php';

if (!class_exists('\PHPUnit\Framework\TestCase')) {
    require_once ('PHPUnit/Autoload.php');
}

\OC_App::loadApp('ocr');
OC_Hook::clear();
