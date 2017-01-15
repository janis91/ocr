<?php
/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2016
 */

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\Ocr\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */
return [
    'routes' => [
		['name' => 'ocr#process', 'url' => '/', 'verb' => 'POST'],
		['name' => 'ocr#languages', 'url' => '/', 'verb' => 'GET'],
		['name' => 'ocr#status', 'url' => '/status', 'verb' => 'GET'],
		['name' => 'PersonalSettings#deleteStatus', 'url' => '/settings/personal', 'verb' => 'DELETE'],
		['name' => 'PersonalSettings#getAll', 'url' => '/settings/personal', 'verb' => 'GET']
    ]
];