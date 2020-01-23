<?php
/**
 * Nextcloud - OCR
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
namespace OCA\Ocr\AppInfo;
return [
	'routes' => [
		//settings
		['name' => 'personal_settings#set', 'url' => 'api/personal/languages', 'verb' => 'POST'],
		['name' => 'personal_settings#get', 'url' => 'api/personal/languages', 'verb' => 'GET'],
		['name' => 'tessdata#getFile', 'url' => 'tessdata/{file}', 'verb' => 'GET'],
	],
];