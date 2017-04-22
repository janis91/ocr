<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 * @author Joas Schilling <coding@schilljs.com>
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Copyright (c) 2016, Joas Schilling <coding@schilljs.com>
 * @copyright Janis Koehr 2016
 */

if (!defined('PHPUNIT_RUN')) {
	define('PHPUNIT_RUN', 1);
}
require_once __DIR__.'/../../../../lib/base.php';
// Fix for "Autoload path not allowed: .../tests/lib/testcase.php"
\OC::$loader->addValidRoot(OC::$SERVERROOT . '/tests');
// Fix for "Autoload path not allowed: .../ocr/tests/testcase.php"
\OC_App::loadApp('ocr');
if(!class_exists('PHPUnit_Framework_TestCase')) {
	require_once('PHPUnit/Autoload.php');
}
OC_Hook::clear();