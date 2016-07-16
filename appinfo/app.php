<?php
/**
 * ownCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

namespace OCA\Ocr\AppInfo;

use OCP\Util;

//TODO: only include it if Files app is active
$eventDispatcher = \OC::$server->getEventDispatcher();
$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function() {
	Util::addScript('ocr', "script");
	Util::addStyle('ocr', 'style');
});
